export const themeStorageKey = "currency-hub-theme";

export const themeModes = ["system", "light", "dark"] as const;

export type ThemeMode = (typeof themeModes)[number];

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function resolveThemeMode(
  mode: ThemeMode,
  systemPrefersDark: boolean
): "light" | "dark" {
  if (mode === "system") {
    return systemPrefersDark ? "dark" : "light";
  }

  return mode;
}
