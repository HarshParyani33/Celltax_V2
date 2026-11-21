import type { Variants } from 'framer-motion';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Hook to dynamically track prefers-reduced-motion preferences live.
 * Responds immediately if the user toggles their OS or browser accessibility settings.
 */
export const usePrefersReducedMotion = (): boolean => {
  const framerReduced = useFramerReducedMotion();
  const [systemReduced, setSystemReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemReduced(e.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      // Legacy Safari / Older Chromium fallback
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return Boolean(framerReduced || systemReduced);
};

/**
 * Page-level enter and exit transitions.
 * When reduced motion is requested: zero spatial displacement, zero stagger delays, duration 0.01ms.
 */
export const getPageTransition = (reduced: boolean): Variants => ({
  initial: {
    opacity: 0,
    y: reduced ? 0 : 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0.01 : 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: reduced ? 0 : 0.06,
      delayChildren: reduced ? 0 : 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: reduced ? 0 : -10,
    transition: {
      duration: reduced ? 0.01 : 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

/**
 * Classified document reveal transition.
 */
export const getDocumentReveal = (reduced: boolean): Variants => ({
  initial: {
    opacity: 0,
    scale: reduced ? 1 : 0.98,
    y: reduced ? 0 : 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: reduced ? 0.01 : 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

/**
 * Terminal line reveal transition.
 * When reduced motion is preferred, horizontal offset (x) is strictly 0.
 */
export const getTerminalLineReveal = (reduced: boolean): Variants => ({
  initial: {
    opacity: 0,
    x: reduced ? 0 : -8,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: reduced ? 0.01 : 0.22,
      ease: 'easeOut',
    },
  },
});

/**
 * Evidence card hover elevation.
 */
export const getEvidenceCardHover = (reduced: boolean): Variants => ({
  initial: { scale: 1, y: 0 },
  hover: {
    y: reduced ? 0 : -6,
    transition: { duration: reduced ? 0.01 : 0.25, ease: 'easeOut' },
  },
});

// Default static fallback variants for backwards compatibility
export const pageTransition = getPageTransition(false);
export const documentReveal = getDocumentReveal(false);
export const terminalLineReveal = getTerminalLineReveal(false);
export const evidenceCardHover = getEvidenceCardHover(false);
