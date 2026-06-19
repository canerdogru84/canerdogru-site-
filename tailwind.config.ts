import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBFBFD",
        surface: "#F3F5F9",
        "surface-2": "#ECEFF5",
        ink: "#0B1B3A",
        "ink-soft": "#3A465F",
        muted: "#6B7280",
        line: "#E5E8EF",
        "line-strong": "#D4D9E4",
        signal: "#0D6EFD",
        "signal-ink": "#0A4FBF",
        copper: "#C2784F",
      },
      fontFamily: {
        display: ['"Poppins"', "system-ui", "sans-serif"],
        sans: ['"Poppins"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.08em",
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,27,58,0.04), 0 12px 32px -16px rgba(11,27,58,0.18)",
        lift: "0 2px 4px rgba(11,27,58,0.05), 0 24px 48px -20px rgba(11,27,58,0.28)",
      },
      keyframes: {
        "signal-travel": {
          "0%": { transform: "translateX(-30%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(130%)", opacity: "0" },
        },
      },
      animation: {
        "signal-travel": "signal-travel 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
