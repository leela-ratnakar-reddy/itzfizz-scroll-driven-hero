import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090a",
        foreground: "#ededed",
      },
      fontFamily: {
        sans: ["var(--font-orbitron)", "Orbitron", "system-ui", "sans-serif"],
        mono: ["var(--font-orbitron)", "Orbitron", "monospace"],
        orbitron: ["var(--font-orbitron)", "Orbitron", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
