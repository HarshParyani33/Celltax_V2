import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, FileText, Sparkles, Compass, Heart } from 'lucide-react';
import { EvidenceItem } from '../types';
import { soundFx } from '../utils/audio';
import { usePrefersReducedMotion } from '../utils/animations';
import { handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';

interface EvidenceModalProps {
  item: EvidenceItem;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ item, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  // Keep a stable ref to onClose to prevent stale closures and unnecessary re-attaches
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    // 1. Capture previously focused element if it originated outside the dialog
    const active = document.activeElement;
    if (active instanceof HTMLElement && (!modalRef.current || !modalRef.current.contains(active))) {
      previousFocusRef.current = active;
    }

    // 2. Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Move initial focus to the primary close button
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    // 4. Global Escape key and Tab focus wrap listener
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        handleTabFocusWrap(e, modalRef.current);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    // 5. Contain focus if focus ever shifts outside the dialog container
    const handleFocusIn = (e: FocusEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        e.stopPropagation();
        closeBtnRef.current?.focus();
      }
    };
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.body.style.overflow = originalOverflow;

      // 6. Safely restore focus to the original triggering element if still connected to the DOM
      restoreFocusSafely(previousFocusRef.current);
    };
  }, []);

  // Focus trap implementation: handles Tab and Shift+Tab wrapping within the dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleTabFocusWrap(e, modalRef.current);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
      onKeyDown={handleKeyDown}
    >
      {/* Warm Ambient Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.25 }}
        onClick={() => {
          soundFx.playKeypress();
          onCloseRef.current();
        }}
        className="fixed inset-0 bg-[#2d2016]/80 backdrop-blur-sm"
      />

      {/* Accessible Dialog Window - Warm Parchment Dossier */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-modal-title"
        aria-describedby="evidence-modal-summary"
        tabIndex={-1}
        initial={{
          opacity: 0,
          scale: shouldReduceMotion ? 1 : 0.95,
          y: shouldReduceMotion ? 0 : 15,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: shouldReduceMotion ? 1 : 0.95,
          y: shouldReduceMotion ? 0 : 15,
        }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#fdfbf7] texture-paper border-2 border-[#d8c8b4] rounded-2xl shadow-2xl overflow-hidden z-10 focus:outline-none"
      >
        {/* Top Bar with Classification & Close */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#f5ede2] border-b border-[#e4d8c8]">
            <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b3a2b] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#8b3a2b]">
                  {item.code} // {item.classification}
                </span>
            </div>

            <button
              ref={closeBtnRef}
              onClick={() => {
                soundFx.playKeypress();
                onCloseRef.current();
              }}
              aria-label="Close Inspection Dossier (Escape)"
              className="p-1.5 rounded-full hover:bg-[#ebdccb] text-[#6d5b52] hover:text-[#38261e] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b3a2b]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body - Scrollable */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">

              {/* Header: Title & Badges */}
                <div className="border-b border-[#e4d8c8] pb-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-0.5 rounded-full text-[11px] font-mono uppercase bg-[#ede3d5] border border-[#dfd2c0] text-[#8b3a2b] font-bold">
                        {item.type}
                      </span>
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-mono bg-[#f4ece1] border border-[#dfd2c0] text-[#6d5b52]">
                          AFFECTION SCORE: {item.confidenceScore}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#fae8e6] text-[#8b3a2b] font-semibold flex items-center space-x-1">
                          <Heart className="w-3 h-3 fill-[#c25e5e] text-[#c25e5e]" />
                          <span>CONFIRMED MEMORY</span>
                        </span>
                      </div>
                      <h2
                        id="evidence-modal-title"
                        className="text-2xl sm:text-3xl font-editorial font-bold text-[#38261e] tracking-tight"
                      >
                        {item.title}
                      </h2>
                      <p
                        id="evidence-modal-summary"
                        className="text-sm sm:text-base font-sans text-[#6d5b52] mt-2 leading-relaxed"
                      >
                        {item.summary}
                      </p>
                  </div>

                  {/* Visual Inspection Area */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Image Frame with Warm Polaroid / Keepsake Mount */}
                    <div className="md:col-span-7 flex flex-col items-center">
                          <div className="relative w-full rounded-xl overflow-hidden border-2 border-[#d8c8b4] bg-[#fbf8f3] shadow-md group p-3">

                            {/* Washi tape decoration */}
                            <div className="washi-tape-blush w-24 h-5 -top-2 left-1/2 -translate-x-1/2 z-20" />

                            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg flex items-center justify-center bg-[#f4ede2] border border-[#dfd2c0]">
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

                                {/* Exhibit Stamp Badge */}
                                <div className="absolute top-5 right-5 pointer-events-none">
                                  <span className="px-2.5 py-1 rounded bg-[#8b3a2b] text-[#faf6f0] text-[10px] font-mono font-bold tracking-wider shadow-sm uppercase">
                                    EXHIBIT {item.code.split('-')[2] || 'A'}
                                  </span>
                                </div>

                                    {/* Warm Keepsake Nameplate Bottom */}
                                    <div className="w-full mt-3 py-2 px-3 bg-[#f5ede2] rounded-lg border border-[#e4d8c8] flex items-center justify-between text-[11px] font-mono text-[#6d5b52]">
                                      <span className="flex items-center space-x-1 font-semibold text-[#8b3a2b]">
                                        <Search className="w-3.5 h-3.5 text-[#8b3a2b]" />
                                        <span>AUTHENTIC MEMORY ARTEFACT</span>
                                      </span>
                                      <span>1:1 SCALE RECOVERY</span>
                                    </div>
                                </div>

                                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#8a7667] mt-3 px-1">
                                    <span>DISCOVERED: {item.dateDiscovered}</span>
                                    <span>ORIGIN: {item.origin}</span>
                                  </div>
                                </div>

                                {/* Forensic Details & Metadata Column */}
                                <div className="md:col-span-5 space-y-4">

                                  {/* Physical Specifications */}
                                      <div className="p-4 rounded-xl border border-[#e4d8c8] bg-[#f7f2ea] space-y-2.5 shadow-xs">
                                        <h3 className="text-xs font-mono font-bold text-[#8b3a2b] uppercase tracking-wider flex items-center space-x-1.5">
                                          <Compass className="w-3.5 h-3.5 text-[#8b3a2b]" />
                                          <span>Physical Attributes</span>
                                        </h3>
                                          <div className="text-xs font-mono space-y-1.5 text-[#38261e]">
                                            {item.dimensions && (
                                                <div className="flex justify-between border-b border-[#e4d8c8] pb-1">
                                                  <span className="text-[#8a7667]">DIMENSIONS:</span>
                                                  <span className="font-semibold">{item.dimensions}</span>
                                                </div>
                  )}
                                                {item.material && (
                                                    <div className="flex justify-between border-b border-[#e4d8c8] pb-1">
                                                      <span className="text-[#8a7667]">MATERIAL:</span>
                                                      <span className="font-semibold text-right max-w-[180px]">{item.material}</span>
                                                    </div>
                  )}
                                                    <div className="flex justify-between">
                                                      <span className="text-[#8a7667]">CATALOG ID:</span>
                                                      <span className="text-[#8b3a2b] font-bold">{item.id}</span>
                                                    </div>
                                                  </div>
              </div>

              {/* Forensic Examination Observations */}
                                                <div className="p-4 rounded-xl border border-[#e4d8c8] bg-[#fdfbf7] space-y-2.5 shadow-xs">
                                                  <h3 className="text-xs font-mono font-bold text-[#8b3a2b] uppercase tracking-wider flex items-center space-x-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-[#8b3a2b]" />
                                                    <span>Investigator's Notes</span>
                                                  </h3>
                                                    <ul className="space-y-2 text-xs font-sans text-[#38261e] leading-relaxed">
                                                      {item.forensicNotes.map((note, idx) => (
                                                        <li key={idx} className="flex items-start space-x-2">
                                                          <span className="text-[#8b3a2b] font-mono mt-0.5">•</span>
                                                          <span>{note}</span>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                </div>

                                                    {/* Endearing Quirks & Anomalies */}
                                                    <div className="p-4 rounded-xl border border-[#e8c5c0] bg-[#fae8e6]/70 space-y-2 shadow-xs">
                                                      <h3 className="text-xs font-mono font-bold text-[#8b3a2b] uppercase tracking-wider flex items-center space-x-1.5">
                                                        <Sparkles className="w-3.5 h-3.5 text-[#8b3a2b]" />
                                                        <span>Endearing Quirks Detected</span>
                                                      </h3>
                                                        <ul className="space-y-1.5 text-xs font-sans text-[#8b3a2b]">
                                                          {item.anomalies.map((anomaly, idx) => (
                                                            <li key={idx} className="flex items-start space-x-2">
                                                              <span className="font-bold text-[#8b3a2b]">✦</span>
                                                              <span>{anomaly}</span>
                                                            </li>
                                                          ))}
                                                        </ul>
                                                    </div>

                                                </div>

                                            </div>

                                            {/* Bottom Actions */}
                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e4d8c8]">
                                                  <span className="text-xs font-mono text-[#8a7667]">
                                                    ARCHIVE ENTRY LOGGED • VERIFICATION HIERARCHY LEVEL 1
                                                  </span>
                                                  <button
                                                    onClick={() => {
                                                      soundFx.playKeypress();
                                                      onCloseRef.current();
                                                    }}
                                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#d8c8b4] bg-[#f5ede2] hover:bg-[#ede3d5] text-[#38261e] font-mono text-xs font-bold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b3a2b] shadow-xs"
                                                  >
                                                    Close Inspection Dossier
                                                  </button>
                                                </div>

                                            </div>
                                          </motion.div>
                                        </div>
                                        );
};
