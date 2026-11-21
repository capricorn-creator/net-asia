import type { DataSourceInfo } from './api';

const attached = new WeakMap<object, DataSourceInfo>();
const listeners = new Set<() => void>();
let current: DataSourceInfo | null = null;

/** Services call this on their result so the hook can publish the source once the response is known to be current. */
export function attachSource<T extends object>(value: T, source: DataSourceInfo): T {
  attached.set(value, source);
  return value;
}

export function getAttachedSource(value: unknown): DataSourceInfo | null {
  return value && typeof value === 'object' ? attached.get(value) ?? null : null;
}

export function setCurrentSource(next: DataSourceInfo | null): void {
  if (next === current) return;
  current = next;
  listeners.forEach(l => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSnapshot = (): DataSourceInfo | null => current;
/** Always null so the server render and first client render match. */
export const getServerSnapshot = (): DataSourceInfo | null => null;