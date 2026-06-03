import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "site",
        label: "Contenido del sitio",
        path: "src/content",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        match: { include: "site" },
        fields: [
          // ── META
          {
            type: "object",
            name: "meta",
            label: "SEO / Meta",
            fields: [
              { type: "string", name: "title",       label: "Título de la página" },
              { type: "string", name: "description", label: "Descripción SEO", ui: { component: "textarea" } },
            ],
          },

          // ── NAV
          {
            type: "object",
            name: "nav",
            label: "Navegación",
            fields: [
              { type: "string", name: "brand",         label: "Nombre de marca" },
              { type: "string", name: "subbrand",      label: "Sub-marca" },
              { type: "string", name: "cta_secondary", label: "Botón secundario nav" },
              { type: "string", name: "cta_primary",   label: "Botón principal nav" },
            ],
          },

          // ── HERO
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "tag",            label: "Etiqueta" },
              { type: "string", name: "title",          label: "Título" },
              { type: "string", name: "title_highlight",label: "Título (parte naranja)" },
              { type: "string", name: "description",    label: "Descripción", ui: { component: "textarea" } },
              { type: "string", name: "cta_primary",    label: "Botón primario" },
              { type: "string", name: "cta_secondary",  label: "Botón secundario" },
              { type: "string", name: "badge1",         label: "Badge 1" },
              { type: "string", name: "badge2",         label: "Badge 2" },
            ],
          },

          // ── VALUE
          {
            type: "object",
            name: "value",
            label: "Propuesta de valor",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              { type: "string", name: "description",     label: "Descripción", ui: { component: "textarea" } },
              { type: "string", name: "link_text",       label: "Texto del enlace" },
              {
                type: "object",
                name: "features",
                label: "Características",
                list: true,
                fields: [
                  { type: "string", name: "icon",  label: "Icono (Material Symbols)" },
                  { type: "string", name: "title", label: "Título" },
                  { type: "string", name: "desc",  label: "Descripción" },
                ],
              },
            ],
          },

          // ── SERVICIOS
          {
            type: "object",
            name: "servicios",
            label: "Servicios",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              { type: "string", name: "description",     label: "Descripción", ui: { component: "textarea" } },
              { type: "string", name: "footer_text",     label: "Texto inferior" },
              { type: "string", name: "footer_link",     label: "Enlace inferior" },
              {
                type: "object",
                name: "tabs",
                label: "Pestañas de servicios",
                list: true,
                ui: { itemProps: (item: any) => ({ label: item?.label }) },
                fields: [
                  { type: "string", name: "id",    label: "ID (sin espacios)" },
                  { type: "string", name: "icon",  label: "Icono" },
                  { type: "string", name: "label", label: "Nombre de la pestaña" },
                  {
                    type: "object",
                    name: "planes",
                    label: "Planes",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.nombre }) },
                    fields: [
                      { type: "string",  name: "nombre",  label: "Nombre del plan" },
                      { type: "string",  name: "icon",    label: "Icono" },
                      { type: "string",  name: "precio",  label: "Precio" },
                      { type: "string",  name: "periodo", label: "Período (ej: /mes)" },
                      { type: "string",  name: "desc",    label: "Descripción", ui: { component: "textarea" } },
                      { type: "boolean", name: "popular", label: "¿Es el más popular?" },
                      {
                        type: "object",
                        name: "features",
                        label: "Características",
                        list: true,
                        fields: [
                          { type: "string",  name: "text",     label: "Texto" },
                          { type: "boolean", name: "included", label: "¿Incluido?" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── PORQUE
          {
            type: "object",
            name: "porque",
            label: "Por qué elegirnos",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              { type: "string", name: "description",     label: "Descripción", ui: { component: "textarea" } },
              { type: "string", name: "founder_name",    label: "Nombre del fundador" },
              { type: "string", name: "founder_role",    label: "Cargo del fundador" },
              {
                type: "object",
                name: "features",
                label: "Características",
                list: true,
                fields: [
                  { type: "string", name: "icon",  label: "Icono" },
                  { type: "string", name: "title", label: "Título" },
                  { type: "string", name: "desc",  label: "Descripción" },
                ],
              },
            ],
          },

          // ── STATS
          {
            type: "object",
            name: "stats",
            label: "Estadísticas",
            list: true,
            fields: [
              { type: "number", name: "target", label: "Número objetivo" },
              { type: "string", name: "suffix", label: "Sufijo (ej: +, %)" },
              { type: "string", name: "label",  label: "Etiqueta" },
            ],
          },

          // ── PORTAFOLIO
          {
            type: "object",
            name: "portafolio",
            label: "Portafolio",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              {
                type: "object",
                name: "items",
                label: "Proyectos",
                list: true,
                ui: { itemProps: (item: any) => ({ label: item?.titulo }) },
                fields: [
                  { type: "string", name: "categoria", label: "Categoría" },
                  { type: "string", name: "titulo",    label: "Título" },
                  { type: "string", name: "color1",    label: "Color fondo 1 (hex)" },
                  { type: "string", name: "color2",    label: "Color fondo 2 (hex)" },
                  { type: "string", name: "icon",      label: "Icono" },
                ],
              },
            ],
          },

          // ── TESTIMONIOS
          {
            type: "object",
            name: "testimonios",
            label: "Testimonios",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              {
                type: "object",
                name: "items",
                label: "Testimonios",
                list: true,
                ui: { itemProps: (item: any) => ({ label: item?.nombre }) },
                fields: [
                  { type: "string", name: "texto",    label: "Texto del testimonio", ui: { component: "textarea" } },
                  { type: "string", name: "nombre",   label: "Nombre" },
                  { type: "string", name: "rol",      label: "Cargo / Empresa" },
                  { type: "string", name: "iniciales",label: "Iniciales (avatar)" },
                ],
              },
            ],
          },

          // ── NOSOTROS
          {
            type: "object",
            name: "nosotros",
            label: "Nosotros",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              { type: "string", name: "descripcion1",    label: "Descripción 1", ui: { component: "textarea" } },
              { type: "string", name: "descripcion2",    label: "Descripción 2", ui: { component: "textarea" } },
              { type: "string", name: "fundacion",       label: "Año de fundación" },
              { type: "string", name: "paises",          label: "Países" },
              { type: "string", name: "clientes",        label: "Clientes" },
              {
                type: "object",
                name: "equipo",
                label: "Equipo",
                list: true,
                ui: { itemProps: (item: any) => ({ label: item?.nombre }) },
                fields: [
                  { type: "string", name: "nombre",    label: "Nombre" },
                  { type: "string", name: "rol",       label: "Cargo" },
                  { type: "string", name: "iniciales", label: "Iniciales (avatar)" },
                ],
              },
            ],
          },

          // ── FAQ
          {
            type: "object",
            name: "faq",
            label: "FAQ",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              {
                type: "object",
                name: "items",
                label: "Preguntas",
                list: true,
                ui: { itemProps: (item: any) => ({ label: item?.pregunta }) },
                fields: [
                  { type: "string", name: "pregunta",  label: "Pregunta" },
                  { type: "string", name: "respuesta", label: "Respuesta", ui: { component: "textarea" } },
                ],
              },
            ],
          },

          // ── CONTACTO
          {
            type: "object",
            name: "contacto",
            label: "Contacto",
            fields: [
              { type: "string", name: "tag",            label: "Etiqueta" },
              { type: "string", name: "title",          label: "Título" },
              { type: "string", name: "title_highlight",label: "Título (parte naranja)" },
              { type: "string", name: "subtitulo",      label: "Subtítulo" },
              { type: "string", name: "telefono",       label: "Teléfono" },
              { type: "string", name: "email",          label: "Email" },
              { type: "string", name: "ubicacion",      label: "Ubicación" },
              { type: "string", name: "horario",        label: "Horario" },
              { type: "string", name: "badge_title",    label: "Título del badge" },
              { type: "string", name: "badge_desc",     label: "Descripción del badge", ui: { component: "textarea" } },
              { type: "string", name: "servicios_form", label: "Opciones del formulario", list: true },
            ],
          },

          // ── CTA
          {
            type: "object",
            name: "cta",
            label: "CTA final",
            fields: [
              { type: "string", name: "tag",             label: "Etiqueta" },
              { type: "string", name: "title",           label: "Título" },
              { type: "string", name: "title_highlight", label: "Título (parte naranja)" },
              { type: "string", name: "description",     label: "Descripción", ui: { component: "textarea" } },
              { type: "string", name: "cta_primary",     label: "Botón primario" },
              { type: "string", name: "cta_secondary",   label: "Botón secundario" },
            ],
          },

          // ── FOOTER
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "string", name: "tagline",   label: "Tagline", ui: { component: "textarea" } },
              { type: "string", name: "copyright", label: "Copyright" },
            ],
          },
        ],
      },
    ],
  },
});
