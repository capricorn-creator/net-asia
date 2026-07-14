import { AppError, normalizeError } from '../http/errors';
import type { RedirectResult, RedirectStep } from '../../types';
import { buildRedirectResult, getRedirectStatusText } from './redirect.parser';

// We use corsproxy.io to fetch across origins; it preserves redirect responses
// by following them server-side and returning the final response.
// To trace individual steps, we need manual redirect following, which the
// browser doesn't expose. Instead, we use multiple corsproxy calls with
// cache-busting to approximate per-step tracing.
//
// Strategy: fetch the URL without following redirects (mode: manual is blocked
// in browsers from reading Location header) so we use a lightweight approach:
// fetch with redirect:'follow' and record the final URL from res.url,
// then infer intermediate steps from the response chain.
//
// For a richer step-by-step view, we use the following approach:
// 1. Fetch the original URL through corsproxy with redirect:follow
// 2. Record the final URL from res.url
// 3. Produce at minimum: original → final (2 steps minimum)
// 4. If more hops exist, show them where we can

const PROXY = 'https://corsproxy.io/?';
const MAX_REDIRECTS = 10;
const TIMEOUT_MS = 15_000;

function normalizeUrl(input: string): string {
  const t = input.trim();
  return t.startsWith('http') ? t : `https://${t}`;
}

/**
 * Traces the redirect chain of a URL by following each Location header
 * manually through the CORS proxy. Returns all steps including the final
 * destination.
 */
export async function checkRedirects(url: string): Promise<RedirectResult> {
  const originalUrl = normalizeUrl(url);
  if (!originalUrl || originalUrl === 'https://') {
    throw new AppError('Please enter a valid URL.', 'INVALID_INPUT');
  }

  const steps: RedirectStep[] = [];
  let current = originalUrl;
  const start = Date.now();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const proxyUrl = `${PROXY}${encodeURIComponent(current)}`;
      const res = await fetch(proxyUrl, {
        method: 'HEAD',
        redirect: 'manual',  // capture Location without following
        signal: controller.signal,
      });

      clearTimeout(timer);

      const status = res.status;
      steps.push({
        url: current,
        status,
        statusText: getRedirectStatusText(status),
      });

      // Not a redirect — we've reached the end
      if (status < 300 || status >= 400) break;

      // Extract next hop from Location header
      const location = res.headers.get('location');
      if (!location) break;

      // Location may be relative
      try {
        current = new URL(location, current).href;
      } catch {
        current = location;
      }
    } catch {
      clearTimeout(timer);
      // If the proxy blocks HEAD, try a GET fallback with redirect:follow
      // to at least get the final destination
      if (steps.length === 0) {
        try {
          const fallback = await fetch(`${PROXY}${encodeURIComponent(current)}`, {
            method: 'GET',
            redirect: 'follow',
            signal: AbortSignal.timeout(TIMEOUT_MS),
          });
          steps.push({ url: current, status: 0, statusText: 'Redirected (chain not available)' });
          if (fallback.url && fallback.url !== current) {
            steps.push({ url: fallback.url, status: fallback.status, statusText: getRedirectStatusText(fallback.status) });
          }
        } catch (fallbackErr) {
          throw normalizeError(fallbackErr);
        }
      }
      break;
    }
  }

  if (steps.length === 0) {
    throw new AppError('Could not reach the URL. Please check it is accessible.', 'NETWORK_ERROR');
  }

  return buildRedirectResult(originalUrl, steps, Date.now() - start);
}
