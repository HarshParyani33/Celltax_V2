import { useState, useEffect, useCallback } from 'react';

export const PROGRESSION_STORAGE_KEY = 'celltax_investigation_progression_v1';

export const ALL_EXHIBIT_IDS = ['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C'] as const;
export const TOTAL_EXHIBITS = ALL_EXHIBIT_IDS.length; // 3

/**
 * In-memory fallback if localStorage is disabled or unavailable (e.g. private browsing, sandbox)
 */
let inMemoryProgression: string[] = [];

/**
 * Safely reads and validates persisted inspected exhibit IDs from storage.
 * Handles malformed JSON, storage exceptions, and filters to recognized exhibit IDs.
 */
export function loadInspectedIds(): string[] {
  if (typeof window === 'undefined') {
    return inMemoryProgression;
  }

  try {
    const raw = window.localStorage.getItem(PROGRESSION_STORAGE_KEY);
    if (!raw) {
      return inMemoryProgression;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Filter only valid known IDs and deduplicate
    const validIds = Array.from(
      new Set(parsed.filter((id): id is string => typeof id === 'string' && (ALL_EXHIBIT_IDS as readonly string[]).includes(id)))
    );

    inMemoryProgression = validIds;
    return validIds;
  } catch {
    return inMemoryProgression;
  }
}

/**
 * Safely persists inspected exhibit IDs to localStorage with in-memory fallback.
 */
export function saveInspectedIds(ids: string[]): boolean {
  // Deduplicate and filter to known IDs
  const sanitized = Array.from(
    new Set(ids.filter((id) => typeof id === 'string' && (ALL_EXHIBIT_IDS as readonly string[]).includes(id)))
  );

  inMemoryProgression = sanitized;

  if (typeof window === 'undefined') {
    return true;
  }

  try {
    window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(sanitized));
    // Dispatch custom event so other components/tabs can react immediately
    window.dispatchEvent(new CustomEvent('celltax-progression-change', { detail: sanitized }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Records an exhibit as inspected. Avoids duplicates.
 */
export function recordExhibitInspected(id: string): string[] {
  if (!(ALL_EXHIBIT_IDS as readonly string[]).includes(id)) {
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
 */
export function resetProgression(): void {
  inMemoryProgression = [];

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(PROGRESSION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('celltax-progression-change', { detail: [] }));
    } catch {
      // Ignore storage errors
    }
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
 * Calculates progression completion percentage.
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

/**
 * Evaluates active narrative connection tiers based on inspected items.
 */
export function getActiveTimelineConnections(inspectedIds: string[]) {
  const hasA = inspectedIds.includes('ITEM-012-A');
  const hasB = inspectedIds.includes('ITEM-012-B');
  const hasC = inspectedIds.includes('ITEM-012-C');

  return {
    tier1Provenance: hasA,
    tier2Correspondence: hasA && hasB,
    tier3UnifiedSynthesis: hasA && hasB && hasC,
    totalInspected: [hasA, hasB, hasC].filter(Boolean).length,
  };
}

/**
 * React hook to access and synchronize investigation progression across routes and storage events.
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
      if (e.key === PROGRESSION_STORAGE_KEY) {
        setInspectedIds(loadInspectedIds());
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
