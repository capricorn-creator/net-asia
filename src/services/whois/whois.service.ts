import { callApi } from '../../lib/api';
import { cleanDomain } from '../../lib/domain';
import { attachSource } from '../../lib/source-store';
import { parseWHOISResponse, type RdapResponse, type WHOISResult } from './whois.parser';

/**
 * Looks up domain registration data over RDAP. The request goes to our own
 * /api/rdap function, which finds the right registry server via the IANA
 * bootstrap list (browsers cannot call most registries directly: no CORS).
 */
export async function lookupWHOIS(domain: string): Promise<WHOISResult> {
  const name = cleanDomain(domain);
  const { source, ...rdap } = await callApi<RdapResponse>('rdap', { domain: name });
  return attachSource(parseWHOISResponse(rdap as RdapResponse, name), source);
}

export type { WHOISResult };