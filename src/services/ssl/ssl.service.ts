import { ApiError } from '../../lib/errors';
import { fetchCertificates } from '../../lib/api';
import { cleanDomain } from '../../lib/domain';
import { attachSource } from '../../lib/source-store';
import type { SSLCertificate } from '../../types';
import { parseSSLResponse, type CrtShEntry } from './ssl.parser';

// Both sources send timestamps without a zone ("2025-01-31T00:00:00") or with Z. They are UTC.
const utc = (s: string) => (/(Z|[+-]\d\d:?\d\d)$/.test(s) ? s : `${s}Z`);

/**
 * Finds the most recent certificate logged for a domain in Certificate
 * Transparency logs (via /api/ct). This is the latest *logged* certificate,
 * not a live TLS handshake with the server.
 */
export async function lookupSSL(domain: string): Promise<SSLCertificate> {
  const name = cleanDomain(domain);
  const { certificates, source } = await fetchCertificates(name);

  if (!certificates.length) {
    throw new ApiError('not-found', 'No certificates were found in Certificate Transparency logs for this domain.');
  }

  const entries: CrtShEntry[] = certificates.map(c => ({
    common_name: c.commonName,
    issuer_name: c.issuer || undefined,
    not_before: utc(c.notBefore),
    not_after: utc(c.notAfter),
    serial_number: c.serial || undefined,
    name_value: c.names.join('\n'),
  }));

  return attachSource(parseSSLResponse(entries, name), source);
}