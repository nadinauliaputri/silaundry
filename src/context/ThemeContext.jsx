import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEME_KEYS = ['silaundry_theme', 'theme'];

export const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;

  for (const key of THEME_KEYS) {
    const saved = localStorage.getItem(key);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  }

  if (document.documentElement.classList.contains('dark')) return true;

  // Cek preferensi sistem jika belum pernah disimpan pengguna
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Terapkan class `dark` ke document.documentElement dan simpan ke localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      THEME_KEYS.forEach(key => localStorage.setItem(key, 'dark'));
    } else {
      root.classList.remove('dark');
      THEME_KEYS.forEach(key => localStorage.setItem(key, 'light'));
    }
  }, [isDarkMode]);

  // Sinkronisasi real-time antar tab browser via event storage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (THEME_KEYS.includes(e.key)) {
        setIsDarkMode(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      isDarkMode: isDark,
      toggleDarkMode: () => {
        const next = !isDark;
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('dark');
            THEME_KEYS.forEach(key => localStorage.setItem(key, 'dark'));
          } else {
            document.documentElement.classList.remove('dark');
            THEME_KEYS.forEach(key => localStorage.setItem(key, 'light'));
          }
        }
      },
      setIsDarkMode: () => {}
    };
  }
  return context;
}

