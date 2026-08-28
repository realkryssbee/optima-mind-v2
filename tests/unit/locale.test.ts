import { describe, expect, it } from 'vitest';
import { detectLocale, stripLocale, withLocale } from '../../src/lib/locale';

describe('detectLocale', () => {
  it('returns pl for a Polish Accept-Language header', () => {
    expect(detectLocale('pl-PL,pl;q=0.9,en;q=0.8')).toBe('pl');
    expect(detectLocale('pl,en;q=0.8')).toBe('pl');
  });

  it('defaults to fr for other languages and for null', () => {
    expect(detectLocale('en-US,en;q=0.9')).toBe('fr');
    expect(detectLocale('de-DE,de;q=0.9')).toBe('fr');
    expect(detectLocale(null)).toBe('fr');
  });
});

describe('stripLocale', () => {
  it('removes the locale prefix and keeps the trailing slash', () => {
    expect(stripLocale('/fr/sportifs/')).toBe('/sportifs/');
    expect(stripLocale('/pl/')).toBe('/');
  });

  it('leaves paths without a locale prefix untouched', () => {
    expect(stripLocale('/mentions-legales/')).toBe('/mentions-legales/');
  });
});

describe('withLocale', () => {
  it('prefixes a content path with the locale', () => {
    expect(withLocale('pl', '/sportifs/')).toBe('/pl/sportifs/');
    expect(withLocale('fr', '/')).toBe('/fr/');
  });

  it('round-trips with stripLocale', () => {
    expect(withLocale('pl', stripLocale('/fr/sportifs/'))).toBe('/pl/sportifs/');
  });
});
