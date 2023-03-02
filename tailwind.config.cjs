/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightGreen: "#00e3b4",
        sub: "#9aa2aa",
        bc: "#a6adbb",
      },
    },
  },

  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};

module.exports = config;
