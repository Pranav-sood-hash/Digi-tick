/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nature-Inspired Flat Palette
        nature: {
          primary: '#2E8B57', // Primary Green (SeaGreen)
          forest: '#1B5E3B',  // Forest Green (Headings & Brand)
          fresh: '#69B578',   // Fresh Green (Secondary Highlights)
          mint: '#E8F5EC',    // Soft Mint (Background Highlights)
          white: '#FFFFFF',   // Pure White
          offwhite: '#F7FAF7',// Secondary Backgrounds
          border: '#E5EAE6',  // Borders and Dividers
          text: '#24352B',    // Primary Typography
          muted: '#718078',   // Secondary Typography
        },
        darknature: {
          bg: '#111A14',        // Main Dark Background
          sidebar: '#19251D',   // Dark Sidebar & Secondary
          card: '#202E24',      // Cards & Panels
          primary: '#69B578',   // Primary Actions
          highlight: '#8CCF9B', // Active Highlights
          mint: '#263D2E',      // Subtle Green Backgrounds
          text: '#F1F7F2',      // Primary Typography
          muted: '#A4B3A8',     // Muted Typography
          border: '#304136',    // Dividers and Borders
        },
        brand: {
          50: '#E8F5EC',
          100: '#D1EBD9',
          200: '#A3D7B3',
          300: '#8CCF9B',
          400: '#69B578',
          500: '#2E8B57', // Primary Green
          600: '#267347',
          700: '#1E5C38',
          800: '#1B5E3B', // Forest Green
          900: '#14442B',
          950: '#0C2A1A',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'none': 'none',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'flat': '0 1px 1px 0 rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}
