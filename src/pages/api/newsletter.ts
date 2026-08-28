import type { APIRoute } from 'astro';
import {
  addBrevoContact,
  BrevoNotConfiguredError,
  checkSubmission,
  isHoneypotFilled,
  parseNewsletter,
} from '../../lib/forms';

export const prerender = false;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const raw = await request.text().catch(() => '');
  if (raw.length > 5_000) return json({ error: 'payload-too-large' }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'invalid-json' }, 400);
  }

  const parsed = parseNewsletter(payload);
  if (!parsed.success) {
    return json({ error: 'validation', issues: parsed.error.flatten() }, 422);
  }
  const data = parsed.data;

  if (isHoneypotFilled(data)) return json({ ok: true }, 200);

  const gate = await checkSubmission(request, 'newsletter');
  if (!gate.ok) return json({ error: gate.error }, gate.status);

  try {
    // Double opt-in : la confirmation par email est gérée par Brevo
    // (template configuré dans le tableau de bord).
    await addBrevoContact(data.email);
    return json({ ok: true }, 200);
  } catch (error) {
    if (error instanceof BrevoNotConfiguredError) {
      return json({ error: 'not-configured' }, 503);
    }
    return json({ error: 'send-failed' }, 502);
  }
};
