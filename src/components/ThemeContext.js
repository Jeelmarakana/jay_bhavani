'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check initial attribute or localStorage
    const savedTheme = localStorage.getItem('jay_bhavani_theme');
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.body.setAttribute('data-theme', initialTheme);
    setMounted(true);

    const handleStorage = (e) => {
      if (e.key === 'jay_bhavani_theme' && e.newValue) {
        const updated = e.newValue === 'dark' ? 'dark' : 'light';
        setThemeState(updated);
        document.documentElement.setAttribute('data-theme', updated);
        document.body.setAttribute('data-theme', updated);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = (newTheme) => {
    const validTheme = newTheme === 'dark' ? 'dark' : 'light';
    setThemeState(validTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jay_bhavani_theme', validTheme);
      document.documentElement.setAttribute('data-theme', validTheme);
      document.body.setAttribute('data-theme', validTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
