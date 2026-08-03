import type { ResolvedTheme, ThemeMode } from "@/types/theme";

export const THEME_STORAGE_KEY = "gmlawason-theme";

export const themeModes: ThemeMode[] = ["light", "dark", "system"];

export function resolveTheme(
  theme: ThemeMode,
  systemTheme: ResolvedTheme = getSystemTheme(),
): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

export function readStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "system") {
    return "system";
  }

  // Legacy fixed themes — always follow the browser/OS preference instead.
  if (stored === "light" || stored === "dark") {
    localStorage.setItem(THEME_STORAGE_KEY, "system");
    return "system";
  }

  return null;
}

export function storeTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getStoredOrDefaultTheme(defaultTheme: ThemeMode = "system"): ThemeMode {
  return readStoredTheme() ?? defaultTheme;
}

export function applyStoredTheme(defaultTheme: ThemeMode = "system") {
  const theme = getStoredOrDefaultTheme(defaultTheme);
  applyTheme(resolveTheme(theme, getSystemTheme()));
}

export function subscribeSystemTheme(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

export function subscribeThemeStorage(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener("storage", handler);

  return () => window.removeEventListener("storage", handler);
}
