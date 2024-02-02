/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./*.{html,js}",
    "./index.html",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    fontFamily: {
      'mainFont': ['Dekko', 'cursive']
    },
    extend: {
      backdropBrightness: {
        30: '.40',
      },
      backgroundImage: {
        bgImg: "url('/assets/pokemartLogo.png')"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}