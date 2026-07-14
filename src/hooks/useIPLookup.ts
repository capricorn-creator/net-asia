import { useCallback } from 'react';
import { lookupIP } from '../services/ip';
import { useAsyncLookup } from './useAsyncLookup';

/**
 * Hook for the IP Lookup tool. Manages loading/error state and exposes
 * a `lookup(ip)` function the page calls on submit. Pass an empty string
 * to look up the caller's own IP.
 */
export function useIPLookup() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupIP);

  const lookup = useCallback((ip: string = '') => run(ip), [run]);

  return { result: data, loading, error, lookup, reset };
}
