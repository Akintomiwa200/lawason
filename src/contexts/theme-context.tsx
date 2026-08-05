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

interface ThemeState {
  theme: ThemeMode;
  systemTheme: ResolvedTheme;
}

function bootstrapTheme(defaultTheme: ThemeMode): ThemeState {
  if (typeof window === "undefined") {
    return { theme: defaultTheme, systemTheme: "light" };
  }

  const theme = getStoredOrDefaultTheme(defaultTheme);
  const systemTheme = getSystemTheme();
  applyTheme(resolveTheme(theme, systemTheme));

  return { theme, systemTheme };
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [state, setState] = useState<ThemeState>(() =>
    bootstrapTheme(defaultTheme),
  );

  const resolvedTheme = useMemo(
    () => resolveTheme(state.theme, state.systemTheme),
    [state.theme, state.systemTheme],
  );

  useLayoutEffect(() => {
    const syncTheme = () => {
      const mode = readStoredTheme() ?? defaultTheme;
      const nextSystemTheme = getSystemTheme();
      const nextResolvedTheme = resolveTheme(mode, nextSystemTheme);

      setState({ theme: mode, systemTheme: nextSystemTheme });
      applyTheme(nextResolvedTheme);
    };

    syncTheme();

    return subscribeSystemTheme(syncTheme);
  }, [defaultTheme]);

  useLayoutEffect(() => {
    applyTheme(resolvedTheme);
    storeTheme(state.theme);
  }, [resolvedTheme, state.theme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setState((current) => ({ ...current, theme: nextTheme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((current) => {
      const currentResolved = resolveTheme(current.theme, current.systemTheme);
      return {
        ...current,
        theme: currentResolved === "dark" ? "light" : "dark",
      };
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: state.theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [state.theme, resolvedTheme, setTheme, toggleTheme],
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
