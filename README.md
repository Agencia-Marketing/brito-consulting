# Brito Consulting — Sitio web corporativo

Sitio web *one-page* de **Brito Consulting**, agencia de marketing y consultoría de negocios.
Construido con **Astro** y editable mediante **Keystatic** (CMS open-source basado en Git).
Diseño de tema oscuro con identidad de marca monocroma (charcoal, blanco, negro).

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Gestión de contenido (Keystatic)](#gestión-de-contenido-keystatic)
- [Variables de entorno](#variables-de-entorno)
- [Diseño y marca](#diseño-y-marca)
- [Despliegue (Cloudflare)](#despliegue-cloudflare)
- [Notas y convenciones](#notas-y-convenciones)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| Framework | [Astro](https://astro.build) | `^6.4.4` |
| CMS | [Keystatic](https://keystatic.com) (`@keystatic/core` + `@keystatic/astro`) | `^0.5` / `^5.1` |
| UI del CMS | [React](https://react.dev) (solo en la ruta `/keystatic`) | `^18.3` |
| Estilos | [Tailwind CSS](https://tailwindcss.com) (vía `@tailwindcss/vite`) + CSS propio | `^4.3.0` |
| Adapter | [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) | `^13.7` |
| Lenguaje | TypeScript (config `astro/tsconfigs/strict`) | — |
| Tipografías | Bricolage Grotesque (display) + Poppins (texto) + Material Symbols | Google Fonts |

Las páginas de contenido se **prerenderizan estáticas**; solo las rutas del admin
(`/keystatic` y `/api/keystatic/...`) se sirven on-demand (SSR) a través del adapter.

## Requisitos

- **Node.js ≥ 22.12.0**
- npm

## Puesta en marcha

```sh
# 1. Instalar dependencias
npm install

# 2. Levantar el entorno de desarrollo
npm run dev
```

- Sitio: <http://localhost:4321>
- Editor de contenido (Keystatic, modo local): <http://localhost:4321/keystatic>

En desarrollo, Keystatic funciona en **modo local** (sin autenticación) y guarda los cambios
directamente en `src/content/site/index.json`.

## Scripts disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo de Astro + admin de Keystatic en `localhost:4321` |
| `npm run build` | Genera el sitio en `./dist/` (cliente estático + worker SSR del admin) |
| `npm run preview` | Sirve localmente la build |
| `npm run astro ...` | CLI de Astro (`astro add`, `astro check`, …) |

## Estructura del proyecto

```text
/
├── public/                     # Assets estáticos servidos tal cual
│   ├── brito-logo.png          # Logo principal
│   ├── brito-logo-blanco.png   # Logo para fondos oscuros
│   ├── isotipo.png             # Isotipo (usado en nav y footer)
│   ├── favicon.svg / .ico
│   └── Manual de identidad-Brito.pdf
├── src/
│   ├── content/
│   │   └── site/
│   │       └── index.json      # ÚNICA fuente de contenido del sitio (singleton de Keystatic)
│   ├── layouts/
│   │   └── Layout.astro        # Layout base: <head>, nav, footer, scripts
│   ├── pages/
│   │   ├── index.astro         # Landing one-page (todas las secciones)
│   │   ├── privacidad/         # Política de privacidad
│   │   └── terminos/           # Términos de uso
│   └── styles/
│       └── global.css          # Sistema de diseño (variables, componentes, animaciones)
├── keystatic.config.ts         # Esquema del CMS (singleton `site` con todas las secciones)
├── astro.config.mjs            # Integraciones (react, keystatic) + adapter (cloudflare)
└── wrangler.jsonc              # Config de Cloudflare (nombre, compatibility flags)
```

> Las rutas del admin (`/keystatic` y `/api/keystatic/...`) las inyecta automáticamente la
> integración `@keystatic/astro`; no existen como archivos en `src/pages`.

## Gestión de contenido (Keystatic)

Todo el contenido editable vive en un único archivo: **`src/content/site/index.json`**.
El esquema que lo expone en el editor está en **`keystatic.config.ts`** como un *singleton* `site`
con secciones: páginas legales (privacidad, términos), `meta` (SEO), `nav`, `hero`, propuesta de valor,
`servicios` (7 categorías con planes y precios), `porque`, `stats`, `portafolio`, `testimonios`,
`nosotros`, `faq`, `contacto`, `cta` y `footer`.

**Modos de almacenamiento** (conmutados por entorno en `keystatic.config.ts`):

| Entorno | Modo | Comportamiento |
| :--- | :--- | :--- |
| Desarrollo (`import.meta.env.DEV`) | `local` | Edita y guarda en el sistema de archivos, sin auth |
| Producción | `github` | Autentica con GitHub App y commitea los cambios al repo `Agencia-Marketing/brito-consulting` |

**Editar en local:** `npm run dev` → <http://localhost:4321/keystatic>. Cualquier cambio se escribe en
`src/content/site/index.json` y se refleja en el sitio.

## Variables de entorno

Solo necesarias para el **modo GitHub** (edición en producción). Ver `.env.example`.

| Variable | Uso |
| :--- | :--- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Client ID de la GitHub App |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Client secret de la GitHub App |
| `KEYSTATIC_SECRET` | Secreto aleatorio para firmar la cookie de sesión (`openssl rand -hex 32`) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Slug público de la GitHub App |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe para el cobro online (`sk_live_...` / `sk_test_...`) |

### Cobro online (Stripe Checkout)

Los botones **Comprar** de cada plan crean una sesión de Stripe Checkout en el endpoint
[`src/pages/api/checkout.ts`](src/pages/api/checkout.ts) (pago único, `mode: 'payment'`). El importe
sale del propio contenido (`compras[].importe_usd` en `index.json`), **nunca del navegador**, y Stripe
genera el producto/precio al vuelo (`price_data`) — **no hay que crear productos en el dashboard**. El
cliente solo edita etiqueta e importe en Keystatic (ver `GUIA-EDICION.md`).

Configurar la clave secreta (una vez):

```bash
# Producción (Cloudflare) — desde bash, NO PowerShell (ver aviso de secrets abajo)
printf "%s" "sk_live_..." | npx wrangler secret put STRIPE_SECRET_KEY
```

En local, poner `STRIPE_SECRET_KEY=sk_test_...` en `.env`. Prueba end-to-end con la tarjeta de test
`4242 4242 4242 4242`. Página de éxito: [`/gracias`](src/pages/gracias/index.astro).

**GitHub App** (ya creada: `brito-consulting-keystatic`). Para recrearla, el camino fácil es el
asistente de Keystatic: poner `storage` en github fijo temporalmente, `npm run dev`, abrir
`/keystatic` → **"Create GitHub App"** (GitHub rellena permisos *Contents: R&W* y escribe el `.env`).
Instalarla en el repo `Agencia-Marketing/brito-consulting`.

Callbacks de la App (admite varios):
- Producción: `https://brito-consulting.programacionagencia.workers.dev/api/keystatic/github/oauth/callback`
- Local (si se prueba modo github en dev): `http://127.0.0.1:4321/api/keystatic/github/oauth/callback`

> El asistente solo añade el callback de localhost; el de producción hay que añadirlo a mano en los
> ajustes de la GitHub App.

## Diseño y marca

- **Tema:** oscuro («gris pizarra»). Toda la paleta está centralizada en variables CSS en el
  bloque `:root` de `src/styles/global.css` — modificarlas reestiliza el sitio completo.

  | Rol | Color |
  | :--- | :--- |
  | Fondo de página | `#1A1A1C` |
  | Tarjetas | `#242427` |
  | Superficie elevada (charcoal de marca) | `#404042` |
  | Acento (títulos, botones, iconos) | `#FFFFFF` |
  | Texto principal | `#F5F5F6` |

- El guion de marca completo está en `public/Manual de identidad-Brito.pdf`.
- Sobre las superficies de acento (botones, banda de estadísticas) el texto va en oscuro
  (`#1A1A1C`) para garantizar contraste.

## Despliegue (Cloudflare)

El adapter `@astrojs/cloudflare` genera salida de **Cloudflare Workers con assets estáticos**
(`dist/client` = assets, `dist/server` = worker). Cloudflare recomienda Workers sobre Pages para
proyectos con SSR.

- **Producción:** <https://brito-consulting.programacionagencia.workers.dev>
- **Cuenta:** programacionagencia@gmail.com · **Worker:** `brito-consulting`

**Deploy:**
```sh
npm run build
# El adapter escribe la config del worker en dist/server/wrangler.json:
npx wrangler deploy -c dist/server/wrangler.json
```

Autenticación de wrangler: `wrangler login` (navegador) o un API token
(`export CLOUDFLARE_API_TOKEN=...`, permiso *Workers Scripts: Edit*).

**Secrets del worker** (las 4 vars de Keystatic, modo GitHub). Cargarlas en la cuenta correcta:
```sh
printf "%s" "VALOR" | npx wrangler secret put KEYSTATIC_GITHUB_CLIENT_ID
# ...repetir para CLIENT_SECRET, KEYSTATIC_SECRET, PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
```
> ⚠️ Cargar los secrets desde **bash/`printf`**, NO pipeando con PowerShell: PowerShell 5.1 antepone
> un BOM (`﻿`) al valor y corrompe el secret (p. ej. el `client_id` en la URL de OAuth).

Requisitos del proyecto: **`compatibility_flags: ["nodejs_compat"]`** (en `wrangler.jsonc`; Keystatic
usa APIs de Node y Cloudflare puebla `process.env` desde los secrets). El KV `SESSION` se
auto-aprovisiona en el primer deploy.

## Notas y convenciones

- **React fijado a v18.** El build del adapter de Cloudflare (entorno workerd) es incompatible con
  React 19 (`module is not defined`); mantener `react`/`react-dom` en `^18`.
- **Adapter solo en build.** `astro.config.mjs` aplica `@astrojs/cloudflare` únicamente cuando el
  comando es `build` (`process.argv.includes('build')`). En `dev` el SSR corre en Node — el dev en
  workerd rompe con dependencias CJS (React/Keystatic).
- **Patch de Keystatic** (`patches/@keystatic+astro+5.1.0.patch`, reaplicado por `postinstall:
  patch-package`). `@keystatic/astro` 5.1.0 lee los secrets vía `Astro.locals.runtime.env`, que
  Astro 6 + adapter 13 eliminan (→ 500 en las rutas OAuth). El patch cae a `process.env`. **No
  quitar el patch ni el `postinstall`.**
- **Path del singleton con `/` final** (`path: 'src/content/site/'` en `keystatic.config.ts`): obliga
  a Keystatic a leer `src/content/site/index.json`. Sin la barra buscaría `src/content/site.json` y el
  admin saldría vacío.
- `astro.config.mjs` excluye `virtual:keystatic-config` del dep-optimizer para que el build del worker
  resuelva el módulo virtual de Keystatic.
- El contenido se edita vía el panel de Keystatic (escribe en `src/content/site/index.json`).
- Los cambios de estilo global se hacen sobre las variables de `src/styles/global.css`.
- Rama principal: `main`.
