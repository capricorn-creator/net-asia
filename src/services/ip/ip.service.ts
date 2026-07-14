import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import type { IPInfo } from '../../types';
import { parseIPResponse, type IpApiCoResponse } from './ip.parser';

const BASE_URL = 'https://ipapi.co';

/**
 * Looks up geolocation, ISP, ASN, and timezone information for an IP
 * address. Passing an empty string looks up the caller's own IP.
 *
 * This is the only function the rest of the app should call for IP
 * lookups — it owns the endpoint URL and the provider-specific error
 * shape (`{ error: true, reason }`), and always returns the normalized
 * `IPInfo` model or throws a normalized `AppError`.
 */
export async function lookupIP(ip: string): Promise<IPInfo> {
  const target = ip.trim();
  const url = target ? `${BASE_URL}/${encodeURIComponent(target)}/json/` : `${BASE_URL}/json/`;

  const raw = await httpClient.get<IpApiCoResponse>(url);

  if (raw.error) {
    throw new AppError(raw.reason || 'Invalid IP address.', 'INVALID_INPUT');
  }

  return parseIPResponse(raw);
}
