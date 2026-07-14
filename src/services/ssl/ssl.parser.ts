import type { SSLCertificate } from '../../types';

/**
 * Raw certificate transparency log entry as returned by crt.sh.
 * Only this file should know these field names.
 */
interface CrtShEntry {
  common_name?: string;
  issuer_name?: string;
  not_before: string;
  not_after: string;
  serial_number?: string;
  name_value?: string;
}

/**
 * Converts the most recent crt.sh certificate transparency entry into
 * the application's normalized SSLCertificate model, including derived
 * fields (`daysRemaining`, `isValid`) computed at parse time.
 */
export function parseSSLResponse(entries: CrtShEntry[], fallbackDomain: string): SSLCertificate {
  // Sort newest-expiring first so we always report the most current cert.
  const sorted = [...entries].sort(
    (a, b) => new Date(b.not_after).getTime() - new Date(a.not_after).getTime()
  );

  const cert = sorted[0];
  const validFrom = new Date(cert.not_before);
  const validTo = new Date(cert.not_after);
  const daysRemaining = Math.ceil((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const subjectAltNames = (cert.name_value || '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    subject: cert.common_name || fallbackDomain,
    issuer: cert.issuer_name || 'Unknown',
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining,
    isValid: daysRemaining > 0,
    serialNumber: cert.serial_number,
    subjectAltNames: subjectAltNames.slice(0, 10),
  };
}

export type { CrtShEntry };
