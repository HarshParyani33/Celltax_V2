import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, FileText, AlertCircle, Compass } from 'lucide-react';
import { EvidenceItem } from '../types';
import { soundFx } from '../utils/audio';

interface EvidenceModalProps {
  item: EvidenceItem;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ item, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Capture previously focused element to restore on close
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 2. Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Focus the primary close button on open
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    // 4. Global Escape key listener
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore focus to trigger element
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  // Focus trap implementation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => {
          soundFx.playKeypress();
          onClose();
        }}
        className="fixed inset-0 bg-charcoal-900/90 backdrop-blur-md"
      />

      {/* Accessible Dialog Window */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-modal-title"
        aria-describedby="evidence-modal-summary"
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-investigation-surface border border-brass/50 rounded-lg shadow-dossier overflow-hidden z-10 focus:outline-none"
      >
        {/* Top Bar with Classification & Close */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-investigation-card border-b border-investigation-border">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brass animate-pulse-subtle" />
            <span className="text-xs font-mono font-bold tracking-widest text-brass-light">
              {item.code} // {item.classification}
            </span>
          </div>
          
          <button
            ref={closeBtnRef}
            onClick={() => {
              soundFx.playKeypress();
              onClose();
            }}
            aria-label="Close Inspection Dossier (Escape)"
            className="p-1.5 rounded-md hover:bg-investigation-surface border border-transparent hover:border-brass/40 text-investigation-muted hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body - Scrollable */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Header: Title & Badges */}
          <div className="border-b border-investigation-border/60 pb-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-investigation-forest border border-investigation-border text-brass">
                {item.type}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-charcoal-800 border border-investigation-border text-investigation-muted">
                CONFIDENCE: {item.confidenceScore}%
              </span>
            </div>
            <h2
              id="evidence-modal-title"
              className="text-xl sm:text-2xl font-serif font-bold text-parchment tracking-wide"
            >
              {item.title}
            </h2>
            <p
              id="evidence-modal-summary"
              className="text-sm font-sans text-investigation-muted mt-1 leading-relaxed"
            >
              {item.summary}
            </p>
          </div>

          {/* Visual Inspection Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Image Frame with Museum Light and Archival Plate */}
            <div className="md:col-span-7 flex flex-col items-center">
              <div className="relative w-full rounded-md overflow-hidden border border-brass/40 shadow-spotlight bg-charcoal-900 group">
                <div className="aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-black">
                  <picture className="w-full h-full flex items-center justify-center">
                    {item.webpUrl && (
                      <source srcSet={item.webpUrl} type="image/webp" />
                    )}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </picture>
                </div>

                {/* Stamp Overlay */}
                <div className="absolute top-3 right-3 pointer-events-none">
                  <span className="stamp-confidential text-[10px]">
                    EXHIBIT {item.code.split('-')[2] || 'A'}
                  </span>
                </div>

                {/* Brass Nameplate Bottom */}
                <div className="w-full py-2 px-3 bg-gradient-to-r from-investigation-surface via-investigation-card to-investigation-surface border-t border-brass/30 flex items-center justify-between text-[11px] font-mono text-brass-light">
                  <span className="flex items-center space-x-1">
                    <Search className="w-3.5 h-3.5 text-brass" />
                    <span>OPTICAL INSPECTION ACTIVE</span>
                  </span>
                  <span>1:1 SCALE RECOVERY</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between text-[11px] font-mono text-investigation-muted mt-2 px-1">
                <span>DISCOVERED: {item.dateDiscovered}</span>
                <span>ORIGIN: {item.origin}</span>
              </div>
            </div>

            {/* Forensic Details & Metadata Column */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Physical Specifications */}
              <div className="p-4 rounded border border-investigation-border bg-investigation-forest/60 space-y-2">
                <h3 className="text-xs font-mono font-bold text-brass uppercase tracking-wider flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-brass" />
                  <span>Physical Attributes</span>
                </h3>
                <div className="text-xs font-mono space-y-1.5 text-investigation-text">
                  {item.dimensions && (
                    <div className="flex justify-between border-b border-investigation-border/40 pb-1">
                      <span className="text-investigation-muted">DIMENSIONS:</span>
                      <span className="font-semibold">{item.dimensions}</span>
                    </div>
                  )}
                  {item.material && (
                    <div className="flex justify-between border-b border-investigation-border/40 pb-1">
                      <span className="text-investigation-muted">MATERIAL:</span>
                      <span className="font-semibold text-right max-w-[180px]">{item.material}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-investigation-muted">CATALOG ID:</span>
                    <span className="text-brass">{item.id}</span>
                  </div>
                </div>
              </div>

              {/* Forensic Examination Observations */}
              <div className="p-4 rounded border border-investigation-border bg-investigation-forest/40 space-y-2.5">
                <h3 className="text-xs font-mono font-bold text-brass uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-brass" />
                  <span>Forensic Ledger</span>
                </h3>
                <ul className="space-y-2 text-xs font-sans text-investigation-text/90">
                  {item.forensicNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-brass font-mono mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Anomalies Detected */}
              <div className="p-4 rounded border border-confidential-crimson/30 bg-confidential-crimson/10 space-y-2">
                <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>Unexplained Anomalies</span>
                </h3>
                <ul className="space-y-1.5 text-xs font-mono text-red-200/90">
                  {item.anomalies.map((anomaly, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-red-400">!</span>
                      <span>{anomaly}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-investigation-border">
            <span className="text-xs font-mono text-investigation-muted">
              ARCHIVE ENTRY LOGGED • VERIFICATION HIERARCHY LEVEL 1
            </span>
            <button
              onClick={() => {
                soundFx.playKeypress();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2 rounded border border-brass/60 bg-investigation-card hover:bg-investigation-surface text-brass-light font-mono text-xs tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              Close Inspection Dossier
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
