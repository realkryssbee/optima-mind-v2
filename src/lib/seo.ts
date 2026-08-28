/**
 * Données structurées JSON-LD (brief §7).
 * Aucune note/évaluation n'est inventée : les `Review` reprennent les
 * témoignages publiés (pas d'AggregateRating auto-attribué — interdiction
 * Google). Les champs non fournis (ex. horaires ⟨À FOURNIR⟩) sont omis.
 */
import type { Settings, Testimonial } from '../content.config';
import { SITE } from './site';

const CONTEXT = 'https://schema.org';

function notPlaceholder(value: string | undefined): value is string {
  return Boolean(value && !value.includes('⟨'));
}

export function localBusinessJsonLd(settings: Settings): Record<string, unknown> {
  const address = settings.address;
  const geo = settings.geo;
  const openingHours = notPlaceholder(settings.openingHours) ? settings.openingHours : undefined;

  return {
    '@context': CONTEXT,
    '@type': 'LocalBusiness',
    '@id': `${SITE.domain}/#localbusiness`,
    name: settings.name,
    legalName: settings.legalName,
    url: SITE.domain,
    telephone: settings.phone,
    email: settings.email,
    image: `${SITE.domain}/og-default.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      postalCode: address.zip,
      addressLocality: address.city,
      addressCountry: address.country,
    },
    ...(geo && {
      geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
    }),
    ...(openingHours && { openingHours }),
    areaServed: ['Wavre', 'Brabant wallon', 'Bruxelles'],
    sameAs: [
      settings.social?.facebook,
      settings.social?.linkedin,
      settings.social?.instagram,
    ].filter((url): url is string => Boolean(url)),
  };
}

export function websiteJsonLd(settings: Settings): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': `${SITE.domain}/#website`,
    name: settings.name,
    url: SITE.domain,
    inLanguage: ['fr-BE', 'pl-PL'],
    publisher: { '@id': `${SITE.domain}/#localbusiness` },
  };
}

export function personJsonLd(settings: Settings): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'Person',
    '@id': `${SITE.domain}/#person`,
    name: 'Agnieszka Orchowska',
    jobTitle: 'Coach en préparation mentale et performance',
    worksFor: { '@id': `${SITE.domain}/#localbusiness` },
    url: `${SITE.domain}/fr/a-propos/`,
    sameAs: [
      settings.social?.facebook,
      settings.social?.linkedin,
      settings.social?.instagram,
    ].filter((url): url is string => Boolean(url)),
  };
}

export function serviceJsonLd(options: {
  id: string;
  name: string;
  description: string;
}): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    '@id': `${SITE.domain}/#${options.id}`,
    name: options.name,
    description: options.description,
    provider: { '@id': `${SITE.domain}/#localbusiness` },
    areaServed: ['Wavre', 'Brabant wallon', 'Bruxelles'],
  };
}

export function reviewJsonLd(testimonial: Testimonial): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'Review',
    itemReviewed: { '@id': `${SITE.domain}/#localbusiness` },
    author: { '@type': 'Person', name: testimonial.author },
    reviewBody: testimonial.quote,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; href: string }>,
): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE.domain}${item.href}`,
    })),
  };
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
