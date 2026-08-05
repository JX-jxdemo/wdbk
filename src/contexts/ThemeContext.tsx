import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const KEY = "neon_blog_theme";

// 亮色变量覆盖
const LIGHT_VARS: Record<string, string> = {
  "--color-bg": "#f5f6fa",
  "--color-surface": "#ffffff",
  "--color-surface-2": "#eef0f5",
  "--color-border": "rgba(0, 140, 200, 0.18)",
  "--color-border-hover": "rgba(0, 140, 200, 0.45)",
  "--neon-cyan": "#0088cc",
  "--neon-magenta": "#d9306a",
  "--neon-purple": "#6d28d9",
  "--neon-green": "#1f9d44",
  "--text-primary": "#1a1a28",
  "--text-muted": "#4b5563",
  "--text-faint": "#6b7280",
};

const DARK_VARS: Record<string, string> = {
  "--color-bg": "#0a0a0f",
  "--color-surface": "#0f0f17",
  "--color-surface-2": "#14141f",
  "--color-border": "rgba(0, 240, 255, 0.15)",
  "--color-border-hover": "rgba(0, 240, 255, 0.4)",
  "--neon-cyan": "#00f0ff",
  "--neon-magenta": "#ff006e",
  "--neon-purple": "#7c3aed",
  "--neon-green": "#39ff14",
  "--text-primary": "#e4e4e7",
  "--text-muted": "#a1a1aa",
  "--text-faint": "#71717a",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(KEY) as Theme | null;
    return saved || "dark";
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
