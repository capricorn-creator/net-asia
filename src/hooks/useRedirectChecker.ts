import { useCallback } from 'react';
import { checkRedirects } from '../services/redirect';
import { useAsyncLookup } from './useAsyncLookup';

export function useRedirectChecker() {
  const { data, loading, error, run, reset } = useAsyncLookup(checkRedirects);
  const check = useCallback((url: string) => run(url), [run]);
  return { result: data, loading, error, check, reset };
}
