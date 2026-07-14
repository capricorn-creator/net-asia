import type { DNSRecord } from '../../types';

/**
 * Raw response shape returned by Google's DNS-over-HTTPS API
 * (https://dns.google/resolve). Only this file knows this shape.
 */
interface GoogleDoHAnswer {
  name: string;
  type: number;
  TTL?: number;
  data: string;
  priority?: number;
}

interface GoogleDoHResponse {
  Status: number;
  Answer?: GoogleDoHAnswer[];
}

/**
 * Converts a single Google DoH response (for one record type) into the
 * application's normalized DNSRecord[] model.
 */
export function parseDNSResponse(raw: GoogleDoHResponse, type: string): DNSRecord[] {
  if (!raw.Answer) return [];

  return raw.Answer.map(rec => ({
    type,
    name: rec.name,
    value: rec.data,
    ttl: rec.TTL,
    priority: rec.priority,
  }));
}

export type { GoogleDoHResponse, GoogleDoHAnswer };
