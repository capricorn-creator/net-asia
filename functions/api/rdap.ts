import { HttpError, json, toResponse } from '../_lib/http';
import type { Ctx } from '../_lib/http';
import { limited } from '../_lib/ratelimit';

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/;
const BOOTSTRAP = 'https://data.iana.org/rdap/dns.json';
const DAY_MS = 86_400_000;

type Service = [string[], string[]];
let cache: { at: number; services: Service[] } | null = null;

/** IANA's list of which RDAP server handles which TLD. Cached per isolate for a day. */
async function loadServices(): Promise<Service[] | null> {
  if (cache && Date.now() - cache.at < DAY_MS) return cache.services;
  try {
    const res = await fetch(BOOTSTRAP, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return cache?.services ?? null;
    const body = (await res.json()) as { services?: Service[] };
    if (!Array.isArray(body.services)) return cache?.services ?? null;
    cache = { at: Date.now(), services: body.services };
    return cache.services;
  } catch {
    return cache?.services ?? null;
  }
}

export const onRequestGet = async ({ request }: Ctx) => {
  const over = limited(request);
  if (over) return over;
  try {
    const domain = (new URL(request.url).searchParams.get('domain') ?? '').trim().toLowerCase().replace(/\.$/, '');
    if (!DOMAIN_RE.test(domain)) throw new HttpError('invalid-input', 400, 'Enter a valid domain name, for example example.com.');

    const tld = domain.slice(domain.lastIndexOf('.') + 1);
    const services = await loadServices();
    let base: string;
    if (services) {
      const hit = services.find(([tlds]) => tlds.includes(tld));
      if (!hit) throw new HttpError('not-found', 404, `.${tld} does not publish RDAP registration data, so no result can be shown for it.`);
      base = hit[1].find(u => u.startsWith('https://')) ?? hit[1][0];
    } else {
      base = 'https://rdap.org/'; // bootstrap list unreachable: fall back to the public redirector
    }
    if (!base.endsWith('/')) base += '/';

    let res: Response;
    try {
      res = await fetch(`${base}domain/${domain}`, {
        headers: { accept: 'application/rdap+json, application/json' },
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });
    } catch (e) {
      const name = (e as { name?: string })?.name;
      throw name === 'TimeoutError' || name === 'AbortError'
        ? new HttpError('timeout', 504, 'The registry did not answer within 8 seconds. Try again shortly.')
        : new HttpError('unreachable', 502, 'Could not reach the registry RDAP server.');
    }
    if (res.status === 404) {
      throw new HttpError('not-found', 404, 'No registration record found. Enter the registered domain (example.com), not a subdomain.');
    }
    if (res.status === 429) throw new HttpError('rate-limited', 429, 'The registry is rate limiting requests. Wait a minute and try again.');
    if (!res.ok) throw new HttpError('provider', 502, `The registry returned HTTP ${res.status}.`);

    const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') throw new HttpError('provider', 502, 'The registry returned an unreadable response.');

    return json({
      ...body,
      source: { name: `RDAP server ${new URL(base).host} (found via the IANA bootstrap list)`, url: base, fetchedAt: new Date().toISOString() },
    });
  } catch (e) {
    return toResponse(e);
  }
};