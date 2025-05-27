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
        darkblue: "#1a5276", 
        creme: "#bdb5b0",
        burntorange: "#ba4a00", 
      },
    },
  },
  plugins: [],
} satisfies Config;
