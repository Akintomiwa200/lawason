"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyTheme,
  getStoredOrDefaultTheme,
  getSystemTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  subscribeSystemTheme,
} from "@/lib/theme";
import type { ResolvedTheme, ThemeContextValue, ThemeMode } from "@/types/theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

function readInitialTheme(defaultTheme: ThemeMode): ThemeMode {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  return getStoredOrDefaultTheme(defaultTheme);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    readInitialTheme(defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme(),
  );

  const resolvedTheme = useMemo(
    () => resolveTheme(theme, systemTheme),
    [theme, systemTheme],
  );

  useLayoutEffect(() => {
    const syncTheme = () => {
      const mode = readStoredTheme() ?? defaultTheme;
      const nextSystemTheme = getSystemTheme();
      const nextResolvedTheme = resolveTheme(mode, nextSystemTheme);

      setThemeState(mode);
      setSystemTheme(nextSystemTheme);
      applyTheme(nextResolvedTheme);
    };

    syncTheme();

    return subscribeSystemTheme(syncTheme);
  }, [defaultTheme]);

  useLayoutEffect(() => {
    applyTheme(resolvedTheme);
    storeTheme(theme);
  }, [resolvedTheme, theme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentResolved = resolveTheme(current, getSystemTheme());
      return currentResolved === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }

  return context;
}
