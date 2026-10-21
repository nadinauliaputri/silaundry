/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0C1622',
          800: '#101E2C',
          700: '#182C3F',
          600: '#233E58',
        },
        teal: {
          primary: '#008A7B',
          hover: '#007366',
          light: '#E6F4F2',
          accent: '#00C4B4',
        },
        surface: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(16, 30, 44, 0.04), 0 1px 3px rgba(16, 30, 44, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(16, 30, 44, 0.08), 0 8px 10px -6px rgba(16, 30, 44, 0.04)',
        'modal': '0 20px 40px -10px rgba(16, 30, 44, 0.25)',
      }
    },
  },
  plugins: [],
}
