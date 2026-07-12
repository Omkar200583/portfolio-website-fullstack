/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#050505",
          dark: "#0a0a0f",
          primary: "#00f3ff",
          secondary: "#c084fc",
        },
      },
      fontFamily: {
        display: ["system-ui", "sans-serif"],
      },
      // Custom breakpoints (xs added for small phones, rest are Tailwind defaults
      // restated explicitly so nothing falls back silently if this list changes)
      screens: {
        xs: "400px", // raised from 320px — matches the "stack below 400px" CTA behavior in Hero/About
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      // Fluid typography
      fontSize: {
        "fluid-h1": "clamp(2rem, 5vw, 4.25rem)",
        "fluid-h2": "clamp(1.5rem, 4vw, 3rem)",
        "fluid-h3": "clamp(1.25rem, 3vw, 1.875rem)",
        "fluid-body": "clamp(0.875rem, 1vw, 1rem)",
      },
      // Touch-friendly spacing
      spacing: {
        touch: "2.75rem", // 44px minimum touch target
      },
    },
  },
  plugins: [],
};