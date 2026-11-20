// Museum Phase Design Tokens (Prepared for Future Architecture)
export const MUSEUM_TOKENS = {
  colors: {
    base: '#0a0b0d',
    charcoal: '#121417',
    surface: '#1b1f24',
    card: '#22272e',
    border: '#2d333b',
    gold: '#d4af37',
    goldLight: '#e6c86e',
    champagne: '#e6d7ba',
    ivory: '#f8f5ee',
    textMuted: '#8b949e',
    spotlightWarm: 'rgba(230, 215, 186, 0.12)',
  },
  typography: {
    display: '"Cinzel", serif',
    curatorial: '"Cormorant Garamond", serif',
    editorial: '"Inter", sans-serif',
  },
  lighting: {
    spotlight: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
    pedestalGlow: '0 25px 50px -12px rgba(212, 175, 55, 0.2)',
  }
} as const;
