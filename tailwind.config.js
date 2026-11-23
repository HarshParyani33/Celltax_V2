/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gift: {
          cream: '#fdfbf7',
          ivory: '#faf6f0',
          parchment: '#f7f2ea',
          linen: '#f4ede2',
          blush: '#fceeeb',
          blushDark: '#f4dada',
          rose: '#d99b9b',
          roseDeep: '#9c5460',
          terracotta: '#8c5e58',
          espresso: '#38261e',
          warmBrown: '#5c3d2e',
          sage: '#9caf88',
          sageLight: '#eef3ea',
          sageDark: '#4f614b',
          burgundy: '#722f37',
          gold: '#c5a059',
          goldLight: '#dfbf7a',
          goldPale: '#f5edd6',
        },
        investigation: {
          base: '#faf6f0',        // Warm ivory-cream background
          forest: '#f5eee4',      // Soft warm paper tint
          surface: '#ffffff',     // Clean gift stationery surface
          card: '#fdfaf5',        // Creamy card
          border: '#e8dcce',      // Soft paper deckle border
          borderDim: '#f0e6dc',   // Very subtle paper border
          text: '#38261e',        // Rich espresso readable body
          muted: '#7a685c',       // Warm sepia muted text
          highlight: '#d99b9b',   // Dusty rose accent
        },
        charcoal: {
          900: '#1e1410',
          800: '#2a1d17',
          700: '#38261e',
          600: '#4a3429',
        },
        brass: {
          DEFAULT: '#c5a059',
          light: '#dfbf7a',
          dark: '#8e7137',
          dim: '#5c4820',
        },
        parchment: {
          DEFAULT: '#38261e',     // In headings, renders as warm espresso
          aged: '#4a3528',
          dim: '#6b5444',
          border: '#baa77e',
          ink: '#1d1a16',
        },
        museum: {
          base: '#faf6f0',
          charcoal: '#38261e',
          surface: '#ffffff',
          card: '#fbf8f4',
          gold: '#c5a059',
          champagne: '#e6d7ba',
          ivory: '#f8f5ee',
          border: '#e2d5c5',
        },
        confidential: {
          red: '#9c5460',         // Soft vintage rose/burgundy instead of harsh red
          crimson: '#881b1b',
          stamp: '#9c5460',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', '"Cinzel"', 'serif'],
        editorial: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        handwriting: ['"Caveat"', '"Marck Script"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        mono: ['"Courier Prime"', '"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'gift': '0 10px 30px -5px rgba(92, 61, 46, 0.08), 0 0 0 1px rgba(197, 160, 89, 0.15)',
        'polaroid': '0 10px 25px -4px rgba(60, 40, 30, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'envelope': '0 16px 36px -6px rgba(92, 61, 46, 0.15), 0 0 0 1px rgba(197, 160, 89, 0.25)',
        'brass': '0 0 25px -5px rgba(197, 160, 89, 0.25)',
        'brass-sm': '0 0 10px -2px rgba(197, 160, 89, 0.2)',
        'spotlight': '0 20px 45px rgba(60, 40, 30, 0.12), 0 0 30px rgba(197, 160, 89, 0.1)',
        'dossier': '0 20px 40px -10px rgba(92, 61, 46, 0.15), 0 0 0 1px rgba(197, 160, 89, 0.2)',
        'inner-dark': 'inset 0 2px 10px rgba(60, 40, 30, 0.05)',
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
