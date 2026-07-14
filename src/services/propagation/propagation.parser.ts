import type { PropagationResult } from '../../types';

interface DoHResponse {
  Status: number;
  Answer?: { name: string; type: number; TTL: number; data: string }[];
}

/**
 * Converts a single DoH resolver response into a PropagationResult row.
 * Status 0 = NOERROR, 3 = NXDOMAIN.
 */
export function parsePropagationResponse(
  raw: DoHResponse | null,
  resolver: string,
  resolverName: string,
  location: string,
  responseTime: number
): PropagationResult {
  if (raw === null) {
    return { resolver, resolverName, location, values: [], status: 'timeout', responseTime };
  }

  if (raw.Status === 3) {
    return { resolver, resolverName, location, values: [], status: 'nxdomain', responseTime };
  }

  if (raw.Status !== 0 || !raw.Answer?.length) {
    return { resolver, resolverName, location, values: [], status: 'error', responseTime };
  }

  const values = raw.Answer.map(a => a.data.replace(/\.$/, ''));
  return { resolver, resolverName, location, values, status: 'success', responseTime };
}

export type { DoHResponse as PropDoHResponse };
