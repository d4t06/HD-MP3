/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "10px",
    },
    extend: {
      keyframes: {
        scrollText: {
          "0%": { transform: "translate(0)" },
          "100%": { transform: "translate(3deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {},
      fontFamily: {
        sans: ["Nunito", "system-ui"],
        playwriteCU: ["Playwrite CU", "system-ui"],
      },
    },
  },
  safelist: [
    "bg-[#000]/[.1]",
    "bg-[#fff]/[.1]",
    "text-[#000]/[.1]",
    "text-[#fff]/[.1]",
    "hover:bg-[#000]/[.1]",
    "hover:bg-[#fff]/[.1]",
    "border-[#fff]/[.1]",
    "border-[#000]/[.1]",
  ],
  plugins: [],
};
