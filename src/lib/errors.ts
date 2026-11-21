export type ApiErrorKind =
  | 'timeout'
  | 'rate-limited'
  | 'invalid-input'
  | 'blocked-target'
  | 'unreachable'
  | 'provider'
  | 'network'
  | 'not-found';

export const API_ERROR_KINDS: ApiErrorKind[] = [
  'timeout', 'rate-limited', 'invalid-input', 'blocked-target', 'unreachable', 'provider', 'network', 'not-found',
];

const DEFAULT_MESSAGES: Record<ApiErrorKind, string> = {
  timeout: 'The data provider did not answer in time. Try again in a moment.',
  'rate-limited': 'Too many requests from your network. Wait a minute and try again.',
  'invalid-input': 'That input does not look valid. Check it and try again.',
  'blocked-target': 'That address is private or reserved, so it cannot be checked from the public internet.',
  unreachable: 'The target did not respond. It may be offline, or it may block automated requests.',
  provider: 'The data provider returned an error. Try again shortly.',
  network: 'Could not reach the data provider. A browser extension or network filter may be blocking the request.',
  'not-found': 'No data was found for that input.',
};

export class ApiError extends Error {
  kind: ApiErrorKind;
  constructor(kind: ApiErrorKind, message?: string) {
    super(message || DEFAULT_MESSAGES[kind]);
    this.name = 'ApiError';
    this.kind = kind;
  }
}

export function describeError(e: unknown): string {
  return e instanceof ApiError ? e.message : DEFAULT_MESSAGES.provider;
}