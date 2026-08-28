import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibilité — WCAG 2.2 AA vérifiée avec axe-core (brief §9).
 * Toutes les pages FR + le fallback PL + la 404 doivent être sans violation.
 */

const paths = [
  '/fr/',
  '/fr/sportifs/',
  '/fr/entreprises/',
  '/fr/a-propos/',
  '/fr/contact/',
  '/fr/prise-de-rendez-vous/',
  '/fr/mentions-legales/',
  '/fr/politique-de-confidentialite/',
  '/pl/',
  '/404',
];

test.describe('Accessibilité (axe-core, WCAG 2.2 AA)', () => {
  for (const path of paths) {
    test(`${path} — aucune violation WCAG 2.2 AA`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const summary = results.violations
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
        .join('\n');
      expect(results.violations, `Violations axe :\n${summary}`).toEqual([]);
    });
  }
});
