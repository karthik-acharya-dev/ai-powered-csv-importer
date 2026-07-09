import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        groweasy: {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
        },
      },
    },
  },
  plugins: [],
};
export default config;
