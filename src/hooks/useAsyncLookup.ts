import { useCallback, useRef, useState } from 'react';
import { AppError, normalizeError } from '../services/http/errors';

export interface AsyncLookupState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic state machine for "trigger an async lookup, track loading and
 * normalized error message" — the shared shape behind every tool hook
 * (useIPLookup, useDNSLookup, useSSLChecker, useWHOISLookup, useHeadersLookup).
 *
 * Each tool hook wraps this with its own service call and input handling;
 * this hook owns only the generic state machine plus stale-response
 * protection (so a slow earlier request can't overwrite a newer result).
 */
export function useAsyncLookup<TArgs extends unknown[], TResult>(
  serviceFn: (...args: TArgs) => Promise<TResult>
) {
  const [state, setState] = useState<AsyncLookupState<TResult>>({
    data: null,
    loading: false,
    error: null,
  });

  // Tracks the most recently issued request so we can ignore the result
  // of a stale in-flight call if a newer one was started first.
  const requestId = useRef(0);

  const run = useCallback(
    async (...args: TArgs) => {
      const id = ++requestId.current;
      setState({ data: null, loading: true, error: null });

      try {
        const result = await serviceFn(...args);
        if (requestId.current !== id) return; // stale — a newer request won
        setState({ data: result, loading: false, error: null });
      } catch (err) {
        if (requestId.current !== id) return;
        const appError: AppError = normalizeError(err);
        setState({ data: null, loading: false, error: appError.message });
      }
    },
    [serviceFn]
  );

  const reset = useCallback(() => {
    requestId.current++;
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, run, reset };
}
