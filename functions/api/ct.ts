import { HttpError, fail, json, toResponse } from '../_lib/http';
import type { Ctx } from '../_lib/http';
import { limited } from '../_lib/ratelimit';

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/;
const SOURCE_TIMEOUT_MS = 9000;

interface Cert {
  id: number;
  commonName: string;
  names: string[];
  issuer: string;
  notBefore: string;
  notAfter: string;
  serial: string;
}

interface Found {
  certificates: Cert[];
  source: { name: string; url: string };
}

/** Thrown by a source that answered but had nothing, so a slower source still gets a chance. */
class Empty extends Error {}

async function getJson(url: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS) });
  } catch (e) {
    const name = (e as { name?: string })?.name;
    throw name === 'TimeoutError' || name === 'AbortError'
      ? new HttpError('timeout', 504, 'The Certificate Transparency sources did not answer in time. They are often slow; try again in a minute.')
      : new HttpError('provider', 502, 'Could not reach a Certificate Transparency source.');
  }
  if (res.status === 429) throw new HttpError('rate-limited', 429, 'A Certificate Transparency source is rate limiting requests. Wait a minute and try again.');
  if (!res.ok) throw new HttpError('provider', 502, `A Certificate Transparency source returned HTTP ${res.status}.`);
  try {
    return await res.json();
  } catch {
    throw new HttpError('provider', 502, 'A Certificate Transparency source returned an unreadable response.');
  }
}

async function crtsh(domain: string): Promise<Found> {
  const q = encodeURIComponent(domain);
  // Excluding expired certificates makes the query much lighter on crt.sh.
  let rows = await getJson(`https://crt.sh/?q=${q}&output=json&exclude=expired&deduplicate=Y`);
  if (Array.isArray(rows) && rows.length === 0) {
    rows = await getJson(`https://crt.sh/?q=${q}&output=json&deduplicate=Y`); // expired-only domains
  }
  if (!Array.isArray(rows)) throw new HttpError('provider', 502, 'crt.sh returned an unreadable response.');
  if (!rows.length) throw new Empty();

  const seen = new Set<string>();
  const certificates = (rows as Record<string, any>[])
    .sort((a, b) => String(b.not_before).localeCompare(String(a.not_before)))
    .filter(r => (seen.has(r.serial_number) ? false : (seen.add(r.serial_number), true)))
    .map(r => ({
      id: Number(r.id) || 0,
      commonName: String(r.common_name ?? ''),
      names: String(r.name_value ?? '').split('\n'),
      issuer: String(r.issuer_name ?? ''),
      notBefore: String(r.not_before),
      notAfter: String(r.not_after),
      serial: String(r.serial_number ?? ''),
    }));
  return { certificates, source: { name: 'crt.sh (Certificate Transparency logs)', url: 'https://crt.sh' } };
}

async function certspotter(domain: string): Promise<Found> {
  const rows = await getJson(
    `https://api.certspotter.com/v1/issuances?domain=${encodeURIComponent(domain)}` +
      '&include_subdomains=false&match_wildcards=true&expand=dns_names&expand=issuer'
  );
  if (!Array.isArray(rows)) throw new HttpError('provider', 502, 'Cert Spotter returned an unreadable response.');
  if (!rows.length) throw new Empty();

  const certificates = (rows as Record<string, any>[])
    .sort((a, b) => String(b.not_before).localeCompare(String(a.not_before)))
    .map(r => ({
      id: Number(r.id) || 0,
      commonName: String(r.dns_names?.[0] ?? domain),
      names: Array.isArray(r.dns_names) ? (r.dns_names as string[]) : [],
      issuer: String(r.issuer?.name ?? r.issuer?.friendly_name ?? ''),
      notBefore: String(r.not_before),
      notAfter: String(r.not_after),
      serial: '', // Cert Spotter does not provide the serial number
    }));
  return { certificates, source: { name: 'Cert Spotter (Certificate Transparency logs)', url: 'https://sslmate.com/certspotter/' } };
}

export const onRequestGet = async ({ request, waitUntil }: Ctx) => {
  const over = limited(request);
  if (over) return over;

  const raw = (new URL(request.url).searchParams.get('domain') ?? '')
    .trim().toLowerCase().replace(/^https?:\/\//, '').replace(/[/?#].*$/, '').replace(/\.$/, '');
  if (!DOMAIN_RE.test(raw)) return fail('invalid-input', 'Enter a valid domain name.', 400);

  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(`${new URL(request.url).origin}/api/ct?domain=${encodeURIComponent(raw)}`);
  const hit = await cache.match(key);
  if (hit) return hit;

  try {
    let found: Found | null = null;
    try {
      // Ask both at once; the first one with data wins.
      found = await Promise.any([crtsh(raw), certspotter(raw)]);
    } catch (e) {
      const errors = e instanceof AggregateError ? (e.errors as unknown[]) : [e];
      if (errors.every(x => x instanceof Empty)) {
        found = { certificates: [], source: { name: 'crt.sh and Cert Spotter (Certificate Transparency logs)', url: 'https://crt.sh' } };
      } else {
        const http = errors.filter((x): x is HttpError => x instanceof HttpError);
        throw http.find(x => x.kind === 'rate-limited') ?? http.find(x => x.kind === 'timeout') ?? http[0] ??
          new HttpError('provider', 502, 'Both Certificate Transparency sources failed. Try again shortly.');
      }
    }

    const found2 = found!;
    const found3 = { ...found2, certificates: found2.certificates.slice(0, 50) };
    const out = json(
      {
        domain: raw,
        certificates: found3.certificates,
        source: { ...found3.source, fetchedAt: new Date().toISOString() },
      },
      200,
      { 'cache-control': found3.certificates.length ? 'public, max-age=3600' : 'no-store' }
    );
    if (found3.certificates.length) waitUntil(cache.put(key, out.clone()));
    return out;
  } catch (e) {
    return toResponse(e);
  }
};