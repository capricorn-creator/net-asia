import { httpClient } from '../http/client';
import { AppError, normalizeError } from '../http/errors';
import type { HTTPResponse } from '../../types';
import { parseHeadersResponse, buildOpaqueResponse } from './headers.parser';

const PROXY_BASE_URL = 'https://corsproxy.io/?';

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}

/**
 * Fetches HTTP response headers for a URL. Browsers block reading
 * cross-origin headers directly, so this goes through a public CORS
 * proxy; if the proxy is unreachable, it falls back to a no-cors probe
 * that confirms the server responded but cannot read header values.
 */
export async function lookupHeaders(url: string): Promise<HTTPResponse> {
  const targetUrl = normalizeUrl(url);
  if (!targetUrl || targetUrl === 'https://') {
    throw new AppError('Please enter a valid URL.', 'INVALID_INPUT');
  }

  const startTime = Date.now();
  const proxyUrl = `${PROXY_BASE_URL}${encodeURIComponent(targetUrl)}`;

  try {
    const res = await httpClient.head(proxyUrl);
    return parseHeadersResponse(res, targetUrl, Date.now() - startTime);
  } catch {
    // Proxy failed — attempt a no-cors probe as a last resort so the
    // user at least learns whether the server is reachable at all.
    try {
      await fetch(targetUrl, { method: 'GET', mode: 'no-cors', redirect: 'follow' });
      return buildOpaqueResponse(targetUrl, Date.now() - startTime);
    } catch (err) {
      throw normalizeError(err);
    }
  }
}
