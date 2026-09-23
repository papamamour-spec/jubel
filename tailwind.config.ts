import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAFAF7",
        noir: "#1A1A1A",
        or: "#C9A84C",
        "or-text": "#7A6120",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
