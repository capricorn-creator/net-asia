import { ApiError } from '../lib/errors';
import type { GeoIPResult } from '../types';
import type { DataSourceInfo } from '../lib/api';

const TIMEOUT_MS = 8000;

export interface GeoLookup {
  data: GeoIPResult;
  source: DataSourceInfo;
}

type Json = Record<string, any>;

interface Provider {
  name: string;
  homepage: string;
  url: (ip: string) => string;
  parse: (j: Json) => GeoIPResult;
}

export function isIPv4(s: string): boolean {
  return /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(s);
}

export function isIPv6(s: string): boolean {
  if (!s.includes(':')) return false;
  try {
    new URL(`http://[${s}]/`);
    return true;
  } catch {
    return false;
  }
}

function flagFromCode(code?: string): string | undefined {
  if (!code || code.length !== 2) return undefined;
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

function failFromMessage(msg: string): never {
  if (/rate|limit|quota/i.test(msg)) throw new ApiError('rate-limited');
  if (/reserved|private/i.test(msg)) throw new ApiError('blocked-target');
  if (/invalid/i.test(msg)) throw new ApiError('invalid-input');
  throw new ApiError('provider');
}

const PROVIDERS: Provider[] = [
  {
    name: 'ipwho.is',
    homepage: 'https://ipwho.is',
    url: ip => `https://ipwho.is/${ip}`,
    parse: j => {
      if (j.success === false) failFromMessage(String(j.message ?? ''));
      return {
        ip: j.ip,
        type: j.type === 'IPv6' ? 'IPv6' : 'IPv4',
        continent: j.continent,
        country: j.country_code,
        country_name: j.country,
        country_code: j.country_code,
        flag: j.flag?.emoji ?? flagFromCode(j.country_code),
        region: j.region,
        city: j.city,
        zip: j.postal,
        timezone: j.timezone?.id,
        latitude: j.latitude,
        longitude: j.longitude,
        asn: j.connection?.asn ? `AS${j.connection.asn}` : undefined,
        org: j.connection?.org,
        isp: j.connection?.isp,
      };
    },
  },
  {
    name: 'ipapi.co',
    homepage: 'https://ipapi.co',
    url: ip => (ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/'),
    parse: j => {
      if (j.error) failFromMessage(String(j.reason ?? j.message ?? ''));
      return {
        ip: j.ip,
        type: j.version === 'IPv6' ? 'IPv6' : 'IPv4',
        continent: j.continent_code,
        country: j.country_code,
        country_name: j.country_name,
        country_code: j.country_code,
        flag: flagFromCode(j.country_code),
        region: j.region,
        city: j.city,
        zip: j.postal,
        timezone: j.timezone,
        latitude: j.latitude,
        longitude: j.longitude,
        asn: j.asn,
        org: j.org,
        isp: j.org,
      };
    },
  },
];

async function fetchJson(url: string, signal?: AbortSignal): Promise<Json> {
  const ctrl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    ctrl.abort();
  }, TIMEOUT_MS);
  signal?.addEventListener('abort', () => ctrl.abort(), { once: true });
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (res.status === 429) throw new ApiError('rate-limited');
    const body = (await res.json().catch(() => null)) as Json | null;
    if (!body) throw new ApiError('provider');
    if (!res.ok && !body.error && body.success !== false) throw new ApiError('provider');
    return body;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (signal?.aborted) throw e;
    throw new ApiError(timedOut ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
}

/** Empty string looks up the caller's own public IP. */
export async function lookupGeo(ip: string, signal?: AbortSignal): Promise<GeoLookup> {
  const q = ip.trim();
  if (q && !isIPv4(q) && !isIPv6(q)) {
    throw new ApiError('invalid-input', 'Enter a valid IPv4 or IPv6 address, or leave the field empty to look up your own.');
  }
  let last: ApiError | null = null;
  for (const p of PROVIDERS) {
    try {
      const data = p.parse(await fetchJson(p.url(q), signal));
      return { data, source: { name: p.name, url: p.homepage, fetchedAt: new Date().toISOString() } };
    } catch (e) {
      if (signal?.aborted) throw e;
      const err = e instanceof ApiError ? e : new ApiError('provider');
      if (err.kind === 'invalid-input' || err.kind === 'blocked-target') throw err;
      last = err;
    }
  }
  throw last ?? new ApiError('provider');
}