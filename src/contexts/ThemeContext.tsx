import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const KEY = "anime_blog_theme";

const LIGHT_VARS: Record<string, string> = {
  "--color-bg": "#f0f9ff",
  "--color-surface": "#ffffff",
  "--color-surface-2": "#f8fafc",
  "--color-border": "rgba(14, 165, 233, 0.12)",
  "--color-border-hover": "rgba(14, 165, 233, 0.25)",
  "--color-primary": "#0ea5e9",
  "--color-primary-hover": "#0284c7",
  "--color-primary-light": "#e0f2fe",
  "--text-primary": "#1e293b",
  "--text-secondary": "#475569",
  "--text-muted": "#94a3b8",
  "--text-faint": "#cbd5e1",
};

const DARK_VARS: Record<string, string> = {
  "--color-bg": "#1e293b",
  "--color-surface": "#334155",
  "--color-surface-2": "#475569",
  "--color-border": "rgba(148, 163, 184, 0.15)",
  "--color-border-hover": "rgba(148, 163, 184, 0.3)",
  "--color-primary": "#38bdf8",
  "--color-primary-hover": "#0ea5e9",
  "--color-primary-light": "#1e40af",
  "--text-primary": "#f1f5f9",
  "--text-secondary": "#cbd5e1",
  "--text-muted": "#94a3b8",
  "--text-faint": "#64748b",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(KEY) as Theme | null;
    return saved || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const vars = theme === "light" ? LIGHT_VARS : DARK_VARS;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
        setTheme: setThemeState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
