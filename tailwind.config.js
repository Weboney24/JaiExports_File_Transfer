/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffaa0d",
        secondary:"#29354c",
        light_yellow: "#ffaa0d"
      },
      fontFamily:{
        "Texturina" :["Arial","sans-serif"],
        "Poppins" :["Arial","sans-serif"],
        "Oswald" :["Arial","sans-serif"],
      }
    },
  },
  plugins: [],
};
