import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "calm-night";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component that manages the 3-theme system (Bright, Dark, Calm Night)
 * Persists theme preference to localStorage and applies CSS classes to document root
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatventure-theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  /**
   * Apply theme by updating document classes and localStorage
   */
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'calm-night');
    
    // Add new theme class (light is default, so we only add dark/calm-night)
    if (newTheme !== 'light') {
      root.classList.add(newTheme);
    }
    
    // Save to localStorage
    localStorage.setItem('chatventure-theme', newTheme);
  };

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  /**
   * Cycle through themes: light → dark → calm-night → light
   */
  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'calm-night'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  // Prevent flash of wrong theme by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * Usage: const { theme, setTheme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
