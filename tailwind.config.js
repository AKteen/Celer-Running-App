/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: ['bg-brand', 'text-brand', 'border-brand', 'bg-dark'],
  theme: {
    extend: {
      colors: {
        brand: '#FFD600',
        dark: '#0a0a0a',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
