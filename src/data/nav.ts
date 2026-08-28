import type { Locale } from '../lib/i18n';
import { t } from '../lib/i18n';

export interface NavItem {
  href: string;
  label: string;
}

/** Navigation principale — les chemins sont identiques dans les deux langues. */
export function getNav(locale: Locale): NavItem[] {
  return [
    { href: `/${locale}/`, label: t(locale, 'nav.home') },
    { href: `/${locale}/sportifs/`, label: t(locale, 'nav.sportifs') },
    { href: `/${locale}/entreprises/`, label: t(locale, 'nav.entreprises') },
    { href: `/${locale}/a-propos/`, label: t(locale, 'nav.apropos') },
    { href: `/${locale}/contact/`, label: t(locale, 'nav.contact') },
  ];
}

/** Page de prise de rendez-vous (Cal.com, incrément 5). */
export function getRdvHref(locale: Locale): string {
  return `/${locale}/prise-de-rendez-vous/`;
}
