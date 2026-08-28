/**
 * Interface strings (FR/PL).
 * Le contenu vit dans le CMS ; ici uniquement les libellés d'interface.
 * Les traductions polonaises de contenu sont dans src/content (fichiers *.pl.md).
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
    'blog.back': '← Retour au blog',
    'cta.rdv': 'Prendre RDV',
    'cta.learnMore': 'En savoir plus',
    'cta.scan': 'Faire le Scan',
    'cta.scan.sub': 'Test psychologique (4 min)',
    'cta.contact': 'Contactez-nous',
    'cta.discover': 'Découvrir mon parcours',
    'section.univers': 'Que proposons-nous ?',
    'section.testimonials': 'Témoignages',
    'section.references': 'Nos collaborations',
    'section.offers': 'Les accompagnements',
    'faq.title': 'Questions fréquentes',
    'offers.sub': 'Vous apprendrez à :',
    'rdv.online': 'Réservation en ligne',
    'rdv.types': 'Quel accompagnement ?',
    'rdv.lieux': 'Où nous rencontrer ?',
    'rdv.type.sportif': 'Sportif individuel',
    'rdv.type.equipe': 'Équipe sportive',
    'rdv.type.entraineur': 'Entraîneur',
    'rdv.type.entreprise': 'Entreprise',
    'rdv.duration.note': '⟨À FOURNIR : confirmation des durées et tarifs éventuels⟩',
    'lieu.domicile': 'À domicile',
    'lieu.kampus': 'À Kampus — Centre de kinésithérapie',
    'form.firstname': 'Prénom',
    'form.lastname': 'Nom',
    'form.email': 'Adresse email',
    'form.phone': 'Téléphone',
    'form.topic': 'Sujet',
    'form.select': 'Veuillez sélectionner',
    'form.message': 'Questions',
    'form.submit': 'Envoyer',
    'form.required': 'Requis',
    'form.topic.sportif': 'Sportif / Individuel',
    'form.topic.equipe': 'Équipe sportive',
    'form.topic.entraineur': 'Entraîneur',
    'form.topic.entreprise': 'Entreprise',
    'form.status.success':
      'Merci ! Votre message a bien été envoyé — nous revenons vers vous sous 24 h.',
    'form.status.error':
      'Une erreur est survenue. Merci de réessayer ou d’écrire directement à info@optima-mind.com.',
    'form.status.config':
      'L’envoi en ligne est en cours de configuration — contactez-nous directement à info@optima-mind.com.',
    'form.status.rate': 'Trop de messages envoyés. Merci de réessayer dans quelques minutes.',
    'form.honeypot': 'Vérification anti-robot',
    'contact.coords': 'Coordonnées',
    'contact.address': 'Adresse',
    'contact.phoneEmail': 'Téléphone & email',
    'contact.hours': 'Horaires',
    'contact.venues': 'Lieux de séance',
    'contact.map': 'Voir sur la carte',
    'contact.modes': 'En visioconférence ou en présentiel :',
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
    'blog.back': '← Wróć do bloga',
    'cta.rdv': 'Umów wizytę',
    'cta.learnMore': 'Dowiedz się więcej',
    'cta.scan': 'Wykonaj Scan',
    'cta.scan.sub': 'Test psychologiczny (4 min)',
    'cta.contact': 'Skontaktuj się z nami',
    'cta.discover': 'Poznaj moją drogę',
    'section.univers': 'Co oferujemy?',
    'section.testimonials': 'Opinie',
    'section.references': 'Nasze współprace',
    'section.offers': 'Oferta wsparcia',
    'faq.title': 'Częste pytania',
    'offers.sub': 'Dzięki temu nauczysz się:',
    'rdv.online': 'Rezerwacja online',
    'rdv.types': 'Jaki rodzaj wsparcia?',
    'rdv.lieux': 'Gdzie się spotykamy?',
    'rdv.type.sportif': 'Sportowiec indywidualny',
    'rdv.type.equipe': 'Drużyna sportowa',
    'rdv.type.entraineur': 'Trener',
    'rdv.type.entreprise': 'Firma',
    'rdv.duration.note': '⟨À FOURNIR : potwierdzenie czasów trwania i ewentualnych cen⟩',
    'lieu.domicile': 'U klienta',
    'lieu.kampus': 'W Kampus — Centrum fizjoterapii',
    'form.firstname': 'Imię',
    'form.lastname': 'Nazwisko',
    'form.email': 'Adres e-mail',
    'form.phone': 'Telefon',
    'form.topic': 'Temat',
    'form.select': 'Wybierz',
    'form.message': 'Wiadomość',
    'form.submit': 'Wyślij',
    'form.required': 'Wymagane',
    'form.topic.sportif': 'Sportowiec / indywidualnie',
    'form.topic.equipe': 'Drużyna sportowa',
    'form.topic.entraineur': 'Trener',
    'form.topic.entreprise': 'Firma',
    'form.status.success': 'Dziękujemy! Twoja wiadomość została wysłana — odpowiemy w ciągu 24 h.',
    'form.status.error':
      'Wystąpił błąd. Spróbuj ponownie lub napisz bezpośrednio na info@optima-mind.com.',
    'form.status.config':
      'Wysyłanie online jest w trakcie konfiguracji — skontaktuj się z nami bezpośrednio na info@optima-mind.com.',
    'form.status.rate': 'Zbyt wiele wiadomości. Spróbuj ponownie za kilka minut.',
    'form.honeypot': 'Weryfikacja antyrobotowa',
    'contact.coords': 'Dane kontaktowe',
    'contact.address': 'Adres',
    'contact.phoneEmail': 'Telefon i e-mail',
    'contact.hours': 'Godziny otwarcia',
    'contact.venues': 'Miejsca sesji',
    'contact.map': 'Zobacz na mapie',
    'contact.modes': 'Wideokonferencja lub spotkanie na miejscu:',
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
