import { callApi } from '../../lib/api';
import { cleanDomain } from '../../lib/domain';
import { attachSource } from '../../lib/source-store';
import type { DNSPropagationResult } from '../../types';

export const PROPAGATION_RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'] as const;

/**
 * Asks 8 public DNS resolvers for the record via our own /api/propagation
 * function. Failures are returned per resolver (timeout / nxdomain / error)
 * so the UI can show which resolvers have the record and which do not.
 */
export async function checkDNSPropagation(domain: string, recordType: string = 'A'): Promise<DNSPropagationResult> {
  const name = cleanDomain(domain);
  const { source, ...data } = await callApi<DNSPropagationResult>('propagation', { domain: name, type: recordType });
  return attachSource(data as DNSPropagationResult, source);
}