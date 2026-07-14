import { useCallback } from 'react';
import { lookupWHOIS } from '../services/whois';
import { useAsyncLookup } from './useAsyncLookup';

/**
 * Hook for the WHOIS Lookup tool. Manages loading/error state and
 * exposes a `lookup(domain)` function the page calls on submit.
 */
export function useWHOISLookup() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupWHOIS);

  const lookup = useCallback((domain: string) => run(domain), [run]);

  return { result: data, loading, error, lookup, reset };
}
