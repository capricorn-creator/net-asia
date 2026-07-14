import type { HTTPHeader, HTTPResponse } from '../../types';

const STATUS_TEXT: Record<number, string> = {
  200: 'OK', 201: 'Created', 204: 'No Content',
  301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
  400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
  404: 'Not Found', 429: 'Too Many Requests', 500: 'Internal Server Error',
  502: 'Bad Gateway', 503: 'Service Unavailable',
};

export function getStatusText(status: number): string {
  return STATUS_TEXT[status] || 'Unknown';
}

/**
 * Converts a fetch Response (read via a CORS proxy) into the application's
 * normalized HTTPResponse model.
 */
export function parseHeadersResponse(res: Response, targetUrl: string, responseTimeMs: number): HTTPResponse {
  const headers: HTTPHeader[] = [];
  res.headers.forEach((value, name) => headers.push({ name, value }));

  return {
    url: targetUrl,
    status: res.status,
    statusText: res.statusText || getStatusText(res.status),
    headers,
    responseTime: responseTimeMs,
    serverInfo: res.headers.get('server') || undefined,
  };
}

/**
 * Builds the normalized HTTPResponse used when only an opaque (no-cors)
 * response could be obtained — i.e. the server responded but the proxy
 * path failed and headers are unreadable due to CORS policy.
 */
export function buildOpaqueResponse(targetUrl: string, responseTimeMs: number): HTTPResponse {
  return {
    url: targetUrl,
    status: 0,
    statusText: 'Opaque Response (CORS restricted)',
    headers: [
      { name: 'note', value: 'Full headers unavailable due to CORS policy. The server responded but headers are restricted.' },
    ],
    responseTime: responseTimeMs,
  };
}
