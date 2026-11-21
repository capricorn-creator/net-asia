import { lookupGeo } from '../geoProviders';
import { attachSource } from '../../lib/source-store';
import type { GeoIPResult, IPInfo } from '../../types';

function toIPInfo(g: GeoIPResult): IPInfo {
  return {
    ip: g.ip,
    city: g.city,
    region: g.region,
    country: g.country_code,
    country_name: g.country_name,
    org: g.org ?? g.isp,
    isp: g.isp,
    timezone: g.timezone,
    latitude: g.latitude,
    longitude: g.longitude,
    asn: g.asn,
  };
}

/**
 * Looks up geolocation, ISP, ASN and timezone for an IP address.
 * An empty string looks up the caller's own public IP.
 * Providers (ipwho.is, then ipapi.co) are tried in order; see geoProviders.ts.
 */
export async function lookupIP(ip: string): Promise<IPInfo> {
  const { data, source } = await lookupGeo(ip);
  return attachSource(toIPInfo(data), source);
}