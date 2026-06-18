# Brito Consulting — Sitio web corporativo

Sitio web *one-page* de **Brito Consulting**, agencia de marketing y consultoría de negocios.
Construido con **Astro** y editable de forma visual mediante **TinaCMS**. Diseño de tema oscuro
con identidad de marca monocroma (charcoal, blanco, negro).

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Gestión de contenido (TinaCMS)](#gestión-de-contenido-tinacms)
- [Variables de entorno](#variables-de-entorno)
- [Diseño y marca](#diseño-y-marca)
- [Despliegue](#despliegue)
- [Convenciones de contribución](#convenciones-de-contribución)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| Framework | [Astro](https://astro.build) | `^6.4.4` |
| CMS | [TinaCMS](https://tina.io) + `@tinacms/cli` | `^3.9.0` / `^2.4.3` |
| Estilos | [Tailwind CSS](https://tailwindcss.com) (vía `@tailwindcss/vite`) + CSS propio | `^4.3.0` |
| Lenguaje | TypeScript (config `astro/tsconfigs/strict`) | — |
| Tipografías | Bricolage Grotesque (display) + Poppins (texto) + Material Symbols | Google Fonts |

El sitio se genera de forma **100 % estática** (`output: static`).

## Requisitos

- **Node.js ≥ 22.12.0**
- npm (incluido con Node)

## Puesta en marcha

```sh
# 1. Instalar dependencias
npm install

# 2. Levantar entorno de desarrollo (Astro + TinaCMS)
npm run dev
```

- Sitio: <http://localhost:4321>
- Editor de contenido: <http://localhost:4321/admin>

## Scripts disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Arranca TinaCMS + servidor de desarrollo de Astro en `localhost:4321` |
| `npm run build` | Compila el esquema de Tina y genera el sitio estático en `./dist/` |
| `npm run preview` | Sirve localmente la build de producción |
| `npm run astro ...` | Ejecuta comandos de la CLI de Astro (`astro add`, `astro check`, …) |

## Estructura del proyecto

```text
/
├── public/                     # Assets estáticos servidos tal cual
│   ├── admin/                  # Build del panel de TinaCMS (generado)
│   ├── brito-logo.png          # Logo principal
│   ├── brito-logo-blanco.png   # Logo para fondos oscuros
│   ├── isotipo.png             # Isotipo (usado en nav y footer)
│   ├── favicon.svg / .ico
│   └── Manual de identidad-Brito.pdf
├── src/
│   ├── content/
│   │   └── site.json           # ÚNICA fuente de contenido del sitio
│   ├── layouts/
│   │   └── Layout.astro        # Layout base: <head>, nav, footer, scripts
│   ├── pages/
│   │   ├── index.astro         # Landing one-page (todas las secciones)
│   │   ├── admin/index.astro   # Redirección al panel de Tina
│   │   ├── privacidad/         # Política de privacidad
│   │   └── terminos/           # Términos de uso
│   └── styles/
│       └── global.css          # Sistema de diseño (variables, componentes, animaciones)
├── tina/
│   ├── config.ts               # Esquema del CMS (mapea los campos de site.json)
│   └── __generated__/          # Cliente y tipos generados por Tina (NO editar a mano)
├── astro.config.mjs
└── package.json
```

## Gestión de contenido (TinaCMS)

Todo el contenido editable vive en un único archivo: **`src/content/site.json`**.
El esquema que lo expone en el editor visual está definido en **`tina/config.ts`** como una
colección `site` con secciones:

`meta` (SEO) · `nav` · `hero` · propuesta de valor · `servicios` (7 categorías con planes y precios) ·
`porque` · `stats` · `portafolio` · `testimonios` · `nosotros` · `faq` · `contacto` · `cta` · `footer`.

**Cómo editar:**

1. `npm run dev`
2. Abrir <http://localhost:4321/admin>
3. Editar los campos desde la interfaz; Tina escribe los cambios en `site.json`.

> La colección está configurada con `create: false` / `delete: false`: solo se permite **editar**
> el contenido existente, no crear ni borrar documentos.

Los archivos de `tina/__generated__/` se regeneran automáticamente con cada `dev`/`build`; no deben
editarse manualmente.

## Variables de entorno

Necesarias para conectar con **Tina Cloud** (edición en producción y guardado en el repositorio):

| Variable | Descripción |
| :--- | :--- |
| `TINA_CLIENT_ID` | Client ID del proyecto en Tina Cloud |
| `TINA_TOKEN` | Token de lectura/escritura de Tina Cloud |
| `GITHUB_BRANCH` | Rama de destino (por defecto `main`) |

Crear un archivo `.env` (ignorado por git) en la raíz:

```sh
TINA_CLIENT_ID=tu_client_id
TINA_TOKEN=tu_token
GITHUB_BRANCH=main
```

> En desarrollo local Tina funciona sin credenciales contra el sistema de archivos. Las variables
> son necesarias para el editor en producción.

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

## Despliegue

El proyecto compila a estático y puede alojarse en cualquier hosting de sitios estáticos
(Vercel, Netlify, Cloudflare Pages, etc.).

```sh
npm run build      # genera ./dist/
npm run preview    # verificación local de la build
```

Configurar las [variables de entorno](#variables-de-entorno) de Tina en el panel del proveedor.
Directorio de salida: `dist/`. Comando de build: `npm run build`.

## Convenciones de contribución

- No editar manualmente `tina/__generated__/` ni `dist/` (generados).
- El contenido se edita vía el panel de Tina (escribe en `src/content/site.json`).
- Los cambios de estilo global se hacen sobre las variables de `src/styles/global.css`.
- Rama principal: `main`.
