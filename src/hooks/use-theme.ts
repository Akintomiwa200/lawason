"use client";

import { useThemeContext } from "@/contexts/theme-context";
import type { ThemeMode } from "@/types/theme";

export function useTheme() {
  return useThemeContext();
}

export function useThemeMode(): ThemeMode {
  return useThemeContext().theme;
}

export function useResolvedTheme() {
  return useThemeContext().resolvedTheme;
}
