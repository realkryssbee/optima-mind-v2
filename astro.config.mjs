// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import decapCmsOauth from 'astro-decap-cms-oauth';

// https://astro.build/config
export default defineConfig({
  // Canonical : le site actuel utilise www (audit 2025-08).
  site: 'https://www.optima-mind.com',

  // Base de déploiement : vide sur Vercel (racine), '/optima-mind/' quand on
  // sert le site en sous-dossier sur le NAS (dev.kryssbee.com/optima-mind/).
  base: process.env.ASTRO_BASE ?? '/',

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

  // Éditeur Decap : page statique public/admin/index.html (servie partout,
  // dev et prod) + OAuth GitHub (/oauth, /oauth/callback) fourni par
  // l'intégration. adminDisabled : la route injectée /admin est désactivée
  // pour éviter l'ombrage de la page statique en mode dev.
  integrations: [decapCmsOauth({ adminDisabled: true })],

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
