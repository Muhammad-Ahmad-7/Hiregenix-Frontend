/** @type {import('tailwindcss').Config} */
const antdColors = {
  blue: {
    1: "#e6f4ff",
    2: "#bae0ff",
    3: "#91caff",
    4: "#69b1ff",
    5: "#4096ff",
    6: "#1677ff",
    7: "#0958d9",
    8: "#003eb3",
    9: "#002c8c",
    10: "#001d66",
  },
  purple: {
    1: "#f9f0ff",
    2: "#efdbff",
    3: "#d3adf7",
    4: "#b37feb",
    5: "#9254de",
    6: "#722ed1",
    7: "#531dab",
    8: "#391085",
    9: "#22075e",
    10: "#120338",
  },
  // ... (add other colors like green, orange, goldenPurple etc.)
  goldenPurple: {
    1: "#fdf4ff",
    2: "#f3e8ff",
    3: "#e9d5ff",
    4: "#d8b4fe",
    5: "#c084fc",
    6: "#a855f7",
    7: "#9333ea",
    8: "#7e22ce",
    9: "#6b21a8",
    10: "#581c87",
  },
};

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: antdColors,
    },
  },
  plugins: [],
};
