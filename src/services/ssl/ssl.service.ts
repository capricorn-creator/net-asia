import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import type { SSLCertificate } from '../../types';
import { parseSSLResponse, type CrtShEntry } from './ssl.parser';

const BASE_URL = 'https://crt.sh';

function stripToHostname(domain: string): string {
  return domain.trim().replace(/^https?:\/\//, '').split('/')[0];
}

/**
 * Looks up the most recent SSL/TLS certificate for a domain via
 * certificate transparency logs (crt.sh). Returns the normalized
 * `SSLCertificate` model with validity and expiry already computed.
 */
export async function lookupSSL(domain: string): Promise<SSLCertificate> {
  const cleanDomain = stripToHostname(domain);

  if (!cleanDomain) {
    throw new AppError('Please enter a valid domain name.', 'INVALID_INPUT');
  }

  const url = `${BASE_URL}/?q=${encodeURIComponent(cleanDomain)}&output=json`;
  const entries = await httpClient.get<CrtShEntry[]>(url);

  if (!entries?.length) {
    throw new AppError('No SSL certificates found for this domain.', 'NOT_FOUND');
  }

  return parseSSLResponse(entries, cleanDomain);
}
