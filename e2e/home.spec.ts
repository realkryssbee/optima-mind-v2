import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test('FR home renders heading, navigation and CTA', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navigation' })).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Prendre RDV' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Polski/ }).first()).toBeVisible();
  });

  test('PL home renders real Polish content (no fallback notice)', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Coaching, który zamienia Twój potencjał w konkretne wyniki',
    );
    await expect(page.getByRole('note')).toHaveCount(0);
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

test.describe('Interior pages (FR)', () => {
  test('sportifs renders a single h1 and the offer blocks', async ({ page }) => {
    await page.goto('/fr/sportifs/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Et si votre mental devenait votre plus grand atout ?',
    );
    await expect(
      page.getByRole('heading', { name: 'Accompagnement individuel du sportif' }),
    ).toBeVisible();
  });

  test('a-propos renders the parcours and formations', async ({ page }) => {
    await page.goto('/fr/a-propos/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Mon parcours — entre terrain, humain et performance',
    );
    await expect(page.getByRole('heading', { name: 'Mes formations' })).toBeVisible();
  });

  test('contact page shows the form and real coordinates', async ({ page }) => {
    await page.goto('/fr/contact/');
    await expect(page.locator('form.contact-form')).toBeVisible();
    await expect(page.getByLabel(/Prénom/)).toBeVisible();
    await expect(page.locator('.contact__info').getByText('+32 473 85 24 65')).toBeVisible();
  });

  test('mentions légales contain the BCE number', async ({ page }) => {
    await page.goto('/fr/mentions-legales/');
    await expect(page.getByText('BE 1012.449.376')).toBeVisible();
  });
});
