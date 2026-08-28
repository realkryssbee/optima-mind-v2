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

test.describe('Menu hamburger (mobile)', () => {
  test('opens and closes with the toggle, aria-expanded and Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/fr/');

    const toggle = page.getByRole('button', { name: /Menu principal/ });
    const nav = page.locator('#site-nav');

    await expect(toggle).toBeVisible();
    await expect(nav).toBeHidden();

    await toggle.click();
    await expect(nav).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('nav stays inline on desktop without the toggle', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/fr/');

    await expect(page.getByRole('button', { name: /Menu principal/ })).toBeHidden();
    await expect(page.locator('#site-nav')).toBeVisible();
  });
});
