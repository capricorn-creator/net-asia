import type { DNSRecord, IPInfo, SSLCertificate, HTTPHeader, HTTPResponse } from '../types';

// ── IP Lookup ────────────────────────────────────────────────────
export async function lookupIP(ip: string): Promise<IPInfo> {
  const target = ip.trim() || '';
  const endpoint = target
    ? `https://ipapi.co/${target}/json/`
    : 'https://ipapi.co/json/';

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IP info`);
  const data = await res.json();

  if (data.error) throw new Error(data.reason || 'Invalid IP address');

  return {
    ip: data.ip,
    city: data.city,
    region: data.region,
    country: data.country,
    country_name: data.country_name,
    org: data.org,
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
    asn: data.asn,
  };
}

// ── DNS Lookup ───────────────────────────────────────────────────
const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA'];

async function queryDNSType(domain: string, type: string): Promise<DNSRecord[]> {
  const res = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.Answer) return [];

  return data.Answer.map((rec: { name: string; data: string; TTL?: number; priority?: number }) => ({
    type,
    name: rec.name,
    value: rec.data,
    ttl: rec.TTL,
    priority: rec.priority,
  }));
}

export async function lookupDNS(
  domain: string,
  type: string = 'ALL'
): Promise<DNSRecord[]> {
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];

  if (type === 'ALL') {
    const results = await Promise.allSettled(
      DNS_TYPES.map(t => queryDNSType(cleanDomain, t))
    );
    return results
      .filter((r): r is PromiseFulfilledResult<DNSRecord[]> => r.status === 'fulfilled')
      .flatMap(r => r.value);
  }

  return queryDNSType(cleanDomain, type);
}

// ── WHOIS Lookup ─────────────────────────────────────────────────
export async function lookupWHOIS(domain: string): Promise<{ raw: string; parsed: Record<string, string> }> {
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];

  // Use WHOIS API via Cloudflare-accessible endpoint
  const res = await fetch(`https://rdap.org/domain/${cleanDomain}`);
  if (!res.ok) {
    // Fallback to whois.iana.org style data via a CORS proxy alternative
    throw new Error(`Unable to fetch WHOIS data. Status: ${res.status}`);
  }

  const data = await res.json();

  // Parse RDAP response into human-readable format
  const parsed: Record<string, string> = {};
  
  parsed['Domain Name'] = data.ldhName || cleanDomain.toUpperCase();
  parsed['Registry Domain ID'] = data.handle || 'N/A';
  parsed['Status'] = (data.status || []).join(', ') || 'N/A';

  // Events (created, expiry, updated)
  if (data.events) {
    for (const event of data.events) {
      if (event.eventAction === 'registration') parsed['Created Date'] = event.eventDate;
      if (event.eventAction === 'expiration') parsed['Expiry Date'] = event.eventDate;
      if (event.eventAction === 'last changed') parsed['Updated Date'] = event.eventDate;
    }
  }

  // Nameservers
  if (data.nameservers) {
    parsed['Name Servers'] = data.nameservers.map((ns: { ldhName: string }) => ns.ldhName).join(', ');
  }

  // Registrar info
  if (data.entities) {
    for (const entity of data.entities) {
      if (entity.roles?.includes('registrar')) {
        parsed['Registrar'] = entity.vcardArray?.[1]?.find((v: string[]) => v[0] === 'fn')?.[3] || entity.handle || 'N/A';
        if (entity.publicIds?.[0]?.identifier) {
          parsed['Registrar IANA ID'] = entity.publicIds[0].identifier;
        }
      }
      if (entity.roles?.includes('registrant')) {
        const vcard = entity.vcardArray?.[1] || [];
        const org = vcard.find((v: string[]) => v[0] === 'org')?.[3];
        const country = vcard.find((v: string[]) => v[0] === 'adr')?.[3]?.[6];
        if (org) parsed['Registrant Organization'] = org;
        if (country) parsed['Registrant Country'] = country;
      }
    }
  }

  const raw = Object.entries(parsed)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  return { raw, parsed };
}

// ── SSL Certificate Checker ──────────────────────────────────────
export async function checkSSL(domain: string): Promise<SSLCertificate> {
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];

  // Use SSL Labs API (free, no key needed for basic checks)
  // Fallback: use crt.sh for cert data
  const res = await fetch(
    `https://crt.sh/?q=${encodeURIComponent(cleanDomain)}&output=json`
  );

  if (!res.ok) throw new Error('Failed to fetch SSL data');

  const certs = await res.json();
  if (!certs?.length) throw new Error('No SSL certificates found for this domain');

  // Sort by newest
  const sorted = certs.sort(
    (a: { not_after: string }, b: { not_after: string }) =>
      new Date(b.not_after).getTime() - new Date(a.not_after).getTime()
  );

  const cert = sorted[0];
  const validTo = new Date(cert.not_after);
  const validFrom = new Date(cert.not_before);
  const now = new Date();
  const daysRemaining = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Get SANs from the cert entry
  const san = cert.name_value || '';
  const subjectAltNames = san
    .split('\n')
    .map((s: string) => s.trim())
    .filter(Boolean);

  return {
    subject: cert.common_name || cleanDomain,
    issuer: cert.issuer_name || 'Unknown',
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining,
    isValid: daysRemaining > 0,
    serialNumber: cert.serial_number,
    subjectAltNames: subjectAltNames.slice(0, 10),
  };
}

// ── HTTP Headers Checker ─────────────────────────────────────────
export async function checkHTTPHeaders(url: string): Promise<HTTPResponse> {
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  const startTime = Date.now();

  // Use a CORS-friendly approach via allorigins or direct fetch
  // Direct fetch with no-cors won't give headers, so we use a proxy
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl, {
      method: 'HEAD',
      redirect: 'follow',
    });

    const responseTime = Date.now() - startTime;
    const headers: HTTPHeader[] = [];

    res.headers.forEach((value, name) => {
      headers.push({ name, value });
    });

    return {
      url: targetUrl,
      status: res.status,
      statusText: res.statusText || getStatusText(res.status),
      headers,
      responseTime,
      serverInfo: res.headers.get('server') || undefined,
    };
  } catch {
    // If proxy fails, try direct fetch (works for same-origin or CORS-enabled)
    try {
      await fetch(targetUrl, {
        method: 'GET',
        mode: 'no-cors',
        redirect: 'follow',
      });

      // no-cors gives opaque response – report what we can
      return {
        url: targetUrl,
        status: 0,
        statusText: 'Opaque Response (CORS restricted)',
        headers: [
          { name: 'note', value: 'Full headers unavailable due to CORS policy. The server responded but headers are restricted.' }
        ],
        responseTime: Date.now() - startTime,
      };
    } catch (e) {
      throw new Error(`Connection failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }
}

function getStatusText(status: number): string {
  const map: Record<number, string> = {
    200: 'OK', 201: 'Created', 204: 'No Content',
    301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
    404: 'Not Found', 429: 'Too Many Requests', 500: 'Internal Server Error',
    502: 'Bad Gateway', 503: 'Service Unavailable',
  };
  return map[status] || 'Unknown';
}

export const DNS_RECORD_TYPES = ['ALL', ...DNS_TYPES];
