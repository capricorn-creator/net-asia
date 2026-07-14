import { httpClient } from '../http/client';
import { AppError } from '../http/errors';
import type { ReverseDNSResult } from '../../types';
import { ipToArpa, parseReverseDNSResponse, type DoHResponse } from './rdns.parser';

const BASE_URL = 'https://dns.google/resolve';

/**
 * Performs a reverse DNS lookup (PTR record) for an IP address using
 * Google's DNS-over-HTTPS API.
 */
export async function lookupReverseDNS(ip: string): Promise<ReverseDNSResult> {
  const target = ip.trim();
  if (!target) {
    throw new AppError('Please enter an IP address.', 'INVALID_INPUT');
  }

  const arpa = ipToArpa(target);
  const url = `${BASE_URL}?name=${encodeURIComponent(arpa)}&type=PTR`;
  const start = Date.now();

  const raw = await httpClient.get<DoHResponse>(url);
  const responseTime = Date.now() - start;

  return parseReverseDNSResponse(raw, target, responseTime);
}
