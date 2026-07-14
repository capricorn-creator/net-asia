import { useCallback } from 'react';
import { lookupHeaders } from '../services/headers';
import { useAsyncLookup } from './useAsyncLookup';

/**
 * Hook for the HTTP Headers Checker tool. Manages loading/error state
 * and exposes a `check(url)` function the page calls on submit.
 */
export function useHeadersLookup() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupHeaders);

  const check = useCallback((url: string) => run(url), [run]);

  return { result: data, loading, error, check, reset };
}
