import { expect, test } from '@playwright/test';

/**
 * Responsive design (mobile-first) : aucune page ne doit produire de
 * débordement horizontal, sur mobile (375), tablette (768) et desktop (1280).
 */

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

const paths = [
  '/fr/',
  '/fr/sportifs/',
  '/fr/entreprises/',
  '/fr/a-propos/',
  '/fr/contact/',
  '/fr/prise-de-rendez-vous/',
  '/fr/mentions-legales/',
  '/fr/politique-de-confidentialite/',
];

test.describe('Responsive — aucun débordement horizontal', () => {
  for (const viewport of viewports) {
    for (const path of paths) {
      test(`${viewport.name} (${viewport.width}px) — ${path}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(path);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `débordement horizontal de ${overflow}px`).toBeLessThanOrEqual(0);

        // Le contenu principal et l'en-tête restent visibles.
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        await expect(page.locator('header').first()).toBeVisible();
      });
    }
  }
});
