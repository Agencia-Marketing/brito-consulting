import { config, fields, singleton } from '@keystatic/core';

// Campo de texto corto reutilizable
const text = (label: string) => fields.text({ label });
// Campo de texto largo (antes textarea en Tina)
const area = (label: string) => fields.text({ label, multiline: true });

// ── Iconos: desplegable (Material Symbols). Incluye todos los usados + extras.
const iconOptions = [
  { label: 'Estrella', value: 'star' },
  { label: 'Cohete', value: 'rocket_launch' },
  { label: 'Idea / Destello', value: 'auto_awesome' },
  { label: 'Cerebro / Estrategia', value: 'psychology' },
  { label: 'Equipo / Grupo', value: 'groups' },
  { label: 'Verificado', value: 'verified' },
  { label: 'Me gusta', value: 'thumb_up' },
  { label: 'Tendencia al alza', value: 'trending_up' },
  { label: 'Gráfico de barras', value: 'bar_chart' },
  { label: 'Monitorización', value: 'monitoring' },
  { label: 'Insights', value: 'insights' },
  { label: 'Temporizador', value: 'timer' },
  { label: 'Código', value: 'code' },
  { label: 'Idioma / Web', value: 'language' },
  { label: 'Globo / Mundo', value: 'public' },
  { label: 'Móvil', value: 'smartphone' },
  { label: 'API / Integración', value: 'api' },
  { label: 'Empresa (edificio)', value: 'business' },
  { label: 'Corporativo', value: 'corporate_fare' },
  { label: 'Tienda', value: 'store' },
  { label: 'Carrito', value: 'shopping_cart' },
  { label: 'Compartir', value: 'share' },
  { label: 'Clic en anuncio', value: 'ads_click' },
  { label: 'Megáfono / Campaña', value: 'campaign' },
  { label: 'Buscar', value: 'search' },
  { label: 'Robot / IA', value: 'smart_toy' },
  { label: 'Chat', value: 'chat' },
  { label: 'Ajustes / Automatización', value: 'settings_suggest' },
  { label: 'Soporte', value: 'support_agent' },
  { label: 'Email', value: 'mail' },
  { label: 'Acuerdo', value: 'handshake' },
  { label: 'Paleta', value: 'palette' },
  { label: 'Estilo', value: 'style' },
  { label: 'Lápiz / Dibujo', value: 'draw' },
  { label: 'Servicios de diseño', value: 'design_services' },
  { label: 'Editar nota', value: 'edit_note' },
  { label: 'Marca / Altavoz', value: 'brand_awareness' },
  { label: 'Cámara de vídeo', value: 'videocam' },
  { label: 'Película', value: 'movie' },
  { label: 'TV en vivo', value: 'live_tv' },
  { label: 'Suscripciones', value: 'subscriptions' },
  { label: 'Cámara de fotos', value: 'photo_camera' },
  { label: 'Artículo', value: 'article' },
  { label: 'Periódico', value: 'newspaper' },
  { label: 'Libro abierto', value: 'auto_stories' },
] as const;
const iconField = (label: string) =>
  fields.select({ label, options: iconOptions as any, defaultValue: 'star' });

// ── Colores de fondo (fallback del portafolio): desplegable de presets oscuros.
const colorOptions = [
  { label: 'Azul noche', value: '#1a1a2e' },
  { label: 'Azul marino', value: '#16213e' },
  { label: 'Índigo oscuro', value: '#0d0d1a' },
  { label: 'Índigo', value: '#1a1a35' },
  { label: 'Marrón muy oscuro', value: '#1a0a00' },
  { label: 'Marrón cobre', value: '#2d1000' },
  { label: 'Verde muy oscuro', value: '#0a1a0a' },
  { label: 'Verde bosque', value: '#102010' },
  { label: 'Verde azulado', value: '#0d1a15' },
  { label: 'Esmeralda oscuro', value: '#102818' },
  { label: 'Granate oscuro', value: '#1a0d0d' },
  { label: 'Granate', value: '#2e1515' },
] as const;
const colorField = (label: string, def: string) =>
  fields.select({ label, options: colorOptions as any, defaultValue: def });

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
      // El `/` final hace que Keystatic use dataLocation 'index' y lea
      // src/content/site/index.json (sin él buscaría src/content/site.json).
      path: 'src/content/site/',
      format: { data: 'json' },
      schema: {
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
                icon: iconField('Icono'),
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
                icon: iconField('Icono'),
                label: text('Nombre de la pestaña'),
                planes: fields.array(
                  fields.object({
                    nombre: text('Nombre del plan'),
                    icon: iconField('Icono'),
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
                icon: iconField('Icono'),
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
                imagen: fields.image({
                  label: 'Imagen del proyecto',
                  description: 'Si subes imagen, sustituye al fondo de color + icono.',
                  directory: 'public/images/portafolio',
                  publicPath: '/images/portafolio',
                }),
                color1: colorField('Color fondo 1 (fallback)', '#1a1a2e'),
                color2: colorField('Color fondo 2 (fallback)', '#16213e'),
                icon: iconField('Icono (fallback)'),
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
                foto: fields.image({
                  label: 'Foto (avatar)',
                  description: 'Si subes foto, sustituye a las iniciales.',
                  directory: 'public/images/testimonios',
                  publicPath: '/images/testimonios',
                }),
                iniciales: text('Iniciales (avatar, fallback)'),
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

        // ── PÁGINA PRIVACIDAD (al final: páginas legales)
        privacidad: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            fecha: text('Fecha de actualización'),
          },
          { label: 'Página · Privacidad' },
        ),

        // ── PÁGINA TÉRMINOS (al final: páginas legales)
        terminos: fields.object(
          {
            tag: text('Etiqueta'),
            title: text('Título'),
            title_highlight: text('Título (parte resaltada)'),
            fecha: text('Fecha de actualización'),
          },
          { label: 'Página · Términos' },
        ),
      },
    }),
  },
});
