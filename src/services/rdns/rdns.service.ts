import { ApiError } from '../../lib/errors';
import { attachSource } from '../../lib/source-store';
import type { ReverseDNSResult } from '../../types';
import { dohQuery } from '../doh';
import { isIPv4, isIPv6 } from '../geoProviders';
import { ipToArpa, parseReverseDNSResponse } from './rdns.parser';

/** Reverse DNS (PTR) lookup for an IPv4 or IPv6 address. */
export async function lookupReverseDNS(ip: string): Promise<ReverseDNSResult> {
  const target = ip.trim();
  if (!target) throw new ApiError('invalid-input', 'Enter an IP address.');
  const valid = isIPv4(target) || (isIPv6(target) && !target.includes('.'));
  if (!valid) {
    throw new ApiError('invalid-input', 'Enter a valid IPv4 or IPv6 address (IPv4-mapped IPv6 notation is not supported).');
  }

  const start = Date.now();
  const { response, source } = await dohQuery(ipToArpa(target), 'PTR');
  if (response.Status !== 0 && response.Status !== 3) {
    throw new ApiError('provider', `The resolver returned DNS status ${response.Status}. Try again shortly.`);
  }
  return attachSource(parseReverseDNSResponse(response, target, Date.now() - start), source);
}