/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#eef2ff',
          100: '#d9e1ff',
          200: '#b4c4ff',
          300: '#8fa6ff',
          400: '#6989ff',
          500: '#426bff',
          600: '#324fc7',
          700: '#263b94',
          800: '#1e2b55',
          900: '#162042'
        },
        sunrise: {
          100: '#ffe5e6',
          200: '#f7b9bb',
          300: '#ef8d91',
          400: '#e46167',
          500: '#c7343c'
        },
        stoneblue: {
          100: '#eef3ff',
          200: '#d4e0ff',
          300: '#b1c4ff',
          400: '#8aa4ff',
          500: '#5d7bff'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'ridge': 'radial-gradient(circle at top, rgba(255,255,255,0.35), rgba(255,255,255,0)), linear-gradient(120deg, #0f2a1f 0%, #274f35 40%, #3f8053 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
