import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContactPayload } from '../../src/lib/forms';
import {
  addBrevoContact,
  BrevoNotConfiguredError,
  buildAckEmailHtml,
  buildContactEmailHtml,
  isHoneypotFilled,
  parseContact,
  parseNewsletter,
  sendBrevoEmail,
} from '../../src/lib/forms';
import { checkRateLimit } from '../../src/lib/rate-limit';

const validContact: ContactPayload = {
  firstname: 'Anna',
  lastname: 'Martin',
  email: 'anna.martin@example.com',
  phone: '',
  topic: 'sportif',
  message: 'Bonjour, je souhaite un accompagnement mental pour la compétition.',
  website: '',
};

describe('parseContact', () => {
  it('accepts a valid payload and normalizes the email', () => {
    const result = parseContact({
      ...validContact,
      email: '  Anna.Martin@Example.com ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('anna.martin@example.com');
    }
  });

  it('rejects an invalid email', () => {
    const result = parseContact({ ...validContact, email: 'pas-un-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a too-short message', () => {
    const result = parseContact({ ...validContact, message: 'court' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown topic value', () => {
    const result = parseContact({ ...validContact, topic: 'autre' });
    expect(result.success).toBe(false);
  });
});

describe('parseNewsletter', () => {
  it('accepts a valid email', () => {
    expect(parseNewsletter({ email: 'x@example.com' }).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(parseNewsletter({ email: 'x' }).success).toBe(false);
  });
});

describe('honeypot', () => {
  it('detects a filled honeypot and ignores an empty one', () => {
    expect(isHoneypotFilled({ website: 'spam' })).toBe(true);
    expect(isHoneypotFilled({ website: '' })).toBe(false);
    expect(isHoneypotFilled({})).toBe(false);
  });
});

describe('checkRateLimit (in-memory fallback)', () => {
  it('allows up to the limit then blocks', async () => {
    for (let i = 0; i < 5; i += 1) {
      await expect(checkRateLimit('unit-test-key', 5, 60)).resolves.toBe(true);
    }
    await expect(checkRateLimit('unit-test-key', 5, 60)).resolves.toBe(false);
  });
});

describe('sendBrevoEmail', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_KEY', 'test-key');
    vi.stubEnv('BREVO_SENDER_EMAIL', 'info@optima-mind.com');
    vi.stubEnv('BREVO_SENDER_NAME', 'Optima Mind');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('posts to the Brevo SMTP endpoint with the API key', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await sendBrevoEmail({
      to: { email: 'a@example.com', name: 'Anna' },
      subject: 'Test',
      html: '<p>hi</p>',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'api-key': 'test-key' }),
      }),
    );
  });

  it('throws BrevoNotConfiguredError when the API key is missing', async () => {
    vi.stubEnv('BREVO_API_KEY', '');
    await expect(
      sendBrevoEmail({ to: { email: 'a@example.com' }, subject: 't', html: '<p>x</p>' }),
    ).rejects.toBeInstanceOf(BrevoNotConfiguredError);
  });
});

describe('addBrevoContact', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_KEY', 'test-key');
    vi.stubEnv('BREVO_LIST_ID', '7');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('adds the contact to the list with consent attributes', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);

    await addBrevoContact('a@example.com');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.brevo.com/v3/contacts');
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body).toMatchObject({ email: 'a@example.com', listIds: [7], updateEnabled: true });
    expect(body.attributes).toMatchObject({ CONSENT_SOURCE: 'optima-mind.com' });
  });

  it('throws when the list id is missing', async () => {
    vi.stubEnv('BREVO_LIST_ID', '');
    await expect(addBrevoContact('a@example.com')).rejects.toBeInstanceOf(BrevoNotConfiguredError);
  });
});

describe('email templates', () => {
  it('escapes user content in the HTML', () => {
    const html = buildContactEmailHtml({
      ...validContact,
      firstname: '<script>alert(1)</script>',
      message: 'a & b < c',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('builds the acknowledgement email', () => {
    const html = buildAckEmailHtml(validContact);
    expect(html).toContain('Anna');
    expect(html).toContain('Sportif / Individuel');
  });
});
