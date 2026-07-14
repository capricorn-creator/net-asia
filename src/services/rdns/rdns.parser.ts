import type { ReverseDNSResult } from '../../types';

interface DoHAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DoHResponse {
  Status: number; // RCODE: 0=NOERROR, 3=NXDOMAIN
  Answer?: DoHAnswer[];
}

/**
 * Converts an IPv4 or IPv6 address to the arpa format required for PTR lookups.
 * 1.2.3.4     → 4.3.2.1.in-addr.arpa
 * 2001:db8::1 → 1.0.0.0.[...].ip6.arpa
 */
export function ipToArpa(ip: string): string {
  if (ip.includes(':')) {
    // IPv6: expand, reverse nibbles, append .ip6.arpa
    const expanded = expandIPv6(ip);
    return expanded.split('').filter(c => c !== ':').reverse().join('.') + '.ip6.arpa';
  }
  // IPv4
  return ip.split('.').reverse().join('.') + '.in-addr.arpa';
}

function expandIPv6(ip: string): string {
  const halves = ip.split('::');
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves[1] ? halves[1].split(':') : [];
  const missing = 8 - left.length - right.length;
  const groups = [...left, ...Array(missing).fill('0000'), ...right];
  return groups.map(g => g.padStart(4, '0')).join(':');
}

export function parseReverseDNSResponse(
  raw: DoHResponse,
  ip: string,
  responseTime: number
): ReverseDNSResult {
  if (raw.Status === 3 || !raw.Answer?.length) {
    return { ip, hostname: null, status: 'no-ptr', responseTime };
  }

  // PTR record type = 12; pick the first answer of that type
  const ptr = raw.Answer.find(a => a.type === 12);
  if (!ptr) {
    return { ip, hostname: null, status: 'no-ptr', responseTime };
  }

  // PTR values end with a trailing dot; strip it for display
  const hostname = ptr.data.replace(/\.$/, '');
  return { ip, hostname, status: 'resolved', ttl: ptr.TTL, responseTime };
}

export type { DoHResponse };
