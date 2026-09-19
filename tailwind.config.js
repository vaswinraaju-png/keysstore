/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#f0f4ff', 100:'#e0e9ff', 500:'#3b5bdb', 600:'#2f4acb', 700:'#1e3a8a', 900:'#0f1f5c' },
        accent: { 400:'#f59e0b', 500:'#d97706' }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] }
    }
  },
  plugins: []
}
