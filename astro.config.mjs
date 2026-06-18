// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// El adapter de Cloudflare solo se aplica en build/producción. En `astro dev`
// se omite para que el SSR (admin de Keystatic) corra en Node y no en workerd,
// que rompe con dependencias CJS (React/Keystatic → "module is not defined").
const isBuild = process.argv.includes('build');

// https://astro.build/config
export default defineConfig({
  // Páginas de contenido estáticas; las rutas del admin de Keystatic
  // (/keystatic y /api/keystatic) se sirven on-demand vía el adapter.
  output: 'static',
  ...(isBuild ? { adapter: cloudflare() } : {}),
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
    // El módulo virtual de Keystatic no debe pasar por el dep-optimizer
    // (esbuild) del entorno workerd del adapter de Cloudflare.
    optimizeDeps: { exclude: ['virtual:keystatic-config'] },
  },
});
