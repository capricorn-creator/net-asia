import { useState, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Always holds the latest value so the setter below can stay referentially
  // stable. An unstable setter makes every effect that depends on it re-run,
  // which caused an infinite render loop on tool pages.
  const valueRef = useRef(storedValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const next = value instanceof Function ? value(valueRef.current) : value;
        if (Object.is(next, valueRef.current)) return; // nothing changed
        valueRef.current = next;
        setStoredValue(next);
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        console.warn(`Failed to save ${key} to localStorage`);
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
}