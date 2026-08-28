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
    'nav.toggle': 'Menu principal',
    'footer.tagline': 'Préparation mentale et performance durable — Wavre, Belgique.',
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.legal': 'Informations légales',
    'footer.mentions': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.rights': 'Tous droits réservés.',
    'fallback.notice':
      'Cette page n’est pas encore disponible en polonais — voici la version française.',
    'newsletter.title': 'Newsletter',
    'newsletter.placeholder': 'Votre adresse email',
    'newsletter.consent':
      "J'accepte de recevoir la newsletter d'Optima Mind (désinscription possible à tout moment).",
    'newsletter.submit': "S'inscrire",
    'newsletter.success': 'Merci ! Confirmez votre inscription dans l’email envoyé.',
    'newsletter.error': 'Une erreur est survenue, veuillez réessayer.',
    'newsletter.rate': 'Trop de demandes, réessayez plus tard.',
    'booking.load': 'Réserver en ligne',
    'blog.empty': 'Aucun article publié pour le moment — revenez bientôt !',
    'blog.meta.title': 'Blog — Optima Mind',
    'blog.meta.description':
      'Articles et ressources sur la préparation mentale et la performance durable.',
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
    'nav.toggle': 'Menu główne',
    'footer.tagline': 'Przygotowanie mentalne i trwała wydajność — Wavre, Belgia.',
    'footer.nav': 'Nawigacja',
    'footer.contact': 'Kontakt',
    'footer.legal': 'Informacje prawne',
    'footer.mentions': 'Informacje prawne',
    'footer.privacy': 'Polityka prywatności',
    'footer.rights': 'Wszelkie prawa zastrzeżone.',
    'fallback.notice':
      'Ta strona nie jest jeszcze dostępna po polsku — wyświetlamy wersję francuską.',
    'newsletter.title': 'Newsletter',
    'newsletter.placeholder': 'Twój adres e-mail',
    'newsletter.consent':
      'Wyrażam zgodę na otrzymywanie newslettera Optima Mind (można zrezygnować w każdej chwili).',
    'newsletter.submit': 'Zapisz się',
    'newsletter.success': 'Dziękujemy! Potwierdź zapis w wysłanym e-mailu.',
    'newsletter.error': 'Wystąpił błąd, spróbuj ponownie.',
    'newsletter.rate': 'Zbyt wiele prób, spróbuj później.',
    'booking.load': 'Zarezerwuj online',
    'blog.empty': 'Na razie brak opublikowanych artykułów — zajrzyj wkrótce!',
    'blog.meta.title': 'Blog — Optima Mind',
    'blog.meta.description': 'Artykuły i materiały o przygotowaniu mentalnym i trwałej wydajności.',
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
