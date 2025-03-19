/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "radial-gradient(71.52% 71.52% at 50% 100%, #58F8FE 0%, #FFF 100%)",
      },
    },
  },
  plugins: [],
};
