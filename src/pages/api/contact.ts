import type { APIRoute } from 'astro';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const esc = (s: string) =>
  String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Petición inválida.' }, 400);
  }

  // Honeypot: si un bot rellena el campo oculto, fingimos éxito y descartamos.
  if (data.website) return json({ ok: true });

  const nombre = (data.nombre || '').trim();
  const email = (data.email || '').trim();
  const mensaje = (data.mensaje || '').trim();
  const empresa = (data.empresa || '').trim();
  const servicio = (data.servicio || '').trim();

  if (!nombre || !email || !mensaje) {
    return json({ error: 'Completa nombre, email y mensaje.' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Email no válido.' }, 400);
  }

  // Bindings/vars de Cloudflare (solo en runtime del worker).
  let EMAIL: any, TO: string | undefined, FROM: string | undefined;
  try {
    const mod: any = await import('cloudflare:workers');
    EMAIL = mod.env?.EMAIL;
    TO = mod.env?.CONTACT_TO_EMAIL;
    FROM = mod.env?.CONTACT_FROM_EMAIL;
  } catch {
    /* en dev (Node) no existe cloudflare:workers */
  }

  const subject = `Nuevo contacto web — ${nombre}${empresa ? ` (${empresa})` : ''}`;
  const text =
    `Nombre: ${nombre}\n` +
    `Email: ${email}\n` +
    `Empresa: ${empresa || '—'}\n` +
    `Servicio: ${servicio || '—'}\n\n` +
    `Mensaje:\n${mensaje}\n`;
  const html =
    `<h2>Nuevo contacto desde la web</h2>` +
    `<p><strong>Nombre:</strong> ${esc(nombre)}</p>` +
    `<p><strong>Email:</strong> ${esc(email)}</p>` +
    `<p><strong>Empresa:</strong> ${esc(empresa) || '—'}</p>` +
    `<p><strong>Servicio:</strong> ${esc(servicio) || '—'}</p>` +
    `<p><strong>Mensaje:</strong></p><p>${esc(mensaje).replace(/\n/g, '<br>')}</p>`;

  // Dev (sin binding): registrar y devolver OK para poder probar el front.
  if (!EMAIL || !TO || !FROM) {
    console.log('[contact] (sin binding EMAIL — dev/no configurado) lead:', {
      nombre, email, empresa, servicio, mensaje,
    });
    return json({ ok: true });
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
    return json({ error: 'No se pudo enviar ahora mismo. Escríbenos directamente por email.' }, 502);
  }

  return json({ ok: true });
};
