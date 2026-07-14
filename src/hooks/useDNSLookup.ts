import { useCallback } from 'react';
import { lookupDNS } from '../services/dns';
import { useAsyncLookup } from './useAsyncLookup';

/**
 * Hook for the DNS Lookup tool. Manages loading/error state and exposes
 * a `lookup(domain, recordType)` function the page calls on submit.
 */
export function useDNSLookup() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupDNS);

  const lookup = useCallback(
    (domain: string, recordType: string = 'ALL') => run(domain, recordType),
    [run]
  );

  return { results: data, loading, error, lookup, reset };
}
