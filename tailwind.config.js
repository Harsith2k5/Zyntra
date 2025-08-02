/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'neon-mint': '#16FFBD',
        'solar-amber': '#FCEE09',
        'neon-rose': '#FF6EC7',
        'dark-bg': '#0B0B0B',
        'dark-surface': '#151515',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
      },
      keyframes: {
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(22, 255, 189, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(22, 255, 189, 0.6)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'xl': '40px',
      },
    },
  },
  plugins: [],
};