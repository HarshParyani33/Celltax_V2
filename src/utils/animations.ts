import { Variants } from 'framer-motion';

// Respect reduced motion
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : -10,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const documentReveal: Variants = {
  initial: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0.96,
    y: prefersReducedMotion ? 0 : 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const terminalLineReveal: Variants = {
  initial: { opacity: 0, x: -8 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: prefersReducedMotion ? 0.01 : 0.25, ease: 'easeOut' }
  },
};

export const evidenceCardHover: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    y: prefersReducedMotion ? 0 : -6,
    transition: { duration: 0.25, ease: 'easeOut' }
  },
};
