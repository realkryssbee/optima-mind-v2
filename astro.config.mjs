// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import decapCmsOauth from 'astro-decap-cms-oauth';

// https://astro.build/config
export default defineConfig({
  // Canonical : le site actuel utilise www (audit 2025-08).
  site: 'https://www.optima-mind.com',

  // Statique par défaut (Astro 5.18+) ; seules les routes marquées
  // `prerender = false` (redirection de langue, API) passent en on-demand.
  adapter: vercel(),

  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'pl'],
    routing: {
      prefixDefaultLocale: true, // /fr/... et /pl/... (brief §6)
      fallbackType: 'rewrite',
    },
    fallback: {
      pl: 'fr', // une page non traduite affiche le français, jamais une 404
    },
  },

  // Éditeur Decap à /admin + OAuth GitHub (/oauth) — voir README § CMS.
  integrations: [decapCmsOauth()],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  vite: {
    build: {
      // Ne jamais inliner les scripts dans le HTML : compatible avec la CSP
      // stricte `script-src 'self'` (vercel.json).
      assetsInlineLimit: 0,
    },
  },
});
