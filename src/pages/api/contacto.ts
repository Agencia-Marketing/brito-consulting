import type { APIRoute } from 'astro';

export const prerender = false;

// ─── Configuración ──────────────────────────────────────────────────────────
// Destinatario de los leads. PLACEHOLDER: cambiar por el correo real que debe
// recibir los mensajes del formulario.
const DESTINATARIO = 'programacionagencia2@gmail.com';

// Remitente: nombre visible del sitio; dominio verificado en Resend
// (notify.programacionconecta.com, compartido entre sitios de la agencia).
const REMITENTE = 'Brito Consulting <notificaciones@notify.programacionconecta.com>';

// Límites de longitud para evitar payloads abusivos.
const LIMITES = { nombre: 120, email: 190, empresa: 160, servicio: 120, mensaje: 5000 };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const field = (value: unknown) => String(value ?? '').trim();

// Escapa caracteres HTML para el cuerpo del correo (evita inyección en el HTML).
const esc = (s: string) =>
  String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));

// Lee secrets: en el Worker vía `cloudflare:workers`; en dev (Node) desde
// process.env. Mismo patrón que checkout.ts. NUNCA hardcodear las claves.
const getEnv = async () => {
  let cfEnv: Record<string, any> | undefined;
  try {
    const mod: any = await import('cloudflare:workers');
    cfEnv = mod.env;
  } catch {
    /* cloudflare:workers solo existe en el runtime de Cloudflare */
  }
  const nodeEnv = typeof process !== 'undefined' ? process.env : undefined;
  return {
    RESEND_API_KEY: field(cfEnv?.RESEND_API_KEY ?? nodeEnv?.RESEND_API_KEY),
    TURNSTILE_SECRET_KEY: field(cfEnv?.TURNSTILE_SECRET_KEY ?? nodeEnv?.TURNSTILE_SECRET_KEY),
  };
};

// Verifica el token de Turnstile contra Cloudflare siteverify.
const verificarTurnstile = async (token: string, secret: string, ip: string) => {
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const data: any = await res.json().catch(() => null);
    return Boolean(data?.success);
  } catch {
    return false;
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Petición inválida.' }, 400);
  }
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  // ── Honeypot: bot rellena el campo oculto → fingimos éxito y descartamos ──
  if (field(data.website)) return json({ ok: true });

  // ── Campos reales del formulario ──
  const nombre = field(data.nombre);
  const email = field(data.email);
  const empresa = field(data.empresa);
  const servicio = field(data.servicio);
  const mensaje = field(data.mensaje);
  // Turnstile inyecta este campo oculto en el form; viaja en el FormData.
  const token = field(data['cf-turnstile-response']);

  // ── Validación de servidor ──
  if (!nombre || !email || !mensaje) {
    return json({ error: 'Completa nombre, email y mensaje.' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Email no válido.' }, 400);
  }
  if (
    nombre.length > LIMITES.nombre ||
    email.length > LIMITES.email ||
    empresa.length > LIMITES.empresa ||
    servicio.length > LIMITES.servicio ||
    mensaje.length > LIMITES.mensaje
  ) {
    return json({ error: 'Algún campo excede la longitud permitida.' }, 400);
  }
  if (!token) {
    return json({ error: 'Confirma que no eres un robot.' }, 400);
  }

  const { RESEND_API_KEY, TURNSTILE_SECRET_KEY } = await getEnv();
  if (!RESEND_API_KEY || !TURNSTILE_SECRET_KEY) {
    console.error('[contacto] faltan RESEND_API_KEY o TURNSTILE_SECRET_KEY');
    return json({ error: 'El formulario no está configurado todavía.' }, 500);
  }

  // ── Turnstile ANTES de enviar el correo ──
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const humano = await verificarTurnstile(token, TURNSTILE_SECRET_KEY, ip);
  if (!humano) {
    return json({ error: 'No pudimos verificar que no eres un robot. Inténtalo de nuevo.' }, 400);
  }

  // ── Envío vía API HTTP de Resend ──
  const subject = `Nuevo contacto web — ${nombre}${empresa ? ` (${empresa})` : ''}`;
  const text =
    `Nombre: ${nombre}\n` +
    `Email: ${email}\n` +
    `Empresa: ${empresa || '-'}\n` +
    `Servicio: ${servicio || '-'}\n\n` +
    `Mensaje:\n${mensaje}\n`;
  const html =
    `<h2>Nuevo contacto desde la web</h2>` +
    `<p><strong>Nombre:</strong> ${esc(nombre)}</p>` +
    `<p><strong>Email:</strong> ${esc(email)}</p>` +
    `<p><strong>Empresa:</strong> ${esc(empresa) || '-'}</p>` +
    `<p><strong>Servicio:</strong> ${esc(servicio) || '-'}</p>` +
    `<p><strong>Mensaje:</strong></p><p>${esc(mensaje).replace(/\n/g, '<br>')}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: DESTINATARIO,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      // No filtramos el cuerpo de error de Resend al cliente; solo log interno.
      const detalle = await res.text().catch(() => '');
      console.error('[contacto] Resend respondió', res.status, detalle);
      return json({ error: 'No se pudo enviar ahora mismo. Escríbenos directamente por email.' }, 502);
    }
  } catch (err) {
    console.error('[contacto] fallo de red con Resend:', err);
    return json({ error: 'No se pudo enviar ahora mismo. Escríbenos directamente por email.' }, 502);
  }

  return json({ ok: true });
};
