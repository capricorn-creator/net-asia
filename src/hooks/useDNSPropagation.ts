import { useCallback } from 'react';
import { checkDNSPropagation } from '../services/propagation';
import { useAsyncLookup } from './useAsyncLookup';

export function useDNSPropagation() {
  const { data, loading, error, run, reset } = useAsyncLookup(checkDNSPropagation);
  const check = useCallback(
    (domain: string, recordType: string = 'A') => run(domain, recordType),
    [run]
  );
  return { result: data, loading, error, check, reset };
}
