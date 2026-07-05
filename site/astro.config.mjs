// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const SITE = process.env.SITE ?? 'http://localhost:4321';
const BASE = process.env.BASE ?? '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,woff2}'],
        },
        manifest: {
          name: 'PIPT Repertório',
          short_name: 'PIPT',
          theme_color: '#007830',
          background_color: '#000000',
          display: 'standalone',
          icons: [
            { src: `${BASE}logo/mmu-small.png`, sizes: '640x640', type: 'image/png' },
            { src: `${BASE}logo/mmu.png`, sizes: '2560x2560', type: 'image/png' },
          ],
        },
      }),
    ],
  },
});
