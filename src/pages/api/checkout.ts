import type { APIRoute } from 'astro';
import site from '../../content/site/index.json';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Localiza la opción de compra por índices dentro del contenido (fuente de
// verdad del importe). El navegador solo envía índices, nunca cantidades.
const findCompra = (tab: number, plan: number, compra: number) => {
  const t = (site as any)?.servicios?.tabs?.[tab];
  const p = t?.planes?.[plan];
  const c = p?.compras?.[compra];
  if (!p || !c) return null;
  return { plan: p, compra: c };
};

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Petición inválida.' }, 400);
  }

  const tab = Number(body.tab);
  const plan = Number(body.plan);
  const compra = Number(body.compra);
  if (![tab, plan, compra].every((n) => Number.isInteger(n) && n >= 0)) {
    return json({ error: 'Referencia de producto inválida.' }, 400);
  }

  const found = findCompra(tab, plan, compra);
  if (!found) return json({ error: 'Producto no encontrado.' }, 400);

  const importe = Number(found.compra.importe_usd);
  if (!Number.isInteger(importe) || importe < 1) {
    return json({ error: 'Este plan no está disponible para compra online.' }, 400);
  }

  const etiqueta = String(found.compra.etiqueta || '').trim();
  const nombre = String(found.plan.nombre || 'Servicio');
  const productName =
    etiqueta && etiqueta.toLowerCase() !== 'pago único' ? `${nombre} — ${etiqueta}` : nombre;

  // Clave secreta de Stripe: en el Worker vía cloudflare:workers; en dev (Node)
  // fallback a process.env. (Mismo patrón que api/contact.ts.)
  let STRIPE_SECRET_KEY: string | undefined;
  try {
    const mod: any = await import('cloudflare:workers');
    STRIPE_SECRET_KEY = mod.env?.STRIPE_SECRET_KEY;
  } catch {
    /* en dev (Node) no existe cloudflare:workers */
  }
  if (!STRIPE_SECRET_KEY && typeof process !== 'undefined') {
    STRIPE_SECRET_KEY = process.env?.STRIPE_SECRET_KEY;
  }
  if (!STRIPE_SECRET_KEY) {
    console.error('[checkout] falta STRIPE_SECRET_KEY');
    return json({ error: 'El pago no está configurado todavía.' }, 500);
  }

  const origin = new URL(request.url).origin;

  // price_data dinámico: Stripe crea el producto/precio al vuelo, sin necesidad
  // de precrearlos en el dashboard.
  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('line_items[0][quantity]', '1');
  form.set('line_items[0][price_data][currency]', 'usd');
  form.set('line_items[0][price_data][unit_amount]', String(importe * 100));
  form.set('line_items[0][price_data][product_data][name]', productName);
  form.set('success_url', `${origin}/gracias`);
  form.set('cancel_url', `${origin}/#servicios`);

  let res: Response;
  try {
    res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
  } catch (err) {
    console.error('[checkout] fallo de red con Stripe:', err);
    return json({ error: 'No se pudo iniciar el pago. Inténtalo de nuevo.' }, 502);
  }

  const data: any = await res.json().catch(() => null);
  if (!res.ok || !data?.url) {
    console.error('[checkout] respuesta de Stripe:', res.status, data?.error?.message);
    return json({ error: 'No se pudo iniciar el pago. Inténtalo de nuevo.' }, 502);
  }

  return json({ url: data.url });
};
