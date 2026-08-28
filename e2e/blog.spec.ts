import { expect, test } from '@playwright/test';

test.describe('Blog (hors périmètre v1 — routes et modèle prêts)', () => {
  test('listing renders the empty state', async ({ page }) => {
    await page.goto('/fr/blog/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog');
    await expect(page.getByText('Aucun article publié')).toBeVisible();
  });

  test('unknown article slug serves the 404 page', async ({ page }) => {
    await page.goto('/fr/blog/article-inexistant/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('n’existe pas');
  });
});
