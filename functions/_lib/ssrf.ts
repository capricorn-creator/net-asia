import { HttpError } from './http';

const MAX_REDIRECTS = 10;
const HOP_TIMEOUT_MS = 8000;
const UA = 'Mozilla/5.0 (compatible; NetAsiaBot/1.0; +https://net-asia.com/about)';
const BLOCKED_SUFFIXES = ['.localhost', '.local', '.internal', '.lan', '.localdomain', '.intranet', '.home.arpa'];
const HOSTNAME_RE = /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/;

function privateV4(host: string): boolean {
  const [a, b, c] = host.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

/** Only global unicast (2000::/3) is allowed, minus documentation, 6to4 and Teredo ranges. */
function publicV6(host: string): boolean {
  const h = host.slice(1, -1);
  if (!/^[23]/.test(h)) return false;
  return !(h.startsWith('2001:db8') || h.startsWith('2002:') || h.startsWith('2001:0:'));
}

export function assertPublicTarget(url: URL): void {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new HttpError('invalid-input', 400, 'Only http and https URLs can be checked.');
  }
  if (url.username || url.password) {
    throw new HttpError('invalid-input', 400, 'URLs with a username or password are not accepted.');
  }
  if (url.port && url.port !== '80' && url.port !== '443') {
    throw new HttpError('blocked-target', 403, 'Only the default web ports (80 and 443) can be checked.');
  }
  let host = url.hostname.toLowerCase();
  const blocked = () => new HttpError('blocked-target', 403, 'That address is private or reserved, so it cannot be checked.');

  if (host.startsWith('[')) {
    if (!publicV6(host)) throw blocked();
    return;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    if (privateV4(host)) throw blocked();
    return;
  }
  if (host.endsWith('.')) host = host.slice(0, -1);
  if (host === 'localhost' || BLOCKED_SUFFIXES.some(s => host.endsWith(s))) throw blocked();
  if (!HOSTNAME_RE.test(host)) throw new HttpError('invalid-input', 400, 'Enter a valid domain name or URL.');
}

export function parseTarget(raw: string): URL {
  const input = raw.trim();
  if (!input || input.length > 2048) throw new HttpError('invalid-input', 400, 'Enter a domain name or URL.');
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new HttpError('invalid-input', 400, 'Enter a valid domain name or URL.');
  }
  assertPublicTarget(url);
  return url;
}

function classify(e: unknown): HttpError {
  const name = (e as { name?: string })?.name;
  if (name === 'TimeoutError' || name === 'AbortError') {
    return new HttpError('timeout', 504, 'The site did not respond within 8 seconds.');
  }
  return new HttpError('unreachable', 502, 'Could not connect to that host. It may be offline or may block automated requests.');
}

export interface Hop {
  url: string;
  status: number;
  statusText: string;
  location: string | null;
  ms: number;
}

export interface Chain {
  hops: Hop[];
  response: Response;
  finalUrl: string;
  truncated: boolean;
  totalMs: number;
}

/** Follows redirects by hand so every hop is re-validated. Caller must consume or cancel `response.body`. */
export async function followChain(start: URL, accept = '*/*'): Promise<Chain> {
  const hops: Hop[] = [];
  const t0 = Date.now();
  let current = start;

  for (let i = 0; ; i++) {
    const h0 = Date.now();
    let res: Response;
    try {
      res = await fetch(current.toString(), {
        method: 'GET',
        redirect: 'manual',
        headers: { 'user-agent': UA, accept },
        signal: AbortSignal.timeout(HOP_TIMEOUT_MS),
      });
    } catch (e) {
      throw classify(e);
    }
    const location = res.headers.get('location');
    hops.push({ url: current.toString(), status: res.status, statusText: res.statusText, location, ms: Date.now() - h0 });

    const redirect = res.status >= 300 && res.status < 400 && !!location;
    if (!redirect) return { hops, response: res, finalUrl: current.toString(), truncated: false, totalMs: Date.now() - t0 };

    await res.body?.cancel();
    if (i >= MAX_REDIRECTS) return { hops, response: res, finalUrl: current.toString(), truncated: true, totalMs: Date.now() - t0 };

    let next: URL;
    try {
      next = new URL(location, current);
    } catch {
      throw new HttpError('provider', 502, 'The server sent an invalid redirect location.');
    }
    try {
      assertPublicTarget(next);
    } catch {
      throw new HttpError('blocked-target', 403, `A redirect pointed to a blocked address (${next.hostname}).`);
    }
    current = next;
  }
}

export async function readText(res: Response, maxBytes = 1_000_000): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        chunks.push(value.subarray(0, value.byteLength - (total - maxBytes)));
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
  } catch (e) {
    throw classify(e);
  }

  // Join the chunks by hand (instead of new Blob(chunks)) to avoid the SharedArrayBuffer typing error.
  const size = chunks.reduce((n, c) => n + c.byteLength, 0);
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(bytes);
}