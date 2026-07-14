import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import type { DNSPropagationResult } from '../../types';
import { parsePropagationResponse, type PropDoHResponse } from './propagation.parser';

// All public resolvers support DNS-over-HTTPS — no keys, no auth.
const RESOLVERS = [
  { ip: '8.8.8.8',         name: 'Google',         url: 'https://dns.google/resolve',                   location: 'US (Google)' },
  { ip: '1.1.1.1',         name: 'Cloudflare',     url: 'https://cloudflare-dns.com/dns-query',         location: 'Global (CF)' },
  { ip: '9.9.9.9',         name: 'Quad9',          url: 'https://dns.quad9.net:5053/dns-query',         location: 'Global (Q9)' },
  { ip: '208.67.222.222',  name: 'OpenDNS',        url: 'https://doh.opendns.com/dns-query',            location: 'US (Cisco)' },
  { ip: '8.26.56.26',      name: 'Comodo',         url: 'https://doh.comodo.com/dns-query',             location: 'US (Comodo)' },
  { ip: '77.88.8.8',       name: 'Yandex',         url: 'https://dns.yandex.com/dns-query',             location: 'RU (Yandex)' },
  { ip: '94.140.14.14',    name: 'AdGuard',        url: 'https://dns.adguard.com/dns-query',            location: 'Global (AG)' },
  { ip: '64.6.64.6',       name: 'Neustar',        url: 'https://doh.neustar.biz/dns-query',            location: 'US (Neustar)' },
] as const;

async function queryResolver(
  resolverUrl: string,
  domain: string,
  type: string,
  resolver: typeof RESOLVERS[number]
) {
  const start = Date.now();
  try {
    const url = `${resolverUrl}?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;
    const raw = await httpClient.get<PropDoHResponse>(url, {
      headers: { Accept: 'application/dns-json' },
      timeoutMs: 6_000,
    });
    return parsePropagationResponse(raw, resolver.ip, resolver.name, resolver.location, Date.now() - start);
  } catch {
    return parsePropagationResponse(null, resolver.ip, resolver.name, resolver.location, Date.now() - start);
  }
}

/**
 * Queries 8 public DNS-over-HTTPS resolvers in parallel for the given domain
 * and record type. Returns results from all resolvers, including failures,
 * so the UI can show which locations have propagated and which haven't.
 */
export async function checkDNSPropagation(
  domain: string,
  recordType: string = 'A'
): Promise<DNSPropagationResult> {
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];
  if (!cleanDomain) {
    throw new AppError('Please enter a valid domain name.', 'INVALID_INPUT');
  }

  const results = await Promise.all(
    RESOLVERS.map(r => queryResolver(r.url, cleanDomain, recordType, r))
  );

  return {
    domain: cleanDomain,
    recordType,
    results,
    checkedAt: new Date().toISOString(),
  };
}

export const PROPAGATION_RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'] as const;
