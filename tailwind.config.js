/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vsdark: {
          500: "#1e1e1e",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
