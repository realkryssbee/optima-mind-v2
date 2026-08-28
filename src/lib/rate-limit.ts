/**
 * Rate limiting (brief §5.3) : anti-spam côté serveur, sans CAPTCHA.
 * Mode principal : Upstash Redis (région UE) via l'API REST pipeline.
 * Repli en mémoire (par instance serverless) — suffisant en dev/test,
 * mais pour un rate limiting fiable en production il faut Upstash.
 */

const UPSTASH_URL = import.meta.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memory = new Map<string, MemoryEntry>();

export function clientIpFrom(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? 'unknown';
}

/**
 * Vérifie la limite (défaut : 5 requêtes / 60 s par clé).
 * Retourne true si la requête est autorisée.
 */
export async function checkRateLimit(key: string, limit = 5, windowSeconds = 60): Promise<boolean> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/pipeline`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${UPSTASH_TOKEN}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds],
        ]),
      });
      if (!res.ok) return true; // fail-open : ne pas bloquer les visiteurs
      const data = (await res.json()) as number[];
      const count = data[0];
      return typeof count === 'number' ? count <= limit : true;
    } catch {
      return true;
    }
  }

  // Repli en mémoire (best-effort, par instance).
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
