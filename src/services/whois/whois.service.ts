import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import { parseWHOISResponse, type RdapResponse, type WHOISResult } from './whois.parser';

const BASE_URL = 'https://rdap.org/domain';

function stripToHostname(domain: string): string {
  return domain.trim().replace(/^https?:\/\//, '').split('/')[0];
}

/**
 * Looks up domain registration data via the RDAP protocol. Returns the
 * normalized `WHOISResult` shape (`{ raw, parsed }`) used by the WHOIS
 * Lookup page's parsed/raw view toggle.
 */
export async function lookupWHOIS(domain: string): Promise<WHOISResult> {
  const cleanDomain = stripToHostname(domain);

  if (!cleanDomain) {
    throw new AppError('Please enter a valid domain name.', 'INVALID_INPUT');
  }

  const url = `${BASE_URL}/${encodeURIComponent(cleanDomain)}`;
  const raw = await httpClient.get<RdapResponse>(url);

  return parseWHOISResponse(raw, cleanDomain);
}

export type { WHOISResult };
