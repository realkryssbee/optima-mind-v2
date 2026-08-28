import type { APIRoute } from 'astro';
import { withLocale } from '../lib/locale';
import { SITE } from '../lib/site';

/**
 * Sitemap multilingue (brief §6) : une entrée par page en version FR
 * (canonical), avec hreflang réciproques fr/pl et x-default.
 * Les routes /pl/ existent (fallback FR tant que la traduction manque).
 */
const routes = [
  '/',
  '/sportifs/',
  '/entreprises/',
  '/a-propos/',
  '/contact/',
  '/mentions-legales/',
  '/politique-de-confidentialite/',
  '/prise-de-rendez-vous/',
] as const;

export const GET: APIRoute = () => {
  const domain = SITE.domain;

  const urls = routes
    .map((route) => {
      const fr = `${domain}${withLocale('fr', route)}`;
      const pl = `${domain}${withLocale('pl', route)}`;
      return `  <url>
    <loc>${fr}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${fr}" />
    <xhtml:link rel="alternate" hreflang="pl" href="${pl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${domain}/" />
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
