import type { RedirectStep, RedirectResult } from '../../types';

const STATUS_TEXT: Record<number, string> = {
  200: 'OK', 201: 'Created', 204: 'No Content',
  301: 'Moved Permanently', 302: 'Found', 303: 'See Other',
  307: 'Temporary Redirect', 308: 'Permanent Redirect',
  400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
  404: 'Not Found', 429: 'Too Many Requests',
  500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable',
};

export function getRedirectStatusText(status: number): string {
  return STATUS_TEXT[status] || `HTTP ${status}`;
}

export function buildRedirectResult(
  originalUrl: string,
  steps: RedirectStep[],
  totalResponseTime: number
): RedirectResult {
  const finalUrl = steps[steps.length - 1]?.url ?? originalUrl;
  const redirectSteps = steps.slice(0, -1); // all except the final destination
  const redirectCount = redirectSteps.filter(s => s.status >= 300 && s.status < 400).length;

  const isHttpsUpgrade =
    originalUrl.startsWith('http://') && finalUrl.startsWith('https://');

  return {
    originalUrl,
    finalUrl,
    steps,
    redirectCount,
    totalResponseTime,
    isHttpsUpgrade,
  };
}
