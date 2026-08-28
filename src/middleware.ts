import { defineMiddleware } from 'astro:middleware';
import { getLocaleFromCookie, LANG_COOKIE } from './lib/locale';
import { detectLocale } from './lib/locale';

/**
 * URLs de démo WordPress retirées définitivement (brief §7) : elles
 * répondent 410 Gone (meilleur signal que 404 pour Google).
 * Gérées ici (middleware, exécuté en périphérie Vercel) plutôt que dans
 * vercel.json, qui exige `destination` sur chaque redirect et ne garantit
 * pas le statut 410. La liste doit rester synchronisée avec
 * docs/REDIRECTIONS.md.
 */
const GONE_PATTERNS: RegExp[] = [
  /^\/news(\/|$)/,
  /^\/our-news(\/|$)/,
  /^\/class(\/|$)/,
  /^\/class-category(\/|$)/,
  /^\/category(\/|$)/,
  /^\/tag(\/|$)/,
  /^\/author(\/|$)/,
  /^\/(2018|2019|2020|2021|2022|2023|2024|2025|2026)\//,
  /^\/wp-/,
  /^\/wp-booking-calendar/,
  /^\/feed(\/|$)/,
  /^\/comments\/feed/,
  /^\/xmlrpc\.php$/,
];

function isGonePath(pathname: string): boolean {
  return GONE_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Redirection de '/' vers la langue détectée (brief §6) :
 * 1. cookie de langue mémorisé (choix de l'utilisateur), sinon
 * 2. en-tête Accept-Language, sinon fr (langue par défaut).
 */
export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, request } = context;

  if (isGonePath(url.pathname)) {
    return new Response('410 Gone', { status: 410 });
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    const cookieLang = getLocaleFromCookie(cookies.get(LANG_COOKIE)?.value);
    const locale = cookieLang ?? detectLocale(request.headers.get('accept-language'));
    return context.redirect(`/${locale}/`, 302);
  }

  return next();
});
