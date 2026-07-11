/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#243b75',
          50: '#f4f6fb',
          100: '#e5eaf5',
          200: '#ccd6eb',
          300: '#a3b7dc',
          400: '#7593c9',
          500: '#243b75',
          600: '#1d2f5e',
          700: '#17254b',
          800: '#101a35',
          900: '#0a1020',
        },
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
          50: '#fff5f5',
          100: '#ffe5e6',
          200: '#f7b9bb',
          300: '#ef8d91',
          400: '#e46167',
          500: '#c7343c',
          600: '#ab2229'
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
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(36, 59, 117, 0.08), 0 1px 3px rgba(36, 59, 117, 0.02)',
        'premium-hover': '0 20px 40px -15px rgba(36, 59, 117, 0.15), 0 1px 8px rgba(36, 59, 117, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 20px rgba(199, 52, 60, 0.25)'
      },
      backgroundImage: {
        'ridge': 'radial-gradient(circle at top, rgba(255,255,255,0.35), rgba(255,255,255,0)), linear-gradient(120deg, #0f2a1f 0%, #274f35 40%, #3f8053 100%)',
        'premium-gradient': 'linear-gradient(135deg, #1e2b55 0%, #243b75 50%, #162042 100%)',
        'soft-gradient': 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        'brand-glow': 'radial-gradient(circle, rgba(36, 59, 117, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'slide-right-fade': 'slideRightFade 0.4s ease-out forwards',
        'slide-left-fade': 'slideLeftFade 0.4s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        slideRightFade: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideLeftFade: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
