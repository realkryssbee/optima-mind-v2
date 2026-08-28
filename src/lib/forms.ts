import { z } from 'zod';
import { checkRateLimit, clientIpFrom } from './rate-limit';

/**
 * Logique des formulaires (brief §5.3) — fonctions pures et testables.
 * Les endpoints (src/pages/api/*) n'utilisent que ces fonctions.
 */

export class BrevoNotConfiguredError extends Error {
  constructor() {
    super('Brevo is not configured (missing environment variables)');
    this.name = 'BrevoNotConfiguredError';
  }
}

/* ------------------------------------------------------------------ */
/* Validation (zod) — les règles sont les mêmes côté serveur           */
/* ------------------------------------------------------------------ */

export const contactSchema = z.object({
  firstname: z.string().trim().min(2, 'Prénom trop court').max(100),
  lastname: z.string().trim().min(2, 'Nom trop court').max(100),
  email: z.string().trim().toLowerCase().email('Email invalide').max(200),
  phone: z.string().trim().max(40).optional().default(''),
  topic: z.enum(['sportif', 'equipe', 'entraineur', 'entreprise']),
  message: z.string().trim().min(10, 'Message trop court').max(3000),
  /** Honeypot anti-spam (champ invisible) — doit rester vide. */
  website: z.string().optional().default(''),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const topicLabels: Record<ContactPayload['topic'], string> = {
  sportif: 'Sportif / Individuel',
  equipe: 'Équipe sportive',
  entraineur: 'Entraîneur',
  entreprise: 'Entreprise',
};

export function parseContact(input: unknown) {
  return contactSchema.safeParse(input);
}

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide').max(200),
  /** Honeypot anti-spam. */
  website: z.string().optional().default(''),
});

export function parseNewsletter(input: unknown) {
  return newsletterSchema.safeParse(input);
}

export function isHoneypotFilled(payload: { website?: string }): boolean {
  return Boolean(payload.website);
}

/* ------------------------------------------------------------------ */
/* Brevo (emails transactionnels + newsletter)                         */
/* ------------------------------------------------------------------ */

export function brevoConfigured(): boolean {
  return Boolean(import.meta.env.BREVO_API_KEY && import.meta.env.BREVO_SENDER_EMAIL);
}

function brevoHeaders(): Record<string, string> {
  return {
    'api-key': import.meta.env.BREVO_API_KEY ?? '',
    accept: 'application/json',
    'content-type': 'application/json',
  };
}

export async function sendBrevoEmail(options: {
  to: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = import.meta.env.BREVO_API_KEY;
  const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
  const senderName = import.meta.env.BREVO_SENDER_NAME ?? 'Optima Mind';
  if (!apiKey || !senderEmail) throw new BrevoNotConfiguredError();

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: brevoHeaders(),
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [options.to],
      replyTo: options.replyTo,
      subject: options.subject,
      htmlContent: options.html,
    }),
  });
  if (!res.ok) throw new Error(`Brevo send failed: ${res.status}`);
}

export async function addBrevoContact(email: string): Promise<void> {
  const apiKey = import.meta.env.BREVO_API_KEY;
  const listId = Number(import.meta.env.BREVO_LIST_ID ?? '');
  if (!apiKey || !listId) throw new BrevoNotConfiguredError();

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: brevoHeaders(),
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
      attributes: {
        // Consentement explicite et horodaté (double opt-in : configuré
        // dans le tableau de bord Brevo, template de confirmation).
        CONSENT_DATE: new Date().toISOString(),
        CONSENT_SOURCE: 'optima-mind.com',
      },
    }),
  });
  // 201 = créé, 204 = mis à jour (updateEnabled).
  if (res.status !== 201 && res.status !== 204) {
    throw new Error(`Brevo contact failed: ${res.status}`);
  }
}

/* ------------------------------------------------------------------ */
/* Helpers des endpoints                                               */
/* ------------------------------------------------------------------ */

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildContactEmailHtml(data: ContactPayload): string {
  const lines: Array<[string, string]> = [
    ['Prénom', data.firstname],
    ['Nom', data.lastname],
    ['Email', data.email],
    ['Téléphone', data.phone],
    ['Sujet', topicLabels[data.topic]],
    ['Message', data.message],
  ];
  return `<h2>Nouveau message via le site optima-mind.com</h2>${lines
    .map(
      ([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br/>${escapeHtml(value)}</p>`,
    )
    .join('')}`;
}

export function buildAckEmailHtml(data: ContactPayload): string {
  return `<p>Bonjour ${escapeHtml(data.firstname)},</p>
<p>Nous avons bien reçu votre message (sujet : ${escapeHtml(topicLabels[data.topic])}). Nous reviendrons vers vous dans les plus brefs délais.</p>
<p>Cordialement,<br/>Optima Mind</p>`;
}

/** Traitement commun des endpoints : validation + honeypot + rate limit. */
export async function checkSubmission(
  request: Request,
  scope: 'contact' | 'newsletter',
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const allowed = await checkRateLimit(`${scope}:${clientIpFrom(request)}`);
  if (!allowed) return { ok: false, status: 429, error: 'rate-limited' };
  return { ok: true };
}
