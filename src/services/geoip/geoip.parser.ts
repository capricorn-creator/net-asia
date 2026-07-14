import type { GeoIPResult } from '../../types';

// Raw shape from ip-api.com (free JSON endpoint)
interface IpApiComResponse {
  status: 'success' | 'fail';
  message?: string;
  query: string;
  // Location
  continent?: string;
  country?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  // Network
  as?: string;
  asname?: string;
  org?: string;
  isp?: string;
  // Classification
  mobile?: boolean;
  proxy?: boolean;
}

/**
 * Converts a country code (ISO 3166-1 alpha-2) to a flag emoji.
 * Works by mapping each letter to its regional indicator symbol.
 */
function countryCodeToFlag(code?: string): string | undefined {
  if (!code || code.length !== 2) return undefined;
  return [...code.toUpperCase()]
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}

function detectIPVersion(ip: string): 'IPv4' | 'IPv6' {
  return ip.includes(':') ? 'IPv6' : 'IPv4';
}

export function parseGeoIPResponse(raw: IpApiComResponse): GeoIPResult {
  return {
    ip: raw.query,
    type: detectIPVersion(raw.query),
    continent: raw.continent,
    country: raw.countryCode,
    country_name: raw.country,
    country_code: raw.countryCode,
    flag: countryCodeToFlag(raw.countryCode),
    region: raw.regionName,
    city: raw.city,
    zip: raw.zip,
    timezone: raw.timezone,
    latitude: raw.lat,
    longitude: raw.lon,
    asn: raw.as,
    org: raw.asname || raw.org,
    isp: raw.isp,
    is_mobile: raw.mobile,
    is_proxy: raw.proxy,
  };
}

export type { IpApiComResponse };
