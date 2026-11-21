import { ApiError } from '../../lib/errors';
import { cleanDomain } from '../../lib/domain';
import { attachSource } from '../../lib/source-store';
import type { DataSourceInfo } from '../../lib/api';
import type { DNSRecord } from '../../types';
import { dohQuery } from '../doh';
import { parseDNSResponse } from './dns.parser';

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA'] as const;

/** All selectable record types, including the synthetic "ALL" option. */
export const DNS_RECORD_TYPES = ['ALL', ...DNS_TYPES] as const;

const TYPE_NUM: Record<string, number> = { A: 1, NS: 2, CNAME: 5, SOA: 6, MX: 15, TXT: 16, AAAA: 28, CAA: 257 };

interface TypeResult {
  records: DNSRecord[];
  source: DataSourceInfo;
  nxdomain: boolean;
}

async function queryRecordType(domain: string, type: string): Promise<TypeResult> {
  const { response, source } = await dohQuery(domain, type);
  if (response.Status === 3) return { records: [], source, nxdomain: true };
  if (response.Status !== 0) {
    throw new ApiError('provider', `The resolver returned DNS status ${response.Status} for ${type} records.`);
  }
  // A query for A on a CNAME'd name also returns the CNAME rows; keep only the type that was asked for.
  const answers = (response.Answer ?? []).filter(a => a.type === TYPE_NUM[type]);
  return { records: parseDNSResponse({ ...response, Answer: answers }, type), source, nxdomain: false };
}

/**
 * Looks up DNS records for a domain. Pass `type = 'ALL'` (default) to
 * query every supported record type in parallel and merge the results.
 * If every query fails, the error is thrown instead of being shown as "no records".
 */
export async function lookupDNS(domain: string, type: string = 'ALL'): Promise<DNSRecord[]> {
  const name = cleanDomain(domain);
  if (type !== 'ALL' && !(type in TYPE_NUM)) {
    throw new ApiError('invalid-input', 'Choose a supported record type.');
  }
  const types: readonly string[] = type === 'ALL' ? DNS_TYPES : [type];

  const settled = await Promise.allSettled(types.map(t => queryRecordType(name, t)));
  const ok = settled
    .filter((s): s is PromiseFulfilledResult<TypeResult> => s.status === 'fulfilled')
    .map(s => s.value);

  if (!ok.length) throw (settled[0] as PromiseRejectedResult).reason;
  if (ok.every(r => r.nxdomain)) throw new ApiError('not-found', `${name} does not exist (NXDOMAIN).`);

  const names = [...new Set(ok.map(r => r.source.name))].join(' + ');
  return attachSource(ok.flatMap(r => r.records), {
    name: names,
    url: ok[0].source.url,
    fetchedAt: new Date().toISOString(),
  });
}