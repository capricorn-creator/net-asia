import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { safeStorage } from '../lib/safe-storage';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true,
});

const KEY = 'net-asia-theme';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server and first client render both start as 'dark' so hydration matches.
  // The inline script in index.html has already put the right class on <html>.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    safeStorage.set(KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);