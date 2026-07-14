/**
 * Centralized error model for the service layer.
 *
 * Every service normalizes failures into an `AppError` so hooks and UI
 * components never need to know whether a failure came from the network,
 * a timeout, a non-2xx response, or unexpected/malformed data.
 */

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INVALID_RESPONSE'
  | 'INVALID_INPUT'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;
  readonly cause?: unknown;

  constructor(message: string, code: AppErrorCode = 'UNKNOWN', status?: number, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}

/**
 * Maps an HTTP status code to a normalized error code + friendly message.
 */
export function errorFromStatus(status: number, statusText?: string): AppError {
  if (status === 404) {
    return new AppError('The requested resource was not found.', 'NOT_FOUND', status);
  }
  if (status === 429) {
    return new AppError('Too many requests. Please wait a moment and try again.', 'RATE_LIMITED', status);
  }
  if (status >= 500) {
    return new AppError('The remote service is temporarily unavailable. Please try again shortly.', 'NETWORK_ERROR', status);
  }
  if (status >= 400) {
    return new AppError(statusText || 'The request could not be completed.', 'INVALID_RESPONSE', status);
  }
  return new AppError(statusText || 'An unexpected error occurred.', 'UNKNOWN', status);
}

/**
 * Normalizes any thrown value (fetch failures, aborts, parsing errors,
 * or an already-normalized AppError) into a single AppError instance.
 */
export function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof DOMException && err.name === 'AbortError') {
    return new AppError('The request timed out. Please try again.', 'TIMEOUT', undefined, err);
  }

  if (err instanceof TypeError) {
    // fetch() throws TypeError for network-level failures (DNS, CORS, offline, etc.)
    return new AppError('Could not reach the server. Check your connection and try again.', 'NETWORK_ERROR', undefined, err);
  }

  if (err instanceof Error) {
    return new AppError(err.message || 'An unexpected error occurred.', 'UNKNOWN', undefined, err);
  }

  return new AppError('An unexpected error occurred.', 'UNKNOWN', undefined, err);
}
