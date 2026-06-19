import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563EB", 700: "#1d4ed8",
          800: "#1E3A8A", 900: "#1e3a8a", 950: "#172554",
        },
        accent: {
          50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
          400: "#fbbf24", 500: "#F59E0B", 600: "#d97706", 700: "#b45309",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(30, 58, 138, 0.08)",
        "card-hover": "0 8px 32px -4px rgba(30, 58, 138, 0.15)",
        float: "0 12px 40px -8px rgba(30, 58, 138, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;