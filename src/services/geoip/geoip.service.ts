import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import type { GeoIPResult } from '../../types';
import { parseGeoIPResponse, type IpApiComResponse } from './geoip.parser';

// ip-api.com: free for non-commercial, 45 req/min, no key needed.
// Fields parameter requests exactly what we need (reduces payload size).
const BASE_URL = 'http://ip-api.com/json';
const FIELDS = 'status,message,query,continent,country,countryCode,regionName,city,zip,lat,lon,timezone,as,asname,org,isp,mobile,proxy';

/**
 * Looks up detailed geolocation information for an IP address.
 * Pass an empty string to look up the caller's own public IP.
 */
export async function lookupGeoIP(ip: string): Promise<GeoIPResult> {
  const target = ip.trim();
  const url = `${BASE_URL}/${encodeURIComponent(target || '')}?fields=${FIELDS}`;

  const raw = await httpClient.get<IpApiComResponse>(url);

  if (raw.status === 'fail') {
    throw new AppError(raw.message || 'Invalid IP address or lookup failed.', 'INVALID_INPUT');
  }

  return parseGeoIPResponse(raw);
}
