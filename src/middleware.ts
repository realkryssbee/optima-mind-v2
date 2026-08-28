import { defineMiddleware } from 'astro:middleware';
import { getLocaleFromCookie, LANG_COOKIE } from './lib/locale';
import { detectLocale } from './lib/locale';

/**
 * Redirection de '/' vers la langue détectée (brief §6) :
 * 1. cookie de langue mémorisé (choix de l'utilisateur), sinon
 * 2. en-tête Accept-Language, sinon fr (langue par défaut).
 */
export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, request } = context;

  if (url.pathname === '/' || url.pathname === '/index.html') {
    const cookieLang = getLocaleFromCookie(cookies.get(LANG_COOKIE)?.value);
    const locale = cookieLang ?? detectLocale(request.headers.get('accept-language'));
    return context.redirect(`/${locale}/`, 302);
  }

  return next();
});
