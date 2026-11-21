import { ApiError, API_ERROR_KINDS } from './errors';
import type { ApiErrorKind } from './errors';
import type { HTTPResponse, RedirectResult, TechDetectionResult } from '../types';

export interface DataSourceInfo {
  name: string;
  url?: string;
  fetchedAt: string;
}
export type WithSource<T> = T & { source: DataSourceInfo };

const CLIENT_TIMEOUT_MS = 30_000;

export async function callApi<T>(endpoint: string, params: Record<string, string>, signal?: AbortSignal): Promise<WithSource<T>> {
  const ctrl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    ctrl.abort();
  }, CLIENT_TIMEOUT_MS);
  signal?.addEventListener('abort', () => ctrl.abort(), { once: true });

  try {
    const res = await fetch(`/api/${endpoint}?${new URLSearchParams(params)}`, { signal: ctrl.signal });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const err = body?.error as { kind?: string; message?: string } | undefined;
      const kind = API_ERROR_KINDS.includes(err?.kind as ApiErrorKind) ? (err!.kind as ApiErrorKind) : 'provider';
      throw new ApiError(kind, err?.message);
    }
    return body as WithSource<T>;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (signal?.aborted) throw e;
    throw new ApiError(timedOut ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
}

export const fetchHeaders = (url: string, signal?: AbortSignal) => callApi<HTTPResponse>('headers', { url }, signal);
export const fetchRedirects = (url: string, signal?: AbortSignal) => callApi<RedirectResult>('redirects', { url }, signal);
export const fetchTech = (url: string, signal?: AbortSignal) => callApi<TechDetectionResult>('tech', { url }, signal);

export interface CtCertificate {
  id: number;
  commonName: string;
  names: string[];
  issuer: string;
  notBefore: string;
  notAfter: string;
  serial: string;
}
export const fetchCertificates = (domain: string, signal?: AbortSignal) =>
  callApi<{ domain: string; certificates: CtCertificate[] }>('ct', { domain }, signal);