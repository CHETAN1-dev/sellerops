/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  extend: {
  colors: {
    bg: {
      light: "#F9FAFB",
      dark: "#0B0F19",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      inverse: "#FFFFFF",
    },
    brand: {
      primary: "#6D28D9",
      secondary: "#9333EA",
      accent: "#22D3EE",
    },
  },
}
,
  },
  plugins: [],
};
