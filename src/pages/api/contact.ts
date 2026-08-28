import type { APIRoute } from 'astro';
import {
  BrevoNotConfiguredError,
  buildAckEmailHtml,
  buildContactEmailHtml,
  checkSubmission,
  isHoneypotFilled,
  parseContact,
  sendBrevoEmail,
} from '../../lib/forms';

export const prerender = false;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const raw = await request.text().catch(() => '');
  if (raw.length > 20_000) return json({ error: 'payload-too-large' }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'invalid-json' }, 400);
  }

  const parsed = parseContact(payload);
  if (!parsed.success) {
    return json({ error: 'validation', issues: parsed.error.flatten() }, 422);
  }
  const data = parsed.data;

  // Honeypot rempli → bot : on répond succès sans rien faire.
  if (isHoneypotFilled(data)) return json({ ok: true }, 200);

  const gate = await checkSubmission(request, 'contact');
  if (!gate.ok) return json({ error: gate.error }, gate.status);

  const recipient = import.meta.env.CONTACT_RECIPIENT_EMAIL ?? 'info@optima-mind.com';
  const visitor = { email: data.email, name: `${data.firstname} ${data.lastname}` };

  try {
    await sendBrevoEmail({
      to: { email: recipient, name: `${data.firstname} ${data.lastname}` },
      replyTo: visitor,
      subject: `Nouveau message — ${data.topic}`,
      html: buildContactEmailHtml(data),
    });
    // Accusé de réception automatique au visiteur.
    await sendBrevoEmail({
      to: visitor,
      subject: 'Nous avons bien reçu votre message — Optima Mind',
      html: buildAckEmailHtml(data),
    });
    return json({ ok: true }, 200);
  } catch (error) {
    if (error instanceof BrevoNotConfiguredError) {
      return json({ error: 'not-configured' }, 503);
    }
    return json({ error: 'send-failed' }, 502);
  }
};
