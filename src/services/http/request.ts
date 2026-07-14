import { AppError, errorFromStatus, normalizeError } from './errors';

const DEFAULT_TIMEOUT_MS = 12_000;

export interface RequestOptions {
  /** Extra headers to send with the request. */
  headers?: Record<string, string>;
  /** Abort the request after this many milliseconds. Default: 12000. */
  timeoutMs?: number;
  /** HTTP method. Default: GET. */
  method?: 'GET' | 'POST' | 'HEAD';
  /** JSON-serializable request body (POST only). */
  body?: unknown;
  /** Optional external AbortSignal to compose with the internal timeout. */
  signal?: AbortSignal;
}

/**
 * Performs a fetch with a hard timeout and normalized error handling.
 * Returns the raw Response so callers can decide how to read the body
 * (json/text/headers-only for HEAD requests).
 */
export async function rawRequest(url: string, options: RequestOptions = {}): Promise<Response> {
  const { headers, timeoutMs = DEFAULT_TIMEOUT_MS, method = 'GET', body, signal: externalSignal } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Compose an external signal (if provided) with our internal timeout signal.
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      redirect: 'follow',
      signal: controller.signal,
    });
    return res;
  } catch (err) {
    throw normalizeError(err);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Performs a request and parses the response body as JSON, throwing a
 * normalized AppError for non-2xx responses or malformed JSON.
 */
export async function requestJSON<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const res = await rawRequest(url, options);

  if (!res.ok) {
    throw errorFromStatus(res.status, res.statusText);
  }

  try {
    return (await res.json()) as T;
  } catch (err) {
    throw new AppError('The server returned an unexpected response.', 'INVALID_RESPONSE', res.status, err);
  }
}

/**
 * Performs a request and returns only the raw Response, for callers that
 * need access to headers/status without parsing the body (e.g. HEAD checks).
 * Still throws a normalized AppError for network-level failures, but does
 * NOT throw on non-2xx — callers may want to inspect those manually.
 */
export async function requestRaw(url: string, options: RequestOptions = {}): Promise<Response> {
  return rawRequest(url, options);
}
