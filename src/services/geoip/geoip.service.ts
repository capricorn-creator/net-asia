import { lookupGeo } from '../geoProviders';
import { attachSource } from '../../lib/source-store';
import type { GeoIPResult } from '../../types';

/**
 * Detailed geolocation for an IP address. An empty string looks up the
 * caller's own public IP. `is_mobile` and `is_proxy` are not provided by
 * the HTTPS providers, so they are left undefined rather than guessed.
 */
export async function lookupGeoIP(ip: string): Promise<GeoIPResult> {
  const { data, source } = await lookupGeo(ip);
  return attachSource(data, source);
}