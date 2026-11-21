import { httpClient } from './http/client';
import { ApiError } from '../lib/errors';
import type { DataSourceInfo } from '../lib/api';

export interface DohAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface DohResponse {
  Status: number;
  Answer?: DohAnswer[];
}

// Both providers send CORS headers for the JSON API. The first that answers wins.
const PROVIDERS = [
  { name: 'Google Public DNS', url: 'https://dns.google/resolve', homepage: 'https://dns.google' },
  { name: 'Cloudflare DNS', url: 'https://cloudflare-dns.com/dns-query', homepage: 'https://one.one.one.one' },
] as const;

export async function dohQuery(name: string, type: string): Promise<{ response: DohResponse; source: DataSourceInfo }> {
  let last: unknown = null;
  for (const p of PROVIDERS) {
    try {
      const response = await httpClient.get<DohResponse>(
        `${p.url}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
        { headers: { Accept: 'application/dns-json' }, timeoutMs: 6_000 }
      );
      return { response, source: { name: p.name, url: p.homepage, fetchedAt: new Date().toISOString() } };
    } catch (e) {
      last = e;
    }
  }
  throw last ?? new ApiError('provider');
}