import { useCallback } from 'react';
import { lookupReverseDNS } from '../services/rdns';
import { useAsyncLookup } from './useAsyncLookup';

export function useReverseDNS() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupReverseDNS);
  const lookup = useCallback((ip: string) => run(ip), [run]);
  return { result: data, loading, error, lookup, reset };
}
