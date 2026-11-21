/**
 * Core Type Definitions for Phase 3: Personal Memory Foundation
 * 
 * Provides structured schemas for chronological memories, milestone events,
 * and curatorial photograph collections while keeping existing evidence models intact.
 */

export type MemoryCategory = 'milestone' | 'voyage' | 'curiosity' | 'relic' | 'personal' | 'celebration';

export type MemoryVisibility = 'sealed' | 'revealed' | 'archived';

export interface MemoryItem {
  /** Unique identifier for the memory (e.g. 'MEM-1978-01', 'ITEM-012-A') */
  id: string;
  /** Memory title */
  title: string;
  /** Short summary / brief description */
  shortDescription: string;
  /** Full narrative exploration or memory recollection */
  fullNarrative: string;
  /** Exact or normalized date (ISO string or YYYY-MM-DD) */
  date: string;
  /** Human-readable display date (e.g. "Summer 1978", "October 14, 1988") */
  displayDate?: string;
  /** True if the exact date is unknown or represents an approximate era */
  isApproximateDate?: boolean;
  /** Optional approximate period descriptor (e.g. "Late 1970s", "Early Autumn") */
  approximatePeriod?: string;
  /** Geographic or contextual location */
  location?: string;
  /** Primary image asset URL */
  image: string;
  /** Optional alternate image asset URL (e.g. reverse side or high-res scan) */
  alternateImage?: string;
  /** WebP optimized image URL */
  webpImage?: string;
  /** Small thumbnail preview URL */
  thumbnail?: string;
  /** Curatorial category classification */
  category: MemoryCategory;
  /** Numeric position or year index for chronological timeline sorting */
  timelinePosition: number;
  /** Optional photo or exhibit caption */
  caption?: string;
  /** Optional private or personal reflection note */
  personalNote?: string;
  /** Explicit display order within the same timeline position or era */
  displayOrder: number;
  /** Visibility state governing locked/unlocked rendering */
  visibility: MemoryVisibility;
  /** Optional tags for filtering */
  tags?: string[];
  /** Optional cross-reference to an evidence catalog ID (e.g. 'ITEM-012-A') */
  evidenceIdRef?: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  caption?: string;
  date?: string;
  imageUrl: string;
  webpUrl?: string;
  thumbnailUrl?: string;
  collectionId: string;
  curatorialNote?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface GalleryCollection {
  id: string;
  title: string;
  description: string;
  curatorialEra?: string;
  photos: GalleryPhotoItem[];
}
