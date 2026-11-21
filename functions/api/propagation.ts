import { HttpError, json, toResponse } from '../_lib/http';
import type { Ctx } from '../_lib/http';
import { limited } from '../_lib/ratelimit';
import { buildQuery, parseResponse, toBase64Url } from '../_lib/dns-wire';

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9_-]{1,63}\.)+[a-z0-9-]{2,63}$/;
const TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];

// Queried over RFC 8484 binary DoH from Cloudflare's network. These are anycast
// services, so each answers from the node nearest to that network.
const RESOLVERS = [
  { ip: '8.8.8.8', name: 'Google', url: 'https://dns.google/dns-query', location: 'Google Public DNS' },
  { ip: '1.1.1.1', name: 'Cloudflare', url: 'https://cloudflare-dns.com/dns-query', location: 'Cloudflare DNS' },
  { ip: '9.9.9.9', name: 'Quad9', url: 'https://dns.quad9.net/dns-query', location: 'Quad9 (blocks known-malicious domains)' },
  { ip: '208.67.222.222', name: 'OpenDNS', url: 'https://doh.opendns.com/dns-query', location: 'Cisco OpenDNS' },
  { ip: '94.140.14.14', name: 'AdGuard', url: 'https://dns.adguard-dns.com/dns-query', location: 'AdGuard DNS (blocks ads)' },
  { ip: '194.242.2.2', name: 'Mullvad', url: 'https://dns.mullvad.net/dns-query', location: 'Mullvad DNS' },
  { ip: '185.222.222.222', name: 'DNS.SB', url: 'https://doh.dns.sb/dns-query', location: 'DNS.SB' },
  { ip: '76.76.2.0', name: 'Control D', url: 'https://freedns.controld.com/p0', location: 'Control D (unfiltered)' },
];

type Resolver = (typeof RESOLVERS)[number];
type Status = 'success' | 'nxdomain' | 'timeout' | 'error';

const row = (r: Resolver, values: string[], status: Status, responseTime: number) => ({
  resolver: r.ip,
  resolverName: r.name,
  location: r.location,
  values,
  status,
  responseTime,
});

async function ask(r: Resolver, domain: string, type: string) {
  const t0 = Date.now();
  try {
    const res = await fetch(`${r.url}?dns=${toBase64Url(buildQuery(domain, type))}`, {
      headers: { accept: 'application/dns-message' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const wire = parseResponse(new Uint8Array(await res.arrayBuffer()));
    const ms = Date.now() - t0;
    if (wire.rcode === 3) return row(r, [], 'nxdomain', ms);
    if (wire.rcode !== 0) return row(r, [], 'error', ms);
    const values = wire.answers.filter(a => a.type === type).map(a => a.data);
    // No matching records counts as 'error' (same as before): the record is not visible there.
    return row(r, values, values.length ? 'success' : 'error', ms);
  } catch (e) {
    const name = (e as { name?: string })?.name;
    return row(r, [], name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'error', Date.now() - t0);
  }
}

export const onRequestGet = async ({ request }: Ctx) => {
  const over = limited(request);
  if (over) return over;
  try {
    const params = new URL(request.url).searchParams;
    const domain = (params.get('domain') ?? '').trim().toLowerCase().replace(/\.$/, '');
    const type = (params.get('type') ?? 'A').toUpperCase();
    if (!DOMAIN_RE.test(domain)) throw new HttpError('invalid-input', 400, 'Enter a valid domain name, for example example.com.');
    if (!TYPES.includes(type)) throw new HttpError('invalid-input', 400, `Record type must be one of ${TYPES.join(', ')}.`);

    const results = await Promise.all(RESOLVERS.map(r => ask(r, domain, type)));
    return json({
      domain,
      recordType: type,
      results,
      checkedAt: new Date().toISOString(),
      source: { name: "Public DoH resolvers, queried from NET Asia's server", fetchedAt: new Date().toISOString() },
    });
  } catch (e) {
    return toResponse(e);
  }
};