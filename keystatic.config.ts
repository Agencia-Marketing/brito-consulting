import { config, fields, singleton } from '@keystatic/core';

// Campo de texto corto reutilizable
const text = (label: string) => fields.text({ label });
// Campo de texto largo (antes textarea en Tina)
const area = (label: string) => fields.text({ label, multiline: true });

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: { owner: 'Agencia-Marketing', name: 'brito-consulting' },
      },
  ui: {
    brand: { name: 'Brito Consulting' },
  },
  singletons: {
    site: singleton({
      label: 'Contenido del sitio',
      path: 'src/content/site',
      format: { data: 'json' },
      schema: {
        // ── PÁGINA PRIVACIDAD
        privacidad: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            fecha: text('Fecha de actualización'),
          },
          { label: 'Página · Privacidad' },
        ),

        // ── PÁGINA TÉRMINOS
        terminos: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            fecha: text('Fecha de actualización'),
          },
          { label: 'Página · Términos' },
        ),

        // ── META
        meta: fields.object(
          {
            title: text('Título de la página'),
            description: area('Descripción SEO'),
          },
          { label: 'SEO / Meta' },
        ),

        // ── NAV
        nav: fields.object(
          {
            brand: text('Nombre de marca'),
            subbrand: text('Sub-marca'),
            cta_secondary: text('Botón secundario nav'),
            cta_primary: text('Botón principal nav'),
          },
          { label: 'Navegación' },
        ),

        // ── HERO
        hero: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            description: area('Descripción'),
            cta_primary: text('Botón primario'),
            cta_secondary: text('Botón secundario'),
            badge1: text('Badge 1'),
            badge2: text('Badge 2'),
          },
          { label: 'Hero' },
        ),

        // ── VALUE
        value: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            description: area('Descripción'),
            link_text: text('Texto del enlace'),
            features: fields.array(
              fields.object({
                icon: text('Icono (Material Symbols)'),
                title: text('Título'),
                desc: text('Descripción'),
              }),
              { label: 'Características', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Propuesta de valor' },
        ),

        // ── SERVICIOS
        servicios: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            description: area('Descripción'),
            footer_text: text('Texto inferior'),
            footer_link: text('Enlace inferior'),
            tabs: fields.array(
              fields.object({
                id: text('ID (sin espacios)'),
                icon: text('Icono'),
                label: text('Nombre de la pestaña'),
                planes: fields.array(
                  fields.object({
                    nombre: text('Nombre del plan'),
                    icon: text('Icono'),
                    precio: text('Precio'),
                    periodo: text('Período (ej: /mes)'),
                    desc: area('Descripción'),
                    popular: fields.checkbox({ label: '¿Es el más popular?' }),
                    features: fields.array(
                      fields.object({
                        text: text('Texto'),
                        included: fields.checkbox({ label: '¿Incluido?' }),
                      }),
                      { label: 'Características', itemLabel: (p) => p.fields.text.value },
                    ),
                  }),
                  { label: 'Planes', itemLabel: (p) => p.fields.nombre.value },
                ),
              }),
              { label: 'Pestañas de servicios', itemLabel: (p) => p.fields.label.value },
            ),
          },
          { label: 'Servicios' },
        ),

        // ── PORQUE
        porque: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            description: area('Descripción'),
            founder_name: text('Nombre del fundador'),
            founder_role: text('Cargo del fundador'),
            features: fields.array(
              fields.object({
                icon: text('Icono'),
                title: text('Título'),
                desc: text('Descripción'),
              }),
              { label: 'Características', itemLabel: (p) => p.fields.title.value },
            ),
          },
          { label: 'Por qué elegirnos' },
        ),

        // ── STATS
        stats: fields.array(
          fields.object({
            target: fields.integer({ label: 'Número objetivo' }),
            suffix: text('Sufijo (ej: +, %)'),
            label: text('Etiqueta'),
          }),
          { label: 'Estadísticas', itemLabel: (p) => p.fields.label.value },
        ),

        // ── PORTAFOLIO
        portafolio: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            items: fields.array(
              fields.object({
                categoria: text('Categoría'),
                titulo: text('Título'),
                color1: text('Color fondo 1 (hex)'),
                color2: text('Color fondo 2 (hex)'),
                icon: text('Icono'),
              }),
              { label: 'Proyectos', itemLabel: (p) => p.fields.titulo.value },
            ),
          },
          { label: 'Portafolio' },
        ),

        // ── TESTIMONIOS
        testimonios: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            items: fields.array(
              fields.object({
                texto: area('Texto del testimonio'),
                nombre: text('Nombre'),
                rol: text('Cargo / Empresa'),
                iniciales: text('Iniciales (avatar)'),
              }),
              { label: 'Testimonios', itemLabel: (p) => p.fields.nombre.value },
            ),
          },
          { label: 'Testimonios' },
        ),

        // ── NOSOTROS
        nosotros: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            descripcion1: area('Descripción 1'),
            descripcion2: area('Descripción 2'),
            fundacion: text('Año de fundación'),
            paises: text('Países'),
            clientes: text('Clientes'),
            equipo: fields.array(
              fields.object({
                nombre: text('Nombre'),
                rol: text('Cargo'),
                iniciales: text('Iniciales (avatar)'),
              }),
              { label: 'Equipo', itemLabel: (p) => p.fields.nombre.value },
            ),
          },
          { label: 'Nosotros' },
        ),

        // ── FAQ
        faq: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            items: fields.array(
              fields.object({
                pregunta: text('Pregunta'),
                respuesta: area('Respuesta'),
              }),
              { label: 'Preguntas', itemLabel: (p) => p.fields.pregunta.value },
            ),
          },
          { label: 'FAQ' },
        ),

        // ── CONTACTO
        contacto: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            subtitulo: text('Subtítulo'),
            telefono: text('Teléfono'),
            email: text('Email'),
            ubicacion: text('Ubicación'),
            horario: text('Horario'),
            badge_title: text('Título del badge'),
            badge_desc: area('Descripción del badge'),
            servicios_form: fields.array(fields.text({ label: 'Opción' }), {
              label: 'Opciones del formulario',
              itemLabel: (p) => p.value,
            }),
          },
          { label: 'Contacto' },
        ),

        // ── CTA
        cta: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            description: area('Descripción'),
            cta_primary: text('Botón primario'),
            cta_secondary: text('Botón secundario'),
          },
          { label: 'CTA final' },
        ),

        // ── FOOTER
        footer: fields.object(
          {
            tagline: area('Tagline'),
            copyright: text('Copyright'),
          },
          { label: 'Footer' },
        ),
      },
    }),
  },
});
