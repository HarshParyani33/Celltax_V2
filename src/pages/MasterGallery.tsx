import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lock, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  Award,
  AlertTriangle,
  X
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EVIDENCE_COLLECTION } from '../data/evidence';
import { useProgression } from '../utils/progression';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';
import { handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';

export const MasterGallery: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = usePrefersReducedMotion();
  const { inspectedIds, isUnlocked, percentage, remainingIds, reset } = useProgression();
  const remaining = EVIDENCE_COLLECTION.filter((item) => remainingIds.includes(item.id));

  const [isRevelationUnsealed, setIsRevelationUnsealed] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Focus management for reset confirmation modal
  const resetModalRef = useRef<HTMLDivElement>(null);
  const resetTriggerRef = useRef<HTMLElement | null>(null);

  const handleOpenResetModal = () => {
    soundFx.playKeypress();
    resetTriggerRef.current = document.activeElement as HTMLElement;
    setShowResetConfirm(true);
  };

  const handleCloseResetModal = () => {
    soundFx.playKeypress();
    setShowResetConfirm(false);
    restoreFocusSafely(resetTriggerRef.current);
  };

  const handleConfirmReset = () => {
    soundFx.playKeypress();
    reset();
    setShowResetConfirm(false);
    navigate('/archive');
  };

  const handleUnsealRevelation = () => {
    soundFx.playAccessGranted();
    setIsRevelationUnsealed(true);
  };

  // LOCKED STATE: If not all 3 exhibits have been inspected
  if (!isUnlocked) {
    return (
      <motion.div
        variants={getPageTransition(shouldReduceMotion)}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
      >
        <Header currentScreen="gallery" />

        <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center justify-center">
          <div className="w-full rounded-xl border border-brass/30 bg-investigation-surface p-8 sm:p-12 text-center shadow-dossier relative overflow-hidden">
            {/* Lock Crest Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brass/40 bg-investigation-forest mx-auto flex items-center justify-center shadow-brass-sm mb-6">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-brass animate-pulse-subtle" />
            </div>

            <span className="stamp-confidential text-xs px-3 py-1 mb-4 inline-block">
              CURATORIAL CLEARANCE LEVEL 4 REQUIRED
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-parchment tracking-wide mt-2">
              The Master Curatorial Gallery Is Sealed
            </h1>

            <p className="text-sm font-sans text-investigation-muted max-w-xl mx-auto mt-3 leading-relaxed">
              Curatorial Directive 12 requires all 3 confidential exhibits to undergo full forensic inspection in the archive before this gallery transforms.
            </p>

            {/* Progression Bar */}
            <div className="max-w-md mx-auto my-8 p-4 rounded-lg bg-investigation-base border border-investigation-border">
              <div className="flex items-center justify-between text-xs font-mono text-investigation-muted mb-2">
                <span>INVESTIGATION PROGRESS</span>
                <span className="text-brass font-bold">{inspectedIds.length} / 3 EXHIBITS ({percentage}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-investigation-surface overflow-hidden border border-investigation-border">
                <div
                  className="h-full bg-gradient-to-r from-brass-dark via-brass to-brass-light transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Missing exhibits breakdown */}
            <div className="max-w-lg mx-auto text-left mb-8">
              <div className="text-xs font-mono text-brass uppercase tracking-wider mb-3">
                REMAINING EXHIBITS REQUIRING INSPECTION:
              </div>
              <div className="space-y-2">
                {remaining.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded bg-investigation-forest/60 border border-investigation-border/60 text-xs font-mono"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="font-bold text-brass-light">{item.code}</span>
                      <span className="text-investigation-muted truncate max-w-[220px] sm:max-w-xs">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">UNEXAMINED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation back to archive */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/archive"
                onClick={() => soundFx.playKeypress()}
                className="w-full sm:w-auto px-8 py-3.5 rounded font-mono text-xs sm:text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-brass via-brass-light to-brass text-charcoal-900 hover:brightness-110 shadow-brass transition-all inline-flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <ArrowLeft className="w-4 h-4 text-charcoal-900" />
                <span>RETURN TO ARCHIVE TO COMPLETE INSPECTION</span>
              </Link>

              <Link
                to="/timeline"
                onClick={() => soundFx.playKeypress()}
                className="w-full sm:w-auto px-6 py-3.5 rounded font-mono text-xs font-bold tracking-wider uppercase bg-investigation-surface border border-investigation-border text-investigation-muted hover:text-parchment hover:border-brass/50 transition-all inline-flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <span>VIEW TIMELINE</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </motion.div>
    );
  }

  // UNLOCKED STATE: Full Master Curatorial Gallery
  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="gallery" />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Top Navigation & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-investigation-border/60">
          <div className="flex items-center space-x-3 text-xs font-mono text-investigation-muted">
            <Link
              to="/archive"
              onClick={() => soundFx.playKeypress()}
              className="hover:text-brass transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ARCHIVE</span>
            </Link>
            <span>/</span>
            <Link
              to="/timeline"
              onClick={() => soundFx.playKeypress()}
              className="hover:text-brass transition-colors"
            >
              TIMELINE
            </Link>
            <span>/</span>
            <span className="text-brass-light font-bold">MASTER CURATORIAL GALLERY</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded bg-brass/20 border border-brass text-brass-light font-mono text-xs font-bold flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-brass" />
              <span>CASE NO. 012 FULLY RESOLVED</span>
            </div>

            <button
              type="button"
              onClick={handleOpenResetModal}
              className="px-3 py-1.5 rounded bg-investigation-surface border border-investigation-border hover:border-red-400/50 text-investigation-muted hover:text-red-400 text-xs font-mono flex items-center space-x-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
              title="Reset investigation progression"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET INVESTIGATION</span>
            </button>
          </div>
        </div>

        {/* Curatorial Editorial Introduction Banner */}
        <div className="my-10 text-center relative py-12 px-6 sm:px-12 rounded-xl bg-gradient-to-b from-investigation-surface via-investigation-forest to-investigation-base border border-brass/40 shadow-spotlight overflow-hidden">
          <div className="w-16 h-16 rounded-full border border-brass/50 bg-investigation-base mx-auto p-2.5 mb-4 shadow-brass-sm">
            <img src="/seal.svg" alt="Department Crest" className="w-full h-full object-contain" />
          </div>

          <div className="text-xs font-mono text-brass tracking-widest uppercase mb-2">
            THE DEPARTMENT OF EXTRAORDINARY THINGS // CLASSIFIED EXHIBIT NO. 012
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-parchment tracking-wide max-w-4xl mx-auto leading-tight">
            The Master Curatorial Gallery
          </h1>

          <p className="text-sm sm:text-base font-serif italic text-brass-light/90 max-w-3xl mx-auto mt-4 leading-relaxed">
            "Three distant artefacts. Three disparate decades. A solitary observatory on a rugged coast, a decrypted parchment of devotion, and an astrolithic dial calibrated to a single milestone date."
          </p>

          <div className="mt-6 max-w-2xl mx-auto text-xs font-sans text-investigation-muted leading-relaxed">
            <p>
              Forensic inspection confirms that these exhibits do not chronicle an enigma of state or an unsolved crime. 
              Together, they form an intimate, immortal archive celebrating the extraordinary journey of one unique individual.
            </p>
          </div>
        </div>

        {/* The Connected Triple Exhibition Pedestals */}
        <div className="my-12">
          <div className="flex items-center space-x-2 text-xs font-mono text-brass uppercase tracking-wider mb-6">
            <Layers className="w-4 h-4 text-brass" />
            <span>THE UNIFIED CHRONOLOGICAL EXHIBITION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {EVIDENCE_COLLECTION.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.15 }}
                className="flex flex-col rounded-xl bg-investigation-surface border border-brass/40 shadow-evidenceCard overflow-hidden relative"
              >
                {/* Header Plaque */}
                <div className="px-5 py-3.5 bg-investigation-card border-b border-investigation-border flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brass" />
                    <span className="font-bold text-brass-light">{item.code}</span>
                  </div>
                  <span className="text-[10px] text-investigation-muted uppercase px-2 py-0.5 rounded bg-investigation-forest border border-investigation-border">
                    {item.type}
                  </span>
                </div>

                {/* Exhibit Canvas Frame */}
                <div className="relative aspect-[4/3] w-full bg-charcoal-900 overflow-hidden border-b border-investigation-border">
                  <picture className="w-full h-full">
                    {item.webpUrl && <source srcSet={item.webpUrl} type="image/webp" />}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-investigation-surface/90 via-transparent to-black/20 pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-brass-light">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-brass/30">
                      {item.dateDiscovered}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-brass/30">
                      ✓ AUTHENTICATED
                    </span>
                  </div>
                </div>

                {/* Pedestal Information */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-parchment">
                      {item.title}
                    </h3>
                    <p className="text-xs font-sans text-investigation-muted mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Curatorial Insight Note */}
                  <div className="p-3.5 rounded bg-investigation-forest/80 border border-investigation-border/60 text-xs font-mono space-y-1.5">
                    <div className="text-brass text-[10px] tracking-wider uppercase flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-brass" />
                      <span>CURATORIAL CORRESPONDENCE:</span>
                    </div>
                    <p className="text-[11px] font-sans text-investigation-text/90 leading-relaxed">
                      {index === 0 && 'The coastal observation post that charted the horizon for a singular journey.'}
                      {index === 1 && 'The hand-penned dispatch preserving the sacred cipher of celebration.'}
                      {index === 2 && 'The astrolithic dial that measures astronomical time to an extraordinary day.'}
                    </p>
                  </div>

                  {/* Origin Tag */}
                  <div className="pt-2 border-t border-investigation-border/40 flex items-center justify-between text-[11px] font-mono text-investigation-muted">
                    <span>LOCATION:</span>
                    <span className="text-investigation-text truncate max-w-[170px]">{item.origin}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Forensic Convergence Synthesis Section */}
        <div className="my-14 p-8 sm:p-12 rounded-xl bg-investigation-surface border border-brass/50 shadow-dossier space-y-8">
          <div className="border-b border-investigation-border/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-brass uppercase tracking-widest mb-1">
                EXAMINATION SUMMARY // DOSSIER 012
              </div>
              <h2 className="text-xl sm:text-3xl font-serif font-black text-parchment">
                The Triple Synthesis of Case No. 012
              </h2>
            </div>
            <div className="px-4 py-2 rounded bg-investigation-forest border border-brass/30 text-xs font-mono text-brass-light flex items-center space-x-2 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-brass" />
              <span>FORENSIC CONFIRMATION: 100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed font-sans text-investigation-text/90">
            <div className="space-y-2 p-5 rounded-lg bg-investigation-card/80 border border-investigation-border">
              <div className="text-xs font-mono font-bold text-brass uppercase">1. THE OBSERVATION</div>
              <p>
                In 1978, the maritime tower stood watch over the unmapped coastal coordinates. 
                Its lens was calibrated not to record passing storms, but to commemorate the advent of an extraordinary light.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-lg bg-investigation-card/80 border border-investigation-border">
              <div className="text-xs font-mono font-bold text-brass uppercase">2. THE TESTAMENT</div>
              <p>
                In 1988, the dispatch folio was sealed in copper-rich iron gall ink. 
                Its ciphered passages documented the wisdom, milestones, and enduring legacy of a beloved soul.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-lg bg-investigation-card/80 border border-investigation-border">
              <div className="text-xs font-mono font-bold text-brass uppercase">3. THE TIMEPIECE</div>
              <p>
                The astrolithic dial ticks without friction, locking the three concentric rings onto this exact milestone era. 
                All evidence converges into one single, private celebration.
              </p>
            </div>
          </div>

          {/* Final Narrative Revelation Unseal CTA */}
          <div className="pt-6 border-t border-investigation-border text-center">
            {!isRevelationUnsealed ? (
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                onClick={handleUnsealRevelation}
                className="px-10 py-4 rounded-lg font-mono text-xs sm:text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-brass via-brass-light to-brass text-charcoal-900 hover:brightness-110 shadow-brass transition-all inline-flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <Award className="w-5 h-5 text-charcoal-900" />
                <span>UNSEAL FINAL CURATORIAL REVELATION</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
                className="p-8 sm:p-12 rounded-xl bg-gradient-to-b from-investigation-forest to-investigation-base border-2 border-brass text-center shadow-spotlight max-w-3xl mx-auto space-y-6"
              >
                <div className="w-16 h-16 rounded-full border border-brass bg-investigation-surface mx-auto flex items-center justify-center p-3 shadow-brass">
                  <Sparkles className="w-8 h-8 text-brass" />
                </div>

                <div className="text-xs font-mono text-brass uppercase tracking-widest">
                  CASE NO. 012 // THE PRIVATE DEDICATION
                </div>

                <h3 className="text-2xl sm:text-4xl font-serif font-black text-parchment leading-snug">
                  To An Extraordinary Individual
                </h3>

                <p className="font-serif italic text-base sm:text-lg text-brass-light/95 leading-relaxed max-w-2xl mx-auto">
                  "You have searched the archives, examined the artefacts, and pieced together the chronology. 
                  Every classified ledger, every astronomical coordinate, and every weathered folio in this collection was assembled to celebrate you."
                </p>

                <div className="p-4 rounded-lg bg-investigation-surface/80 border border-investigation-border text-xs font-mono text-investigation-muted max-w-xl mx-auto">
                  <span>CURATORIAL VERDICT: INVESTIGATION COMPLETED WITH HONORS.</span>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                  <Link
                    to="/timeline"
                    onClick={() => soundFx.playKeypress()}
                    className="px-5 py-2.5 rounded bg-investigation-surface border border-investigation-border hover:border-brass text-investigation-text transition-colors"
                  >
                    REVISIT TIMELINE
                  </Link>

                  <Link
                    to="/archive"
                    onClick={() => soundFx.playKeypress()}
                    className="px-5 py-2.5 rounded bg-investigation-surface border border-investigation-border hover:border-brass text-investigation-text transition-colors"
                  >
                    REVISIT EVIDENCE ARCHIVE
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Accessible Confirmation Modal for Reset Progression */}
      <AnimatePresence>
        {showResetConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCloseResetModal();
              } else if (e.key === 'Tab') {
                handleTabFocusWrap(e, resetModalRef.current);
              }
            }}
          >
            <motion.div
              ref={resetModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-modal-title"
              aria-describedby="reset-modal-desc"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              className="w-full max-w-md rounded-lg bg-investigation-surface border border-brass/60 p-6 sm:p-8 shadow-dossier font-mono text-xs space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-investigation-border">
                <div className="flex items-center space-x-2 text-red-400 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span id="reset-modal-title">CONFIRM INVESTIGATION RESET</span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  aria-label="Cancel reset"
                  className="p-1 rounded text-investigation-muted hover:text-parchment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p id="reset-modal-desc" className="font-sans text-xs text-investigation-text leading-relaxed">
                Resetting your investigation progression will clear your inspected exhibit records from local storage and return the Master Gallery to its sealed state. You can inspect the exhibits again at any time.
              </p>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  className="px-4 py-2 rounded bg-investigation-card border border-investigation-border text-investigation-text hover:bg-investigation-surface transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-4 py-2 rounded bg-red-800 hover:bg-red-700 text-parchment font-bold tracking-wider transition-colors"
                >
                  RESET PROGRESSION
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
