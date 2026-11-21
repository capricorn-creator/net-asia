import { fail } from './http';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const hits = new Map<string, { count: number; reset: number }>();

/** Returns a 429 Response when the caller is over the limit, otherwise null. */
export function limited(request: Request): Response | null {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);

  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return null;
  }
  entry.count++;
  if (entry.count <= MAX_REQUESTS) return null;
  const retry = Math.max(1, Math.ceil((entry.reset - now) / 1000));
  return fail('rate-limited', 'Too many requests. Please wait a minute and try again.', 429, { 'retry-after': String(retry) });
}