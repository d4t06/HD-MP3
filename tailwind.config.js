/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {  },

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
        sans: ["Inter", "system-ui"],
        playwriteCU: ["Playwrite CU", "system-ui"],
      },
    },
  },
  safelist: [
    "bg-[#000]/10",
    "bg-[#fff]/10",
    "text-[#000]/10",
    "text-[#fff]/10",
    "hover:bg-[#000]/10",
    "hover:bg-[#fff]/10",
    "border-[#fff]/10",
    "border-[#000]/10",
  ],
  plugins: [],
};
