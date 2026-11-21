/**
 * Focus management utilities for modal dialogs and accessible overlays.
 */

export const FOCUSABLE_SELECTOR = [
  'button:not([disabled]):not([aria-hidden="true"])',
  'a[href]:not([aria-hidden="true"])',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
  'select:not([disabled]):not([aria-hidden="true"])',
  'textarea:not([disabled]):not([aria-hidden="true"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
].join(', ');

/**
 * Checks whether an element is genuinely visible and focusable in the document.
 * Filters out hidden, disabled, collapsed, or display:none elements.
 */
export function isElementFocusable(el: HTMLElement): boolean {
  if (!el || typeof el.getAttribute !== 'function') return false;

  // Check disabled and aria-hidden
  if (el.hasAttribute('disabled')) return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  if (el.hasAttribute('hidden')) return false;

  // Check tabindex
  const tabIndexAttr = el.getAttribute('tabindex');
  if (tabIndexAttr !== null && parseInt(tabIndexAttr, 10) < 0) {
    return false;
  }

  // Check explicit style properties
  if (el.style) {
    if (el.style.display === 'none' || el.style.visibility === 'hidden') {
      return false;
    }
  }

  // In browser environments with layout information:
  if (typeof window !== 'undefined') {
    if (el.offsetParent === null && el.tagName !== 'BODY' && el.style?.position !== 'fixed') {
      if (typeof window.getComputedStyle === 'function') {
        const computed = window.getComputedStyle(el);
        if (computed.display === 'none' || computed.visibility === 'hidden') {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Returns an array of genuinely focusable, visible elements within a container.
 */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container || typeof container.querySelectorAll !== 'function') return [];
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return candidates.filter(isElementFocusable);
}

/**
 * Manages Tab and Shift+Tab wrapping within a modal focus trap.
 */
export function handleTabFocusWrap(
  e: KeyboardEvent | React.KeyboardEvent,
  container: HTMLElement | null
): boolean {
  if (e.key !== 'Tab') return false;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) {
    e.preventDefault();
    container?.focus();
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = typeof document !== 'undefined' ? document.activeElement : null;

  if (e.shiftKey) {
    if (active === first || !container?.contains(active)) {
      e.preventDefault();
      last.focus();
      return true;
    }
  } else {
    if (active === last || !container?.contains(active)) {
      e.preventDefault();
      first.focus();
      return true;
    }
  }

  return false;
}

/**
 * Safely restores focus to a trigger element if it is still attached to the document.
 */
export function restoreFocusSafely(target: HTMLElement | null): boolean {
  if (!target) return false;
  if (typeof document !== 'undefined' && !document.body.contains(target)) return false;
  if (typeof target.focus !== 'function') return false;

  try {
    target.focus();
    return true;
  } catch {
    return false;
  }
}
