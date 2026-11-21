import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Sparkles, 
  Layers, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EvidenceModal } from '../components/EvidenceModal';
import { EVIDENCE_COLLECTION } from '../data/evidence';
import { EvidenceItem } from '../types';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';

const FILTER_OPTIONS = [
  { id: 'all', label: 'ALL EXHIBITS', count: 3 },
  { id: 'photograph', label: 'PHOTOGRAPHS', count: 1 },
  { id: 'document', label: 'DISPATCHES', count: 1 },
  { id: 'artefact', label: 'ARTEFACTS', count: 1 }
] as const;

export const EvidenceArchive: React.FC = () => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'photograph' | 'document' | 'artefact'>('all');
  const [inspectedIds, setInspectedIds] = useState<Set<string>>(new Set());

  const filteredItems = EVIDENCE_COLLECTION.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const handleInspect = (item: EvidenceItem) => {
    soundFx.playInspect();
    setSelectedItem(item);
    setInspectedIds((prev) => new Set([...prev, item.id]));
  };

  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="archive" />

      {/* Main Evidence Room Space */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Top Header & Archive Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-investigation-border/60">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-investigation-muted mb-2 tracking-wider">
              <span>VAULT 4</span>
              <span>•</span>
              <span className="text-brass">CONFIDENTIAL EVIDENCE REPOSITORY</span>
              <span>•</span>
              <span>CASE 012</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-parchment tracking-wide">
              THE EVIDENCE ARCHIVE
            </h1>
            <p className="text-sm font-sans text-investigation-muted max-w-2xl mt-1 leading-relaxed">
              Examine the catalogued exhibits recovered from the primary site. Each object holds forensic anomalies that point toward a deeper, unified origin.
            </p>
          </div>

          {/* Progress / Catalog Counter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-4 py-2.5 rounded bg-investigation-forest border border-brass/30 font-mono text-xs text-brass-light flex items-center space-x-2">
              <Layers className="w-4 h-4 text-brass" />
              <span>EXHIBITS INSPECTED: {inspectedIds.size} / {EVIDENCE_COLLECTION.length}</span>
            </div>

            <div className="px-3 py-2 rounded bg-investigation-surface border border-investigation-border text-xs font-mono text-investigation-muted flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-brass" />
              <span>SECURITY LEVEL 3</span>
            </div>
          </div>
        </div>

        {/* Accessible Filter Button Group */}
        <div
          role="group"
          aria-label="Filter evidence exhibits by category"
          className="flex flex-wrap items-center justify-between gap-4 my-6"
        >
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {FILTER_OPTIONS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    soundFx.playKeypress();
                    setActiveFilter(filter.id);
                  }}
                  className={`
                    px-3.5 py-1.5 rounded text-xs font-mono tracking-wider transition-all border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brass
                    ${isSelected
                      ? 'bg-brass text-charcoal-900 border-brass font-bold shadow-brass-sm'
                      : 'bg-investigation-surface hover:bg-investigation-card text-investigation-muted hover:text-parchment border-investigation-border'}
                  `}
                >
                  <span>{filter.label} ({filter.count})</span>
                </button>
              );
            })}
          </div>

          <div
            className="text-xs font-mono text-investigation-muted flex items-center space-x-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>SHOWING {filteredItems.length} OF {EVIDENCE_COLLECTION.length} EXHIBITS</span>
          </div>
        </div>

        {/* Evidence Exhibits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            const hasInspected = inspectedIds.has(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className="group relative flex flex-col rounded-lg bg-investigation-surface border border-investigation-border hover:border-brass/70 shadow-evidenceCard hover:shadow-spotlight transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                onClick={() => handleInspect(item)}
                tabIndex={0}
                role="button"
                aria-label={`Inspect evidence item ${item.code}: ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInspect(item);
                  }
                }}
              >
                {/* Top Identification Header */}
                <div className="px-4 py-2.5 bg-investigation-card border-b border-investigation-border flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-brass" />
                    <span className="font-bold text-brass-light tracking-widest">{item.code}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-investigation-muted px-2 py-0.5 rounded bg-investigation-forest border border-investigation-border">
                    {item.type}
                  </span>
                </div>

                {/* Exhibit Visual Canvas / Frame with Picture element */}
                <div className="relative aspect-[4/3] w-full bg-charcoal-900 overflow-hidden border-b border-investigation-border">
                  <picture className="w-full h-full">
                    {item.webpUrl && (
                      <source srcSet={item.webpUrl} type="image/webp" />
                    )}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </picture>

                  {/* Archival Overlay Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-investigation-surface/90 via-transparent to-black/30 pointer-events-none" />

                  {/* Stamp Badge */}
                  <div className="absolute top-2.5 right-2.5 pointer-events-none">
                    <span className="stamp-confidential text-[9px] px-1.5 py-0.5">
                      CLASSIFIED
                    </span>
                  </div>

                  {/* Inspect CTA Hover Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="px-4 py-2 rounded-full bg-brass text-charcoal-900 font-mono text-xs font-bold tracking-widest flex items-center space-x-2 shadow-brass">
                      <Eye className="w-4 h-4" />
                      <span>INSPECT ARTEFACT</span>
                    </div>
                  </div>

                  {/* Inspected Marker */}
                  {hasInspected && (
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-investigation-forest/90 border border-brass/40 text-brass flex items-center space-x-1">
                      <span>✓ INSPECTED</span>
                    </div>
                  )}
                </div>

                {/* Card Information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-parchment group-hover:text-brass-light transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-sans text-investigation-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="pt-3 border-t border-investigation-border/40 space-y-1.5 text-[11px] font-mono text-investigation-muted">
                    <div className="flex justify-between">
                      <span>ORIGIN:</span>
                      <span className="text-investigation-text truncate max-w-[170px]">{item.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DISCOVERED:</span>
                      <span className="text-investigation-text">{item.dateDiscovered}</span>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-brass group-hover:text-brass-light">
                    <span className="flex items-center space-x-1">
                      <span>OPEN FORENSIC LEDGER</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] text-investigation-muted">{item.id}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Museum Phase Forward Architecture Preview Note */}
        <div className="mt-16 p-6 sm:p-8 rounded-lg border border-brass/30 bg-investigation-forest/50 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-brass uppercase">
                <Sparkles className="w-4 h-4 text-brass" />
                <span>CURATORIAL ARCHITECTURE // PHASE 2 PREPARED</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-parchment">
                The Master Gallery Transformation
              </h4>
              <p className="text-xs font-sans text-investigation-muted max-w-2xl leading-relaxed">
                As additional evidence is authenticated and the common timeline resolved, 
                the Department vault will reveal the private museum dedicated to this extraordinary life.
              </p>
            </div>

            <div className="px-4 py-2 rounded border border-investigation-border bg-investigation-surface text-xs font-mono text-investigation-muted">
              CURATORIAL ENGINE READY
            </div>
          </div>
        </div>

      </main>

      <Footer />

      {/* Visual Inspection Modal Overlay with Proper AnimatePresence Exit Lifecycle */}
      <AnimatePresence>
        {selectedItem && (
          <EvidenceModal
            key={selectedItem.id}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
