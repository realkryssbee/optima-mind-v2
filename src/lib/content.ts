import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

/**
 * Accès typé au contenu (Decap CMS). Une entrée par langue :
 * `home.fr.md` → id `home.fr.md`, slug `homefr` (Astro 5.18 : le slug
 * dérive du nom de fichier sans points ni extension ; getEntry matche
 * sur le slug).
 */

const SUFFIXES: Record<Locale, string> = { fr: 'fr', pl: 'pl' };

/** Slug Astro d'une entrée : 'apropos' + 'fr' → 'aproposfr'. */
export function entrySlug(base: string, locale: Locale): string {
  return `${base}${SUFFIXES[locale]}`;
}

export function getPage(locale: Locale, base: string) {
  return getEntry('pages', entrySlug(base, locale));
}

/**
 * Entrée de page pour une langue, avec repli français si la traduction
 * manque (brief §6) : `usedFallback` indique que le contenu servi est FR.
 */
export async function getPageWithFallback(
  locale: Locale,
  base: string,
): Promise<{ entry: CollectionEntry<'pages'>; usedFallback: boolean }> {
  const entry = await getPage(locale, base);
  if (entry) return { entry, usedFallback: false };
  const fallback = await getPage('fr', base);
  if (fallback) return { entry: fallback, usedFallback: true };
  throw new Error(`Contenu introuvable : ${base}`);
}

export function getSettings() {
  return getEntry('settings', 'site');
}

/** Résout des témoignages par nom d'auteur et langue (relation Decap). */
export async function getTestimonialsByAuthor(authors: string[], locale: Locale) {
  const all = await getCollection('testimonials', (entry) =>
    entry.id.endsWith(`.${SUFFIXES[locale]}.md`),
  );
  const wanted = new Set(authors);
  return all.filter((entry) => wanted.has(entry.data.author));
}

export async function getTestimonialEntries(ids: string[], locale: Locale) {
  if (ids.length === 0) return [];
  const resolved = await Promise.all(
    ids.map((id) => getEntry('testimonials', entrySlug(id, locale))),
  );
  return resolved.filter((entry): entry is Exclude<typeof entry, undefined> => entry !== undefined);
}
