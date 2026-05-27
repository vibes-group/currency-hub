import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type ThemeContextValue = {
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const storageKey = "currency-hub-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return getSystemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (localStorage.getItem(storageKey)) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setResolvedTheme(getSystemTheme());

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    setResolvedTheme(theme);
  }, []);

  const value = useMemo(
    () => ({
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
