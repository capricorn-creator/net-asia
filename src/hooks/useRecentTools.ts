import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const KEY = 'netasia-recent-tools';
const MAX_RECENT = 6;

export function useRecentTools() {
  const [recent, setRecent] = useLocalStorage<string[]>(KEY, []);

  const addRecent = useCallback(
    (id: string) => {
      setRecent(prev => {
        const filtered = prev.filter(r => r !== id);
        return [id, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setRecent]
  );

  const clearRecent = useCallback(() => setRecent([]), [setRecent]);

  return { recent, addRecent, clearRecent };
}
