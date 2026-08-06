import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from '../config/muiTheme';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('theme_preference') || 'dark');

  const getEffectiveMode = () => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  };

  const [effectiveMode, setEffectiveMode] = useState(getEffectiveMode);

  useEffect(() => {
    const computed = getEffectiveMode();
    setEffectiveMode(computed);
    localStorage.setItem('theme_preference', themeMode);

    const root = document.documentElement;
    if (computed === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const muiTheme = getMuiTheme(effectiveMode);

  return (
    <ThemeContext.Provider value={{ mode: effectiveMode, themePreference: themeMode, setThemeMode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeContext;
