import { useCallback } from 'react';
import { lookupSSL } from '../services/ssl';
import { useAsyncLookup } from './useAsyncLookup';

/**
 * Hook for the SSL Certificate Checker tool. Manages loading/error state
 * and exposes a `check(domain)` function the page calls on submit.
 */
export function useSSLChecker() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupSSL);

  const check = useCallback((domain: string) => run(domain), [run]);

  return { result: data, loading, error, check, reset };
}
