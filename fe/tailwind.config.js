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
      fontFamily: {
        lexend: '"Lexend", sans-serif',
      },
      animation: {
        "snow-fall": "snow-fall 10s linear infinite",
      },
      keyframes: {
        "snow-fall": {
          "0%": {
            transform: "translateY(0) translateX(0)", // Vị trí ban đầu
          },
          "100%": {
            transform: "translateY(100vh) translateX(100vw)", // Vị trí cuối cùng
          },
        },
      },
    },
  },
  darkMode: false, // or 'media' or 'class'

  variants: {
    extend: {
      opacity: ["responsive", "hover", "focus", "active"],
      transform: ["responsive", "hover", "focus"],
    },
  },
  plugins: [],
};
