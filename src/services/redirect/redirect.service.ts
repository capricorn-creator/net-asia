import { ApiError } from '../../lib/errors';
import { fetchRedirects } from '../../lib/api';
import { attachSource } from '../../lib/source-store';
import type { RedirectResult } from '../../types';
import { getRedirectStatusText } from './redirect.parser';

/**
 * Traces every redirect hop for a URL through our own /api/redirects
 * function. The server follows redirects manually (max 10), re-checking
 * each hop against the SSRF rules.
 */
export async function checkRedirects(url: string): Promise<RedirectResult> {
  const target = url.trim();
  if (!target) throw new ApiError('invalid-input', 'Please enter a valid URL.');

  const { source, ...data } = await fetchRedirects(target);
  const result: RedirectResult = {
    ...(data as RedirectResult),
    steps: data.steps.map(s => ({
      url: s.url,
      status: s.status,
      statusText: s.statusText || getRedirectStatusText(s.status),
    })),
  };
  return attachSource(result, source);
}