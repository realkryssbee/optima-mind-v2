/**
 * Données factuelles du site (NAP).
 * Valeurs relevées sur le site actuel (audit 2025-08) — à confirmer
 * officiellement par la cliente. Rien n'est inventé ; les valeurs
 * inconnues sont balisées ⟨À FOURNIR : …⟩.
 */
export const SITE = {
  name: 'Optima Mind',
  domain: 'https://www.optima-mind.com',
  legalName: 'Agnieszka Orchowska – Optima Mind',
  legalStatus: 'Indépendante (personne physique)',
  address: {
    street: 'Clos du Relais 61',
    zip: '1300',
    city: 'Wavre',
    country: 'Belgique',
  },
  phone: '+32 473 85 24 65',
  phoneHref: '+32473852465',
  email: 'info@optima-mind.com',
  rgpdEmail: 'aga@optima-mind.com',
  bce: 'BE 1012.449.376',
  openingHours: '⟨À FOURNIR : horaires réels de consultation⟩',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61587185073550',
    linkedin: 'https://www.linkedin.com/in/agnieszka-orchowska-5b7426/',
    instagram: 'https://www.instagram.com/optima_mind/',
  },
  // ⟨À FOURNIR : mention « Made by KryssBee » à conserver ?⟩
  agencyCredit: null,
} as const;
