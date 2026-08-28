import { describe, expect, it } from 'vitest';
import type { Testimonial } from '../../src/content.config';
import { SITE_FALLBACK } from '../../src/lib/site';
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  personJsonLd,
  reviewJsonLd,
  serviceJsonLd,
} from '../../src/lib/seo';

const settings = {
  ...SITE_FALLBACK,
  geo: { lat: 50.7166, lng: 4.6056 },
  openingHours: '⟨À FOURNIR : horaires réels de consultation⟩',
};

const testimonial: Testimonial = {
  author: 'Jérôme Lepers',
  role: 'Entraîneur',
  quote: 'Un vrai déclic.',
  category: 'sport',
  consent: true,
};

describe('localBusinessJsonLd', () => {
  it('exposes NAP, geo and areaServed', () => {
    const ld = localBusinessJsonLd(settings);
    expect(ld['@type']).toBe('LocalBusiness');
    expect((ld.address as Record<string, string>).streetAddress).toBe('Clos du Relais 61');
    expect((ld.geo as Record<string, number>).latitude).toBe(50.7166);
    expect(ld.areaServed).toEqual(expect.arrayContaining(['Wavre', 'Brabant wallon', 'Bruxelles']));
  });

  it('omits openingHours when it is still a placeholder', () => {
    const ld = localBusinessJsonLd(settings);
    expect(ld.openingHours).toBeUndefined();
  });

  it('includes openingHours when provided', () => {
    const ld = localBusinessJsonLd({ ...settings, openingHours: 'Mo-Fr 09:00-18:00' });
    expect(ld.openingHours).toBe('Mo-Fr 09:00-18:00');
  });
});

describe('serviceJsonLd', () => {
  it('links the provider by @id', () => {
    const ld = serviceJsonLd({ id: 'service-x', name: 'S', description: 'D' });
    expect(ld['@id']).toBe('https://www.optima-mind.com/#service-x');
    expect(ld.provider).toEqual({ '@id': 'https://www.optima-mind.com/#localbusiness' });
  });
});

describe('reviewJsonLd', () => {
  it('never invents a rating (Google interdit les notes auto-attribuées)', () => {
    const ld = reviewJsonLd(testimonial);
    expect(ld.reviewRating).toBeUndefined();
    expect((ld.author as Record<string, string>).name).toBe('Jérôme Lepers');
    expect(ld.reviewBody).toBe('Un vrai déclic.');
  });
});

describe('breadcrumbJsonLd', () => {
  it('builds ordered items with positions', () => {
    const ld = breadcrumbJsonLd([
      { name: 'Accueil', href: '/fr/' },
      { name: 'Sportifs', href: '/fr/sportifs/' },
    ]);
    const items = ld.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ position: 1, name: 'Accueil' });
    expect(items[1]).toMatchObject({ position: 2, name: 'Sportifs' });
  });
});

describe('personJsonLd', () => {
  it('describes Agnieszka Orchowska', () => {
    const ld = personJsonLd(settings);
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe('Agnieszka Orchowska');
    expect(ld.jobTitle).toBe('Coach en préparation mentale et performance');
  });
});
