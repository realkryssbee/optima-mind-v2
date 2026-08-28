import { expect, test } from '@playwright/test';

test.describe('SEO', () => {
  test('home exposes LocalBusiness JSON-LD with real NAP', async ({ page }) => {
    await page.goto('/fr/');
    const jsonLd =
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '';
    expect(jsonLd).toContain('"@type":"LocalBusiness"');
    expect(jsonLd).toContain('Clos du Relais 61');
    expect(jsonLd).toContain('areaServed');
    expect(jsonLd).toContain('"@type":"Review"');
  });

  test('sportifs exposes BreadcrumbList and Service JSON-LD', async ({ page }) => {
    await page.goto('/fr/sportifs/');
    const jsonLd =
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '';
    expect(jsonLd).toContain('"@type":"BreadcrumbList"');
    expect(jsonLd).toContain('"@type":"Service"');
    expect(jsonLd).toContain('"@type":"Review"');
  });

  test('a-propos exposes Person JSON-LD', async ({ page }) => {
    await page.goto('/fr/a-propos/');
    const jsonLd =
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '';
    expect(jsonLd).toContain('"@type":"Person"');
    expect(jsonLd).toContain('Agnieszka Orchowska');
  });

  test('per-page OG images are generated', async ({ page }) => {
    const res = await page.request.get('/og/sportifs.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  });

  test('404 page offers links to the main pages', async ({ page }) => {
    await page.goto('/fr/pas-de-page-ici/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('n’existe pas');
    await expect(page.getByRole('link', { name: 'Accueil' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Prendre RDV' }).first()).toBeVisible();
  });
});
