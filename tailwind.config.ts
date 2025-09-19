import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e65d2a',
          50: '#fef8f3',
          100: '#feeee2',
          200: '#fcdac4',
          300: '#f9bf9b',
          400: '#f5996f',
          500: '#f07c4e',
          600: '#e65d2a',
          700: '#d1451e',
          800: '#a8391c',
          900: '#86321b',
        },
      },
    },
  },
  plugins: [],
}
export default config