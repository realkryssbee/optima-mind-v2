/**
 * Interface strings (FR/PL).
 * Le contenu vit dans le CMS ; ici uniquement les libellés d'interface.
 * Le polonais est couvert par des libellés standard à faire valider
 * (les traductions de contenu sont ⟨À FOURNIR⟩, incrément 4).
 */

export const locales = ['fr', 'pl'] as const;

export type Locale = (typeof locales)[number];

const ui = {
  fr: {
    'skip-link': 'Aller au contenu principal',
    'nav.home': 'Accueil',
    'nav.sportifs': 'Sportifs',
    'nav.entreprises': 'Entreprises',
    'nav.apropos': 'À propos',
    'nav.contact': 'Contact',
    'nav.rdv': 'Prendre RDV',
    'lang.label': 'Changer de langue',
    'lang.fr': 'Français',
    'lang.pl': 'Polski',
    'footer.tagline': 'Préparation mentale et performance durable — Wavre, Belgique.',
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.legal': 'Informations légales',
    'footer.mentions': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.rights': 'Tous droits réservés.',
    'fallback.notice':
      'Cette page n’est pas encore disponible en polonais — voici la version française.',
  },
  pl: {
    'skip-link': 'Przejdź do treści',
    'nav.home': 'Strona główna',
    'nav.sportifs': 'Sportowcy',
    'nav.entreprises': 'Firmy',
    'nav.apropos': 'O mnie',
    'nav.contact': 'Kontakt',
    'nav.rdv': 'Umów wizytę',
    'lang.label': 'Zmień język',
    'lang.fr': 'Français',
    'lang.pl': 'Polski',
    'footer.tagline': 'Przygotowanie mentalne i trwała wydajność — Wavre, Belgia.',
    'footer.nav': 'Nawigacja',
    'footer.contact': 'Kontakt',
    'footer.legal': 'Informacje prawne',
    'footer.mentions': 'Informacje prawne',
    'footer.privacy': 'Polityka prywatności',
    'footer.rights': 'Wszelkie prawa zastrzeżone.',
    'fallback.notice':
      'Ta strona nie jest jeszcze dostępna po polsku — wyświetlamy wersję francuską.',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'fr' || value === 'pl';
}

/** og:locale (format ll_CC). */
export function localeToOgLocale(locale: Locale): string {
  return locale === 'fr' ? 'fr_BE' : 'pl_PL';
}
