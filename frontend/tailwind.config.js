/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"VT323"', 'monospace'], 
        'brand': ['"Syne"', 'sans-serif'], // New Branding Font
        // If you have "The Last Trunks", change 'Syne' to 'The Last Trunks' here
      },
      colors: {
        'graphite': '#262626',
        'paper': '#FAFAFA',
        'soft-grey': '#E5E5E5',
      },
      boxShadow: {
        'soft': '4px 4px 0px 0px #262626',
        'soft-hover': '6px 6px 0px 0px #262626',
        'soft-sm': '2px 2px 0px 0px #262626',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}