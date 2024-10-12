/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // or 'media' if preferred
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        serenade: {
          50: "#fef7ee",
          100: "#fef1e1",
          200: "#fbd5ad",
          300: "#f9b778",
          400: "#f58f42",
          500: "#f2701d",
          600: "#e35613",
          700: "#bc4012",
          800: "#963316",
          900: "#792d15",
          950: "#411409",
        },
        "bay-leaf": {
          50: "#f5f8f6",
          100: "#dee9e2",
          200: "#bcd3c3",
          300: "#88ad96",
          400: "#6d947d",
          500: "#527a62",
          600: "#40614f",
          700: "#364f41",
          800: "#2e4137",
          900: "#293830",
          950: "#141f19",
        },
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
