import type { MemoryItem, GalleryCollection, MemoryCategory } from '../types/memory';
import type { EvidenceItem } from '../types/index';

/**
 * PHASE 3: PLACEHOLDER CONTENT ARCHITECTURE
 * 
 * NOTE ON PRIVACY & CONTENT INJECTION:
 * This repository is public. Real personal photographs, private messages, real family names,
 * and intimate personal dates must NEVER be committed to tracked repository files.
 * 
 * For development, this file provides structural placeholders and adapter functions.
 * In a private deployment, content is injected using the private content injection strategy
 * documented in docs/private-content-strategy.md.
 */

export const PLACEHOLDER_MEMORIES: MemoryItem[] = [
  {
    id: 'MEM-1978-01',
    title: 'The Solitary Horizon',
    shortDescription: 'First sighting of the coastal observation tower at twilight.',
    fullNarrative: 'A quiet vigil over the ocean fog. The beacon pierced the darkness at dusk, marking the beginning of an extraordinary journey.',
    date: '1978-06-21',
    displayDate: 'Summer Solstice 1978',
    isApproximateDate: false,
    location: 'Sector 7 Coastal Bluff',
    image: '/images/evidence-photograph.jpg',
    webpImage: '/images/evidence-photograph.webp',
    thumbnail: '/images/evidence-photograph.webp',
    category: 'voyage' as MemoryCategory,
    timelinePosition: 1978,
    caption: 'Gelatin silver print plate from the archival tower.',
    personalNote: 'Where the horizon bends inward; the origin of all that followed.',
    displayOrder: 1,
    visibility: 'revealed',
    tags: ['observatory', 'beacon', 'maritime', 'origin'],
    evidenceIdRef: 'ITEM-012-A',
  },
  {
    id: 'MEM-1978-02',
    title: 'The Solstice Twilight Log',
    shortDescription: 'Companion astronomical reading recorded during the same 1978 solstice.',
    fullNarrative: 'Parallel celestial coordinates logged in the maritime register, confirming alignment with the primary tower telescope.',
    date: '1978-06-21',
    displayDate: 'Summer Solstice 1978 (Late Evening)',
    isApproximateDate: false,
    location: 'Sector 7 Coastal Bluff',
    image: '/images/evidence-photograph.jpg',
    webpImage: '/images/evidence-photograph.webp',
    thumbnail: '/images/evidence-photograph.webp',
    category: 'curiosity' as MemoryCategory,
    timelinePosition: 1978,
    caption: 'Companion celestial reading on the same calendar evening.',
    personalNote: 'Two milestones intertwined on the longest evening of the year.',
    displayOrder: 2,
    visibility: 'revealed',
    tags: ['astronomy', 'twilight', 'chronology'],
    evidenceIdRef: 'ITEM-012-A',
  },
  {
    id: 'MEM-1988-01',
    title: 'The Courier Dispatch',
    shortDescription: 'Hand-penned dispatch folio preserved in archival iron gall ink.',
    fullNarrative: 'Preserved inside a sealed brass container. Words of guidance and celebration penned with deliberate care and sealed with Department red wax.',
    date: '1988-10-14',
    displayDate: 'Circa Autumn 1988',
    isApproximateDate: true,
    approximatePeriod: 'Late 1980s Era',
    location: 'Sub-level Vault Annex 4',
    image: '/images/evidence-dispatch.jpg',
    webpImage: '/images/evidence-dispatch.webp',
    thumbnail: '/images/evidence-dispatch.webp',
    category: 'relic' as MemoryCategory,
    timelinePosition: 1988,
    caption: 'Weathered flax parchment with official wax imprint.',
    personalNote: 'A testament written for an extraordinary individual.',
    displayOrder: 1,
    visibility: 'revealed',
    tags: ['folio', 'parchment', 'cipher', 'anniversary'],
    evidenceIdRef: 'ITEM-012-B',
  },
  {
    id: 'MEM-PRESENT-01',
    title: 'The Astrolithic Mechanism',
    shortDescription: 'Precision brass instrument measuring concentric milestones.',
    fullNarrative: 'Engine-turned brass dial featuring three nested celestial rings that align to celebrate a lifetime of extraordinary moments.',
    date: '2026-10-14',
    displayDate: 'Present Era (Milestone Convergence)',
    isApproximateDate: false,
    location: 'Private Curatorial Chamber B',
    image: '/images/evidence-artefact.jpg',
    webpImage: '/images/evidence-artefact.webp',
    thumbnail: '/images/evidence-artefact.webp',
    category: 'milestone' as MemoryCategory,
    timelinePosition: 2026,
    caption: 'Concentric brass astrolithic dial with obsidian optic.',
    personalNote: 'All coordinates, years, and memories culminate in this milestone.',
    displayOrder: 1,
    visibility: 'revealed',
    tags: ['brass', 'mechanism', 'astrolithic', 'celebration'],
    evidenceIdRef: 'ITEM-012-C',
  },
];

/**
 * Placeholder curatorial gallery photo collections
 */
export const PLACEHOLDER_GALLERY_COLLECTIONS: GalleryCollection[] = [
  {
    id: 'COLLECTION-OBSERVATION',
    title: 'Archive I: The Observational Vanguard',
    description: 'Archival photographs capturing visual vantage points and horizons.',
    curatorialEra: '1970s — Coastal Formations',
    photos: [
      {
        id: 'PHOTO-01',
        title: 'Coastal Observatory (Monochrome Plate)',
        caption: 'The solitary observation post at Sector 7 Coastal Bluff.',
        date: '1978',
        imageUrl: '/images/evidence-photograph.jpg',
        webpUrl: '/images/evidence-photograph.webp',
        thumbnailUrl: '/images/evidence-photograph.webp',
        collectionId: 'COLLECTION-OBSERVATION',
        aspectRatio: 'landscape',
        curatorialNote: 'Silver gelatin emulsion on rag paper.',
      },
    ],
  },
  {
    id: 'COLLECTION-DISPATCH',
    title: 'Archive II: Epistolary Folios',
    description: 'Documentary testaments, decrypted records, and penned memories.',
    curatorialEra: '1980s — The Written Word',
    photos: [
      {
        id: 'PHOTO-02',
        title: 'Cipher Dispatch (Wax Insignia)',
        caption: 'The sealed folio in iron gall ink with astronomical imprint.',
        date: '1988',
        imageUrl: '/images/evidence-dispatch.jpg',
        webpUrl: '/images/evidence-dispatch.webp',
        thumbnailUrl: '/images/evidence-dispatch.webp',
        collectionId: 'COLLECTION-DISPATCH',
        aspectRatio: 'portrait',
        curatorialNote: 'Deckled flax parchment with archival seal.',
      },
    ],
  },
  {
    id: 'COLLECTION-MECHANICS',
    title: 'Archive III: Astrolithic Instruments',
    description: 'Mechanical and horological instruments calculating celebratory alignments.',
    curatorialEra: 'Present Era — Convergence',
    photos: [
      {
        id: 'PHOTO-03',
        title: 'Astrolithic Dial (Engine-Turned Brass)',
        caption: 'Concentric astronomical rings calibrated to milestone coordinates.',
        date: 'Present Era',
        imageUrl: '/images/evidence-artefact.jpg',
        webpUrl: '/images/evidence-artefact.webp',
        thumbnailUrl: '/images/evidence-artefact.webp',
        collectionId: 'COLLECTION-MECHANICS',
        aspectRatio: 'square',
        curatorialNote: 'Triple concentric rings in copper-zinc brass.',
      },
    ],
  },
];

/**
 * Adapts an EvidenceItem from Phase 1 into a structured MemoryItem.
 */
export function evidenceToMemoryItem(item: EvidenceItem, timelinePosition = 2000): MemoryItem {
  let category: MemoryCategory = 'curiosity';
  if (item.type === 'photograph') category = 'voyage';
  if (item.type === 'document') category = 'relic';
  if (item.type === 'artefact') category = 'milestone';

  return {
    id: `MEM-${item.id}`,
    title: item.title,
    shortDescription: item.summary,
    fullNarrative: item.forensicNotes.join(' '),
    date: item.dateDiscovered,
    displayDate: item.dateDiscovered,
    isApproximateDate: item.dateDiscovered.toLowerCase().includes('circa'),
    location: item.origin,
    image: item.imageUrl,
    webpImage: item.webpUrl,
    thumbnail: item.webpUrl || item.imageUrl,
    category,
    timelinePosition,
    caption: `${item.code} // ${item.classification}`,
    personalNote: item.anomalies[0] || undefined,
    displayOrder: 1,
    visibility: 'revealed',
    tags: [item.type, item.classification],
    evidenceIdRef: item.id,
  };
}

/**
 * Sorts memories chronologically by timelinePosition and displayOrder.
 */
export function sortMemoriesChronologically(memories: MemoryItem[]): MemoryItem[] {
  return [...memories].sort((a, b) => {
    if (a.timelinePosition !== b.timelinePosition) {
      return a.timelinePosition - b.timelinePosition;
    }
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.displayOrder - b.displayOrder;
  });
}

/**
 * Groups memories by their timeline era or year position.
 */
export function groupMemoriesByPeriod(memories: MemoryItem[]): Record<string, MemoryItem[]> {
  const sorted = sortMemoriesChronologically(memories);
  const groups: Record<string, MemoryItem[]> = {};

  for (const memory of sorted) {
    const key = memory.approximatePeriod || String(memory.timelinePosition);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(memory);
  }

  return groups;
}

/**
 * Retrieves memory representations associated with a specific exhibit ID.
 */
export function getMemoriesForExhibit(exhibitId: string): MemoryItem[] {
  return PLACEHOLDER_MEMORIES.filter((m) => m.evidenceIdRef === exhibitId);
}
