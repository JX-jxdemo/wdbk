/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 天空蓝主色
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        // 柔和强调色
        lavender: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
        peach: {
          400: "#fb923c",
          500: "#f97316",
        },
        // 基础底色 - 浅色
        surface: {
          light: "#ffffff",
          soft: "#f8fafc",
          muted: "#f1f5f9",
        },
        // 基础底色 - 深色
        deep: {
          900: "#1e293b",
          800: "#334155",
          700: "#475569",
        },
        // 文本
        text: {
          primary: "#1e293b",
          secondary: "#475569",
          muted: "#94a3b8",
          faint: "#cbd5e1",
        },
        textDark: {
          primary: "#f1f5f9",
          secondary: "#cbd5e1",
          muted: "#94a3b8",
          faint: "#64748b",
        },
      },
      fontFamily: {
        heading: ['"Noto Sans SC"', '"Inter"', "system-ui", "sans-serif"],
        sans: ['"Noto Sans SC"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(14, 165, 233, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 24px rgba(14, 165, 233, 0.1), 0 2px 6px rgba(0, 0, 0, 0.06)",
        "card-dark": "0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15)",
        "card-hover-dark": "0 8px 24px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "float-up": "float-up 0.4s ease-out",
        "bounce-slow": "bounce 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
