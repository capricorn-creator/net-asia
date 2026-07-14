import { requestJSON, requestRaw, type RequestOptions } from './request';
import { AppError, normalizeError } from './errors';

/**
 * The single entry point every service should use to talk to the network.
 *
 * This is the ONLY layer that should change if we move from free public
 * APIs to Cloudflare Workers or a custom backend — services call
 * `httpClient.get<T>(url)` and never construct `fetch()` calls directly.
 */
export const httpClient = {
  /** GET request, parses and returns JSON of type T. */
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return requestJSON<T>(url, { ...options, method: 'GET' });
  },

  /** POST request with a JSON body, parses and returns JSON of type T. */
  async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return requestJSON<T>(url, { ...options, method: 'POST', body });
  },

  /**
   * HEAD request — returns the raw Response so callers can inspect
   * status and headers without a body. Used by tools like HTTP Headers
   * Checker. Throws a normalized AppError only on network-level failure;
   * non-2xx statuses are returned, not thrown, so callers can still
   * read headers from error responses.
   */
  async head(url: string, options?: RequestOptions): Promise<Response> {
    try {
      return await requestRaw(url, { ...options, method: 'HEAD' });
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * GET request that returns the raw Response without parsing JSON.
   * Useful when a service needs to branch on status before deciding
   * how to read the body.
   */
  async getRaw(url: string, options?: RequestOptions): Promise<Response> {
    try {
      return await requestRaw(url, { ...options, method: 'GET' });
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

export type { RequestOptions };
export { AppError };
