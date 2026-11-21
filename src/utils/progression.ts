import { useState, useEffect, useCallback } from 'react';

export const PROGRESSION_STORAGE_KEY = 'celltax_investigation_progression_v1';

export const ALL_EXHIBIT_IDS = ['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C'] as const;
export const TOTAL_EXHIBITS = ALL_EXHIBIT_IDS.length; // 3

/**
 * In-memory fallback if localStorage is disabled, inaccessible, or throws (e.g. strict private browsing)
 */
let inMemoryProgression: string[] = [];

/**
 * Tests whether localStorage is genuinely available and accessible.
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const testKey = '__celltax_storage_probe__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pure sanitizer: parses and filters a raw JSON string into a deduplicated list of valid exhibit IDs.
 * Returns empty array if raw is null, empty, malformed, or contains no valid IDs.
 */
export function sanitizeExhibitIds(raw: string | null | undefined): string[] {
  if (!raw || typeof raw !== 'string') {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter to known valid IDs and deduplicate
    return Array.from(
      new Set(
        parsed.filter((id): id is string =>
          typeof id === 'string' && (ALL_EXHIBIT_IDS as readonly string[]).includes(id)
        )
      )
    );
  } catch {
    return [];
  }
}

/**
 * Safely reads and validates persisted inspected exhibit IDs from storage.
 * - If storage is available and key is unset (null), returns [] and syncs in-memory state to [].
 * - If storage is available and data exists, parses and deduplicates valid IDs.
 * - If storage throws or is genuinely unavailable, returns inMemoryProgression.
 */
export function loadInspectedIds(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return inMemoryProgression;
  }

  try {
    const raw = window.localStorage.getItem(PROGRESSION_STORAGE_KEY);
    // When raw is null, the key was removed or never set. Storage IS available, so progression is 0.
    if (raw === null) {
      inMemoryProgression = [];
      return [];
    }

    const validIds = sanitizeExhibitIds(raw);
    inMemoryProgression = validIds;
    return validIds;
  } catch {
    // If storage is blocked/throws, use the in-memory fallback
    return inMemoryProgression;
  }
}

/**
 * Safely persists inspected exhibit IDs to localStorage with in-memory fallback.
 * Dispatches a custom event so other components in the same window update reactively.
 */
export function saveInspectedIds(ids: string[]): boolean {
  const sanitized = Array.from(
    new Set(ids.filter((id) => typeof id === 'string' && (ALL_EXHIBIT_IDS as readonly string[]).includes(id)))
  );

  inMemoryProgression = sanitized;

  if (typeof window === 'undefined' || !window.localStorage) {
    return true;
  }

  try {
    window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent('celltax-progression-change', { detail: sanitized }));
    return true;
  } catch {
    // Fallback updated even if disk write fails
    return false;
  }
}

/**
 * Records an exhibit as inspected. Idempotent and duplicate-preventing.
 */
export function recordExhibitInspected(id: string): string[] {
  if (!(ALL_EXHIBIT_IDS as readonly string[]).includes(id as any)) {
    return loadInspectedIds();
  }

  const current = loadInspectedIds();
  if (current.includes(id)) {
    return current;
  }

  const updated = [...current, id];
  saveInspectedIds(updated);
  return updated;
}

/**
 * Resets investigation progression back to zero.
 * Idempotent: safe to invoke repeatedly.
 */
export function resetProgression(): void {
  inMemoryProgression = [];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(PROGRESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('celltax-progression-change', { detail: [] }));
  }
}

/**
 * Determines whether the Master Gallery should unlock.
 * Strictly requires all 3 exhibits to be inspected.
 */
export function isGalleryUnlocked(inspectedIds: string[]): boolean {
  if (!Array.isArray(inspectedIds)) return false;
  return ALL_EXHIBIT_IDS.every((id) => inspectedIds.includes(id));
}

/**
 * Calculates progression completion percentage (0 - 100).
 */
export function calculateProgressionPercentage(inspectedIds: string[]): number {
  if (!Array.isArray(inspectedIds)) return 0;
  const count = ALL_EXHIBIT_IDS.filter((id) => inspectedIds.includes(id)).length;
  return Math.round((count / TOTAL_EXHIBITS) * 100);
}

/**
 * Returns the IDs of exhibits that have not yet been inspected.
 */
export function getRemainingExhibitIds(inspectedIds: string[]): string[] {
  if (!Array.isArray(inspectedIds)) return Array.from(ALL_EXHIBIT_IDS);
  return ALL_EXHIBIT_IDS.filter((id) => !inspectedIds.includes(id));
}

export interface TimelineConnections {
  tier1Provenance: boolean;
  tier2Correspondence: boolean;
  tier3UnifiedSynthesis: boolean;
  totalInspected: number;
  link1Active: boolean;
  link2Active: boolean;
  link3Active: boolean;
}

/**
 * Evaluates active narrative connection tiers based on sequential discovery rules:
 * - Link 1 / Tier 1 (Temporal Alignment): Activates after inspecting the first relevant exhibit (ITEM-012-A: Coastal Observatory).
 * - Link 2 / Tier 2 (Provenance Correlation): Activates sequentially after inspecting both the first and second exhibits (ITEM-012-A and ITEM-012-B: Dispatch Folio).
 * - Link 3 / Tier 3 (Unified Synthesis / Convergence): Activates only after all three exhibits (ITEM-012-A, ITEM-012-B, and ITEM-012-C) are inspected.
 */
export function getActiveTimelineConnections(inspectedIds: string[]): TimelineConnections {
  if (!Array.isArray(inspectedIds)) {
    return {
      tier1Provenance: false,
      tier2Correspondence: false,
      tier3UnifiedSynthesis: false,
      totalInspected: 0,
      link1Active: false,
      link2Active: false,
      link3Active: false,
    };
  }

  const hasA = inspectedIds.includes('ITEM-012-A');
  const hasB = inspectedIds.includes('ITEM-012-B');
  const hasC = inspectedIds.includes('ITEM-012-C');

  const tier1 = hasA;
  const tier2 = hasA && hasB;
  const tier3 = hasA && hasB && hasC;
  const total = [hasA, hasB, hasC].filter(Boolean).length;

  return {
    tier1Provenance: tier1,
    tier2Correspondence: tier2,
    tier3UnifiedSynthesis: tier3,
    totalInspected: total,
    link1Active: tier1,
    link2Active: tier2,
    link3Active: tier3,
  };
}

/**
 * React hook to access and synchronize investigation progression across routes and browser storage events.
 * Handles cross-tab synchronization cleanly:
 * - Updates to zero when another tab resets progression (StorageEvent.newValue === null or localStorage.clear()).
 * - Syncs when another tab inspects an exhibit.
 * - Dispatches and listens to custom events for immediate single-tab reactivity.
 */
export function useProgression() {
  const [inspectedIds, setInspectedIds] = useState<string[]>(() => loadInspectedIds());

  useEffect(() => {
    // Sync on mount
    setInspectedIds(loadInspectedIds());

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setInspectedIds(customEvent.detail);
      } else {
        setInspectedIds(loadInspectedIds());
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      // StorageEvent fires in other tabs/windows when localStorage changes.
      // e.key === null indicates localStorage.clear() was called.
      // e.key === PROGRESSION_STORAGE_KEY indicates our key was modified or removed.
      if (e.key === PROGRESSION_STORAGE_KEY || e.key === null) {
        if (e.newValue === null) {
          // Another tab removed the key or cleared storage: reset current tab to 0 immediately!
          inMemoryProgression = [];
          setInspectedIds([]);
        } else {
          // Another tab updated the stored progression: sanitize and apply
          const sanitized = sanitizeExhibitIds(e.newValue);
          inMemoryProgression = sanitized;
          setInspectedIds(sanitized);
        }
      }
    };

    window.addEventListener('celltax-progression-change', handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('celltax-progression-change', handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const markInspected = useCallback((id: string) => {
    const updated = recordExhibitInspected(id);
    setInspectedIds(updated);
  }, []);

  const reset = useCallback(() => {
    resetProgression();
    setInspectedIds([]);
  }, []);

  const isUnlocked = isGalleryUnlocked(inspectedIds);
  const percentage = calculateProgressionPercentage(inspectedIds);
  const remainingIds = getRemainingExhibitIds(inspectedIds);
  const connections = getActiveTimelineConnections(inspectedIds);

  return {
    inspectedIds,
    markInspected,
    reset,
    isUnlocked,
    percentage,
    remainingIds,
    connections,
    hasInspected: (id: string) => inspectedIds.includes(id),
    totalExhibits: TOTAL_EXHIBITS,
  };
}
