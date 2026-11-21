import { ApiError } from '../../lib/errors';
import { fetchHeaders } from '../../lib/api';
import { attachSource } from '../../lib/source-store';
import type { HTTPResponse } from '../../types';
import { getStatusText } from './headers.parser';

/**
 * Fetches the final response headers for a URL through our own
 * /api/headers function (server-side fetch, redirects followed with SSRF checks).
 */
export async function lookupHeaders(url: string): Promise<HTTPResponse> {
  const target = url.trim();
  if (!target) throw new ApiError('invalid-input', 'Please enter a valid URL.');

  const { source, ...data } = await fetchHeaders(target);
  const result: HTTPResponse = { ...(data as HTTPResponse), statusText: data.statusText || getStatusText(data.status) };
  return attachSource(result, source);
}