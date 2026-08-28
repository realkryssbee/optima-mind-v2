import { expect, test } from '@playwright/test';

test.describe('Forms', () => {
  test('contact form succeeds with a mocked API', async ({ page }) => {
    await page.route(/\/api\/contact/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', json: { ok: true } }),
    );
    await page.goto('/fr/contact/');

    await page.getByLabel(/Prénom/).fill('Anna');
    await page.getByLabel(/Nom/).fill('Martin');
    await page.getByLabel(/Adresse email/).fill('anna@example.com');
    await page.getByLabel(/Téléphone/).fill('+32 473 85 24 65');
    await page.getByLabel(/Sujet/).selectOption('sportif');
    await page
      .getByLabel(/Questions/)
      .fill('Bonjour, je souhaite un accompagnement mental pour ma compétition.');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    await expect(page.getByRole('status')).toContainText('Merci');
  });

  test('contact form surfaces the configuration message on 503', async ({ page }) => {
    await page.route(/\/api\/contact/, (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        json: { error: 'not-configured' },
      }),
    );
    await page.goto('/fr/contact/');

    await page.getByLabel(/Prénom/).fill('Anna');
    await page.getByLabel(/Nom/).fill('Martin');
    await page.getByLabel(/Adresse email/).fill('anna@example.com');
    await page.getByLabel(/Sujet/).selectOption('equipe');
    await page.getByLabel(/Questions/).fill('Bonjour, une question sur l’accompagnement d’équipe.');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    await expect(page.getByRole('status')).toContainText('configuration');
  });

  test('newsletter form succeeds with a mocked API', async ({ page }) => {
    await page.route(/\/api\/newsletter/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', json: { ok: true } }),
    );
    await page.goto('/fr/');

    const newsletter = page.locator('footer form');
    await newsletter.locator('input[name="email"]').fill('anna@example.com');
    await newsletter.locator('input[name="consent"]').check();
    await newsletter.getByRole('button', { name: "S'inscrire" }).click();

    await expect(newsletter.getByRole('status')).toBeVisible();
  });

  test('booking page offers online booking only after configuration', async ({ page }) => {
    // calUrl n'est pas encore fourni (⟨À FOURNIR⟩) : aucun script Cal.com chargé.
    await page.goto('/fr/prise-de-rendez-vous/');
    await expect(page.getByText('⟨À FOURNIR : lien Cal.com⟩').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Réserver en ligne' })).toHaveCount(0);
  });
});
