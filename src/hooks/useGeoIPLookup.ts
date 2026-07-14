import { useCallback } from 'react';
import { lookupGeoIP } from '../services/geoip';
import { useAsyncLookup } from './useAsyncLookup';

export function useGeoIPLookup() {
  const { data, loading, error, run, reset } = useAsyncLookup(lookupGeoIP);
  const lookup = useCallback((ip: string = '') => run(ip), [run]);
  return { result: data, loading, error, lookup, reset };
}
