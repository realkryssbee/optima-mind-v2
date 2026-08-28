import type { Settings } from '../content.config';

/** Constantes du site (non éditables). */
export const SITE = {
  domain: 'https://www.optima-mind.com',
  name: 'Optima Mind',
} as const;

/**
 * Valeurs de repli des réglages globaux (le CMS est la source de vérité ;
 * ces valeurs réelles servent de filet de sécurité au build).
 */
export const SITE_FALLBACK: Settings = {
  name: 'Optima Mind',
  legalName: 'Agnieszka Orchowska – Optima Mind',
  legalStatus: 'Indépendante (personne physique)',
  bce: 'BE 1012.449.376',
  address: {
    street: 'Clos du Relais 61',
    zip: '1300',
    city: 'Wavre',
    country: 'Belgique',
  },
  geo: { lat: 50.7166, lng: 4.6056 },
  phone: '+32 473 85 24 65',
  email: 'info@optima-mind.com',
  rgpdEmail: 'aga@optima-mind.com',
  openingHours: '⟨À FOURNIR : horaires réels de consultation⟩',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61587185073550',
    linkedin: 'https://www.linkedin.com/in/agnieszka-orchowska-5b7426/',
    instagram: 'https://www.instagram.com/optima_mind/',
  },
  seoDefaults: {
    title: 'Coach mental pour sportif et entreprises Wavre — Optima Mind',
    description:
      "Coach mental pour sportif et entreprises Wavre. La performance durable ne s'improvise pas, elle se construit.",
  },
  booking: {
    calUrl: '',
    note: '⟨À FOURNIR : lien Cal.com⟩',
  },
  lieux: [
    { name: 'À domicile', address: 'Clos du Relais 61, 1300 Wavre' },
    {
      name: 'À Kampus — Centre de kinésithérapie',
      address: 'Rue de Bruxelles 48/50, 1300 Wavre',
    },
  ],
};

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
