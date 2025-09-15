/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "10px",
    },
    extend: {
      // keyframes: {
      //   scrollText: {
      //     "0%": { transform: "translate(0)" },
      //     "100%": { transform: "translate(3deg)" },
      //   },
      //   fadeIn: {
      //     "0%": { opacity: "0", transform: "translateY(15px)" },
      //     "100%": { opacity: "1", transform: "translateY(0)" },
      //   },
      // },
      // colors: {},
      fontFamily: {
        sans: ["Comfortaa", "system-ui"],
      },
      screens: {
        "semi-lg": "896px",
      },
    },
  },
};
