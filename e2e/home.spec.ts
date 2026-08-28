import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test('FR home renders heading, navigation and CTA', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navigation' })).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Prendre RDV' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Polski/ }).first()).toBeVisible();
  });

  test('PL route falls back to French content with a notice — no 404', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('note')).toBeVisible();
  });

  test('language switcher links to the other locale keeping the page', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page.locator('[data-lang-switch][data-lang="pl"]')).toHaveAttribute(
      'href',
      '/pl/',
    );
  });

  test('root URL redirects to a language route', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/fr\/|\/pl\//);
  });
});
