import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef5f2',
          100: '#fde9e2',
          200: '#fad7c9',
          300: '#f6bea4',
          400: '#f09b73',
          500: '#e65d2a',
          600: '#d7471f',
          700: '#b33b18',
          800: '#92311a',
          900: '#762c18',
        },
      },
    },
  },
  plugins: [],
};

export default config;