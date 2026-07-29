import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0c0e12",
          red: "#ff3131",
          orange: "#ff5e00",
          cyan: "#00f0ff",
          border: "rgba(59,73,75,0.2)",
          text: "#e2e2e8",
          "text-muted": "#8892a4",
          card: "#111318",
          "card-hover": "#17191e",
        },
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(59,73,75,0.2), 0 4px 24px rgba(0,0,0,0.3)",
        "glass-lg":
          "0 0 0 1px rgba(59,73,75,0.2), 0 8px 40px rgba(0,0,0,0.4)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,240,255,0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0,240,255,0.4)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
