const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: {
    fontFamily: {
      figtree: ["Figtree", "sans-serif"],
      raleway: ["Raleway", "sans-serif"],
    },
  },
  safeList: [
    {
      pattern: /bg-\[.+?\]/
    }
  ]
});
