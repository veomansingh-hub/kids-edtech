/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kid: ["Fredoka", "Quicksand", "sans-serif"],
        body: ["Outfit", "sans-serif"],
      },
      colors: {
        primary: {
          pink: "hsl(345, 100%, 68%)",
          blue: "hsl(198, 100%, 60%)",
          yellow: "hsl(48, 100%, 58%)",
          purple: "hsl(268, 85%, 64%)",
          green: "hsl(142, 72%, 55%)",
          orange: "hsl(24, 100%, 60%)",
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
}
