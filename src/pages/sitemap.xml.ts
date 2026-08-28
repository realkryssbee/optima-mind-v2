import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { withLocale } from '../lib/locale';
import { SITE } from '../lib/site';

/**
 * Sitemap multilingue (brief §6) : une entrée par page en version FR
 * (canonical), avec hreflang réciproques fr/pl et x-default.
 * Les routes /pl/ existent (fallback FR tant que la traduction manque).
 * Les articles du blog publiés sont ajoutés dynamiquement.
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
  '/blog/',
] as const;

const urlEntry = (domain: string, path: string): string => {
  const fr = `${domain}${withLocale('fr', path)}`;
  const pl = `${domain}${withLocale('pl', path)}`;
  return `  <url>
    <loc>${fr}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${fr}" />
    <xhtml:link rel="alternate" hreflang="pl" href="${pl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${domain}/" />
  </url>`;
};

export const GET: APIRoute = async () => {
  const domain = SITE.domain;

  const posts = await getCollection('blog', (e) => e.id.endsWith('.fr.md') && !e.data.draft);
  const urls = [
    ...routes.map((route) => urlEntry(domain, route)),
    ...posts.map((post) => urlEntry(domain, `/blog/${post.data.slug}/`)),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
