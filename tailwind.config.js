/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          950: "#09090b",
          900: "#0c0e14",
          850: "#141721",
          800: "#18181b",
          700: "#27272a",
          primary: "#2563eb",
          accent: "#3b82f6",
          gold: "#d4af37",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "infinite-scroll": "infiniteScroll 35s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        infiniteScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

