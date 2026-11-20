/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        investigation: {
          base: '#070d0a',
          forest: '#0c1611',
          surface: '#122019',
          card: '#162820',
          border: '#213a2e',
          borderDim: '#15251e',
          text: '#c9d6cf',
          muted: '#71877c',
          highlight: '#2f5442',
        },
        charcoal: {
          900: '#0b0e11',
          800: '#11151a',
          700: '#181e24',
          600: '#222a32',
        },
        brass: {
          DEFAULT: '#c5a059',
          light: '#dfbf7a',
          dark: '#8e7137',
          dim: '#5c4820',
        },
        parchment: {
          DEFAULT: '#f4ebd8',
          aged: '#e8dcbe',
          dim: '#d2c29d',
          border: '#baa77e',
          ink: '#1d1a16',
        },
        museum: {
          base: '#0a0b0d',
          charcoal: '#121417',
          surface: '#1b1f24',
          card: '#22272e',
          gold: '#d4af37',
          champagne: '#e6d7ba',
          ivory: '#f8f5ee',
          border: '#2d333b',
        },
        confidential: {
          red: '#a82424',
          crimson: '#881b1b',
          stamp: '#991b1b',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        mono: ['"Courier Prime"', '"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'brass': '0 0 25px -5px rgba(197, 160, 89, 0.25)',
        'brass-sm': '0 0 10px -2px rgba(197, 160, 89, 0.2)',
        'spotlight': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(197, 160, 89, 0.08)',
        'dossier': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(197, 160, 89, 0.15)',
        'inner-dark': 'inset 0 2px 10px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 35%, rgba(4, 7, 5, 0.9) 100%)',
        'terminal-scanline': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
        'brass-gradient': 'linear-gradient(135deg, #dfbf7a 0%, #c5a059 50%, #8e7137 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
