// Investigation Phase Design Tokens
export const INVESTIGATION_TOKENS = {
  colors: {
    base: '#070d0a',
    forest: '#0c1611',
    surface: '#122019',
    card: '#162820',
    border: '#213a2e',
    borderDim: '#15251e',
    text: '#c9d6cf',
    textMuted: '#71877c',
    brass: '#c5a059',
    brassLight: '#dfbf7a',
    brassDark: '#8e7137',
    parchment: '#f4ebd8',
    parchmentInk: '#1d1a16',
    confidentialRed: '#991b1b',
  },
  typography: {
    header: '"Cinzel", serif',
    archive: '"Courier Prime", monospace',
    document: '"Cormorant Garamond", serif',
    body: '"Inter", sans-serif',
  },
  spacing: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    sectionGap: 'py-12 sm:py-20',
  },
  shadows: {
    evidenceCard: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 1px 1px rgba(197,160,89,0.15)',
    dossierHover: '0 30px 60px -10px rgba(0,0,0,0.9), 0 0 25px rgba(197,160,89,0.25)',
  }
} as const;
