/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        card: "0 4px 2px rgba(0, 0, 0, 0.25)",
        button: "0 1.5px 1px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        primary: "#426b1f",
      },
      screens: {
        xs: "475px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        newsreader: ["Newsreader", "serif"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
