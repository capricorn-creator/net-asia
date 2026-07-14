import { useCallback } from 'react';
import { detectTechnologies } from '../services/tech';
import { useAsyncLookup } from './useAsyncLookup';

export function useTechDetector() {
  const { data, loading, error, run, reset } = useAsyncLookup(detectTechnologies);
  const detect = useCallback((url: string) => run(url), [run]);
  return { result: data, loading, error, detect, reset };
}
