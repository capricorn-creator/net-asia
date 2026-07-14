import type { IPInfo } from '../../types';

/**
 * Raw response shape returned by ipapi.co. This interface exists ONLY in
 * the parser — no other file in the app should know these field names.
 */
interface IpApiCoResponse {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  org?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
  error?: boolean;
  reason?: string;
}

/**
 * Converts a raw ipapi.co response into the application's normalized
 * IPInfo model. If the provider changes (or we swap to a different free
 * API, or a Cloudflare Worker), only this function needs to change.
 */
export function parseIPResponse(raw: IpApiCoResponse): IPInfo {
  return {
    ip: raw.ip,
    city: raw.city,
    region: raw.region,
    country: raw.country,
    country_name: raw.country_name,
    org: raw.org,
    timezone: raw.timezone,
    latitude: raw.latitude,
    longitude: raw.longitude,
    asn: raw.asn,
  };
}

export type { IpApiCoResponse };
