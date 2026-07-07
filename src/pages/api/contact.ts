import type { APIRoute } from 'astro';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

type EmailBinding = {
  send: (message: {
    to: string;
    from: string | { email: string; name?: string };
    replyTo?: string;
    subject: string;
    text: string;
    html: string;
  }) => Promise<unknown>;
};

const esc = (s: string) =>
  String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));

const field = (value: unknown) => String(value ?? '').trim();

const getContactEnv = async () => {
  let cfEnv: Record<string, any> | undefined;
  try {
    const mod: any = await import('cloudflare:workers');
    cfEnv = mod.env;
  } catch {
    /* cloudflare:workers solo existe en el runtime de Cloudflare */
  }

  const nodeEnv = typeof process !== 'undefined' ? process.env : undefined;

  return {
    EMAIL: cfEnv?.EMAIL as EmailBinding | undefined,
    TO: field(cfEnv?.CONTACT_TO_EMAIL ?? nodeEnv?.CONTACT_TO_EMAIL),
    FROM: field(cfEnv?.CONTACT_FROM_EMAIL ?? nodeEnv?.CONTACT_FROM_EMAIL),
  };
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Peticion invalida.' }, 400);
  }

  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  // Honeypot: si un bot rellena el campo oculto, fingimos exito y descartamos.
  if (field(data.website)) return json({ ok: true });

  const nombre = field(data.nombre);
  const email = field(data.email);
  const mensaje = field(data.mensaje);
  const empresa = field(data.empresa);
  const servicio = field(data.servicio);

  if (!nombre || !email || !mensaje) {
    return json({ error: 'Completa nombre, email y mensaje.' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Email no valido.' }, 400);
  }

  const subject = `Nuevo contacto web - ${nombre}${empresa ? ` (${empresa})` : ''}`;
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

  const { EMAIL, TO, FROM } = await getContactEnv();

  // Desarrollo local sin binding: permite probar el front sin enviar email real.
  if (!EMAIL) {
    console.log('[contact] sin binding EMAIL; lead recibido:', {
      nombre,
      email,
      empresa,
      servicio,
      mensaje,
    });
    return json({ ok: true });
  }

  if (!TO || !FROM) {
    console.error('[contact] faltan CONTACT_TO_EMAIL o CONTACT_FROM_EMAIL');
    return json({ error: 'El formulario no esta configurado todavia.' }, 500);
  }

  try {
    await EMAIL.send({
      to: TO,
      from: { email: FROM, name: 'Web Brito Consulting' },
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error('[contact] fallo al enviar email:', err);
    return json({ error: 'No se pudo enviar ahora mismo. Escribenos directamente por email.' }, 502);
  }

  return json({ ok: true });
};
