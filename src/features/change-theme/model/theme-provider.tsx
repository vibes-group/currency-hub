"use client";

import * as React from "react";

import {
  isThemeMode,
  resolveThemeMode,
  type ThemeMode,
  themeStorageKey,
} from "./theme";

type ResolvedThemeMode = "light" | "dark";

type ThemeSnapshot = `${ThemeMode}:${ResolvedThemeMode}`;

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const themeChangeEvent = "currency-hub-theme-change";
const serverSnapshot: ThemeSnapshot = "system:light";

function getSystemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getStoredMode(): ThemeMode {
  try {
    const storedMode = window.localStorage.getItem(themeStorageKey);
    return isThemeMode(storedMode) ? storedMode : "system";
  } catch {
    return "system";
  }
}

function getThemeSnapshot(): ThemeSnapshot {
  const mode = getStoredMode();
  const resolvedMode = resolveThemeMode(mode, getSystemPrefersDark());

  return `${mode}:${resolvedMode}`;
}

function subscribeToThemeStore(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function applyThemeClass(resolvedMode: ResolvedThemeMode) {
  document.documentElement.classList.toggle("dark", resolvedMode === "dark");
  document.documentElement.style.colorScheme = resolvedMode;
}

function parseThemeSnapshot(snapshot: ThemeSnapshot) {
  const [mode, resolvedMode] = snapshot.split(":") as [
    ThemeMode,
    ResolvedThemeMode,
  ];

  return { mode, resolvedMode };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = React.useSyncExternalStore(
    subscribeToThemeStore,
    getThemeSnapshot,
    () => serverSnapshot
  );
  const { mode, resolvedMode } = parseThemeSnapshot(snapshot);

  React.useEffect(() => {
    applyThemeClass(resolvedMode);
  }, [resolvedMode]);

  const setMode = React.useCallback((nextMode: ThemeMode) => {
    try {
      window.localStorage.setItem(themeStorageKey, nextMode);
    } catch {
      // Theme switching can still update the current document if storage is blocked.
    }

    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
