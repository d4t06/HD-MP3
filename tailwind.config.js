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
    "bg-[#000]/5",
    "bg-[#fff]/5",
    "text-[#000]/5",
    "text-[#fff]/5",
    "hover:bg-[#000]/5",
    "hover:bg-[#fff]/5",
    "border-[#fff]/5",
    "border-[#000]/5",
  ],
  plugins: [],
};
