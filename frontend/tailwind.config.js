/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./projects/**/*.{html,ts}",
    "./src/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f97316', // Orange theme color from your meta tag
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}