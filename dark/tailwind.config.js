/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './core/templates/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#F59E0B',
          600: '#D97706',
          50: '#FFF7ED',
          100: '#FEE6B8',
        },
        white: '#FFFFFF',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}