import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightColors, darkColors, ThemeColors } from './colors';

interface ThemeContextType {
  darkMode: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Simple toggle function
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  
  const colors = darkMode ? darkColors : lightColors;
  
  return (
    <ThemeContext.Provider value={{ darkMode, colors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
