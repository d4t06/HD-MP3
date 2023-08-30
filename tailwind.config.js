/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'scrollText' : {
          '0%': { transform: 'translate(0)' },
          '100%': { transform: 'translate(3deg)' },
        }
      },
      colors: {
      }
    },
  },
  safelist: [
    'bg-[#000]/[.1]',
    'bg-[#fff]/[.1]',
    'hover:bg-[#000]/[.1]',
    'hover:bg-[#fff]/[.1]',
    'border-[#fff]/[.1]',
    'border-[#000]/[.1]'
  ],
  plugins: [],
}