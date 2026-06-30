import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const KEY = 'netasia-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(KEY, []);

  const toggle = useCallback(
    (id: string) => {
      setFavorites(prev =>
        prev.includes(id) ? prev.filter(f => f !== id) : [id, ...prev]
      );
    },
    [setFavorites]
  );

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
