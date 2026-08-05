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
        // 基础底色
        base: {
          900: "#0a0a0f",
          800: "#0f0f17",
          700: "#14141f",
          600: "#1a1a28",
        },
        // 霓虹强调色
        neon: {
          cyan: "#00f0ff",
          magenta: "#ff006e",
          purple: "#7c3aed",
          green: "#39ff14",
          amber: "#ffb800",
        },
        // 文本
        ink: {
          DEFAULT: "#e4e4e7",
          muted: "#a1a1aa",
          faint: "#71717a",
        },
      },
      fontFamily: {
        display: ['"Orbitron"', "system-ui", "sans-serif"],
        heading: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        sans: ['"Noto Sans SC"', '"Space Grotesk"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.35), 0 0 40px rgba(0, 240, 255, 0.15)",
        "neon-magenta": "0 0 20px rgba(255, 0, 110, 0.35), 0 0 40px rgba(255, 0, 110, 0.15)",
        "neon-purple": "0 0 20px rgba(124, 58, 237, 0.35), 0 0 40px rgba(124, 58, 237, 0.15)",
        glass: "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "grid-cyan":
          "linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)",
        "scanline":
          "repeating-linear-gradient(0deg, rgba(0,240,255,0.04) 0px, rgba(0,240,255,0.04) 1px, transparent 1px, transparent 3px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "gradient-shift": "gradient-shift 12s ease infinite",
        "scan": "scan 8s linear infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.3)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
