/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0c0c0e",
        surface: "#141418",
        "surface-hover": "#1a1a20",
        border: "#2a2a32",
        text: "#e8e8ed",
        muted: "#888894",
        accent: "#6b8afd",
        "accent-hover": "#5578f5",
        success: "#34c759",
        warning: "#f5a623",
        danger: "#ff453a",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(255, 255, 255, 0.04)",
      },
    },
  },
  plugins: [],
};
