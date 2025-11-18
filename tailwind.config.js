/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
      },
      colors: {
        primary: '#2E7D32',   // CropSync green
        accent: '#FFA726',    // Orange accent
        surface: '#F9FAFB',   // Use "surface" instead of "background"
      },
    },
  },
};
