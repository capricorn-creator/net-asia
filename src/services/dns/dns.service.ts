import { httpClient } from '../http/client';
import type { DNSRecord } from '../../types';
import { parseDNSResponse, type GoogleDoHResponse } from './dns.parser';

const BASE_URL = 'https://dns.google/resolve';

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA'] as const;

/** All selectable record types, including the synthetic "ALL" option. */
export const DNS_RECORD_TYPES = ['ALL', ...DNS_TYPES] as const;

function stripToHostname(domain: string): string {
  return domain.trim().replace(/^https?:\/\//, '').split('/')[0];
}

async function queryRecordType(domain: string, type: string): Promise<DNSRecord[]> {
  const url = `${BASE_URL}?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;

  try {
    const raw = await httpClient.get<GoogleDoHResponse>(url);
    return parseDNSResponse(raw, type);
  } catch {
    // A single record type failing (e.g. no AAAA records) should not
    // fail the whole "ALL" query — treat it as "no records found".
    return [];
  }
}

/**
 * Looks up DNS records for a domain. Pass `type = 'ALL'` (default) to
 * query every supported record type in parallel and merge the results.
 */
export async function lookupDNS(domain: string, type: string = 'ALL'): Promise<DNSRecord[]> {
  const cleanDomain = stripToHostname(domain);

  if (type === 'ALL') {
    const results = await Promise.all(DNS_TYPES.map(t => queryRecordType(cleanDomain, t)));
    return results.flat();
  }

  return queryRecordType(cleanDomain, type);
}
