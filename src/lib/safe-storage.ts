/** Use this instead of touching localStorage directly. Safe during server render. */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
  remove(key: string): void {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable */
    }
  },
};