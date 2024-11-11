/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,tsx,jsx,html}"],
  theme: {
    extend: {
      colors: {
        blackL: "#131118",
        hrBlack: "#eaeaeb",
      },
      backgroundImage: {
        bannerL: "url('./src/assets/images/Homepage/banner1.png')",
        Logninimge: "url('./src/assets/images/lognin/banner.png')",
        notfound: "url('../assets/images/notfound/image 25.svg')",
      },
    },
  },
  plugins: [],
};
