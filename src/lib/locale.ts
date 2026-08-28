import type { Locale } from './i18n';
import { isLocale } from './i18n';

export const LANG_COOKIE = 'optima_lang';

/** Enlève le préfixe de langue d'un pathname : '/fr/sportifs/' -> '/sportifs/'. */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(fr|pl)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] ?? '/';
}

/** Préfixe un chemin de contenu par une langue : '/sportifs/' + 'pl' -> '/pl/sportifs/'. */
export function withLocale(locale: Locale, path: string): string {
  if (path === '/' || path === '') return `/${locale}/`;
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Détecte la langue depuis l'en-tête Accept-Language ; défaut : fr. */
export function detectLocale(acceptLanguage: string | null): Locale {
  const first = acceptLanguage?.split(',')[0]?.trim().toLowerCase() ?? '';
  return first.startsWith('pl') ? 'pl' : 'fr';
}

/** Lit le cookie de langue ; null si absent ou invalide. */
export function getLocaleFromCookie(value: string | undefined): Locale | null {
  return value && isLocale(value) ? value : null;
}
