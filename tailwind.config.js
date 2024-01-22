/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,css} ",
    "./views/list.ejs",
    "./views/history.ejs"
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
}