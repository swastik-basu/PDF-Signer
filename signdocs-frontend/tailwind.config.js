/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef2f1",
          100: "#fde6e3",
          200: "#fbcec8",
          300: "#f6a89c",
          400: "#ef7a68",
          500: "#e74c3c",
          600: "#d33a2c",
          700: "#b02e22",
          800: "#8f271e",
          900: "#76241d",
        },
        ink: {
          50: "#f8f9fc",
          100: "#edf2f7",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#374151",
          800: "#1e293b",
          900: "#1a1a2e",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(16, 24, 40, 0.06)",
        floating: "0 10px 40px rgba(16, 24, 40, 0.12)",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "slide-in": "slide-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
