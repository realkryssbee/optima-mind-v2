import { expect, test } from '@playwright/test';

test.describe('i18n (FR/PL)', () => {
  test('FR page exposes reciprocal hreflang and x-default', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
      'href',
      'https://www.optima-mind.com/fr/',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="pl"]')).toHaveAttribute(
      'href',
      'https://www.optima-mind.com/pl/',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://www.optima-mind.com/',
    );
  });

  test('FR page canonical points to its own URL', async ({ page }) => {
    await page.goto('/fr/sportifs/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.optima-mind.com/fr/sportifs/',
    );
  });

  test('fallback /pl/ page canonicalizes to the French version', async ({ page }) => {
    await page.goto('/pl/sportifs/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.optima-mind.com/fr/sportifs/',
    );
    await expect(page.getByRole('note')).toBeVisible();
  });

  test('language choice persists via cookie on the root redirect', async ({ page, context }) => {
    await context.addCookies([{ name: 'optima_lang', value: 'pl', url: 'http://127.0.0.1:4321' }]);
    await page.goto('/');
    await expect(page).toHaveURL(/\/pl\//);
  });

  test('language switcher keeps the current page on the other locale', async ({ page }) => {
    await page.goto('/fr/sportifs/');
    await page.locator('[data-lang-switch][data-lang="pl"]').click();
    await expect(page).toHaveURL(/\/pl\/sportifs\//);
  });

  test('sitemap lists both locales with reciprocal hreflang', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const body = (await response?.text()) ?? '';
    expect(body).toContain('https://www.optima-mind.com/fr/sportifs/');
    expect(body).toContain('https://www.optima-mind.com/pl/sportifs/');
    expect(body).toContain('hreflang="fr"');
    expect(body).toContain('hreflang="pl"');
    expect(body).toContain('hreflang="x-default"');
  });
});
