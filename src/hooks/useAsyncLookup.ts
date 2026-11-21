import { useCallback, useRef, useState } from 'react';
import { AppError, normalizeError } from '../services/http/errors';
import { getAttachedSource, setCurrentSource } from '../lib/source-store';

export interface AsyncLookupState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic state machine for "trigger an async lookup, track loading and
 * normalized error message" — the shared shape behind every tool hook.
 *
 * It also publishes the data source a service attached to its result
 * (see lib/source-store.ts) so ToolPageLayout can show it, and it only
 * does so for the newest request, so a slow stale response cannot win.
 */
export function useAsyncLookup<TArgs extends unknown[], TResult>(
  serviceFn: (...args: TArgs) => Promise<TResult>
) {
  const [state, setState] = useState<AsyncLookupState<TResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const requestId = useRef(0);

  const run = useCallback(
    async (...args: TArgs) => {
      const id = ++requestId.current;
      setCurrentSource(null);
      setState({ data: null, loading: true, error: null });

      try {
        const result = await serviceFn(...args);
        if (requestId.current !== id) return; // stale — a newer request won
        setCurrentSource(getAttachedSource(result));
        setState({ data: result, loading: false, error: null });
      } catch (err) {
        if (requestId.current !== id) return;
        const appError: AppError = normalizeError(err);
        setCurrentSource(null);
        setState({ data: null, loading: false, error: appError.message });
      }
    },
    [serviceFn]
  );

  const reset = useCallback(() => {
    requestId.current++;
    setCurrentSource(null);
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, run, reset };
}