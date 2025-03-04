import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: "#1a5276", // Darker blue background
        creme: "#bdb5b0",    // Creme text color
        burntorange: "#ba4a00", // Burnt orange for borders/buttons
      },
    },
  },
  plugins: [],
} satisfies Config;
