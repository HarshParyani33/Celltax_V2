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
 * Filters out hidden, disabled, collapsed, or display:none elements,
 * including elements whose ancestors are hidden via aria-hidden, hidden, or display/visibility styling.
 */
export function isElementFocusable(el: HTMLElement, container?: HTMLElement | null): boolean {
  if (!el || typeof el.getAttribute !== 'function') return false;

  // 1. Direct attribute checks on element itself
  if (el.hasAttribute('disabled')) return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  if (el.hasAttribute('hidden')) return false;

  // 2. Tabindex check on element itself
  const tabIndexAttr = el.getAttribute('tabindex');
  if (tabIndexAttr !== null && parseInt(tabIndexAttr, 10) < 0) {
    return false;
  }

  // 3. Inline style check on element itself
  if (el.style) {
    if (el.style.display === 'none' || el.style.visibility === 'hidden') {
      return false;
    }
  }

  // 4. Ancestor checks up to container (or document body)
  let ancestor: HTMLElement | null = el.parentElement;
  while (ancestor && ancestor !== container) {
    if (ancestor.getAttribute && ancestor.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (ancestor.hasAttribute && ancestor.hasAttribute('hidden')) {
      return false;
    }
    if (ancestor.style) {
      if (ancestor.style.display === 'none' || ancestor.style.visibility === 'hidden') {
        return false;
      }
    }
    ancestor = ancestor.parentElement;
  }

  // 5. In live browser environments with layout / computed styles:
  if (typeof window !== 'undefined') {
    // Check element layout and computed style
    if (el.offsetParent === null && el.tagName !== 'BODY' && el.style?.position !== 'fixed') {
      if (typeof window.getComputedStyle === 'function') {
        const computed = window.getComputedStyle(el);
        if (computed.display === 'none' || computed.visibility === 'hidden') {
          return false;
        }
      }
    }

    // Check computed styles on ancestors up to container or body
    if (typeof window.getComputedStyle === 'function') {
      let cur: HTMLElement | null = el.parentElement;
      while (cur && cur !== container && cur !== document.body) {
        const comp = window.getComputedStyle(cur);
        if (comp.display === 'none' || comp.visibility === 'hidden') {
          return false;
        }
        cur = cur.parentElement;
      }
    }
  }

  return true;
}

/**
 * Returns an array of genuinely focusable, visible elements within a container.
 * Excludes elements whose ancestors are hidden.
 */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container || typeof container.querySelectorAll !== 'function') return [];
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return candidates.filter((el) => isElementFocusable(el, container));
}

/**
 * Manages Tab and Shift+Tab wrapping within a modal focus trap.
 */
export function handleTabFocusWrap(
  e: KeyboardEvent | React.KeyboardEvent,
  container: HTMLElement | null
): boolean {
  if (e.key !== 'Tab') return false;
  if (e.defaultPrevented) return true;

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
