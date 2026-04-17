/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfbf7",
          100: "#f8f3e8",
          200: "#f1e7d1",
          300: "#e7d6b0",
          400: "#dcc38f",
          500: "#d1b06e",
          600: "#b89252",
          700: "#8f6f3f",
          800: "#66502d",
          900: "#3d301b",
        },
        gold: {
          50: "#fdfaf3",
          100: "#f9f0db",
          200: "#f2dcac",
          300: "#e8c46d",
          400: "#dc9f32",
          500: "#c78520",
          600: "#a06818",
          700: "#7d4e14",
          800: "#5e3a0f",
          900: "#42280a",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};