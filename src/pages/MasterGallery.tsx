import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lock, 
  RotateCcw, 
  ArrowLeft, 
  Layers, 
  Award,
  AlertTriangle,
  X,
  ZoomIn,
  Eye,
  Maximize2,
  FolderArchive,
  Heart,
  Sun
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EVIDENCE_COLLECTION } from '../data/evidence';
import { useProgression } from '../utils/progression';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';
import { getFocusableElements, handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';
import { PLACEHOLDER_GALLERY_COLLECTIONS } from '../data/memories';
import { SUBJECT_CASE_DATA, SUBJECT_FOUND_DATA } from '../data/findHerData';
import type { EvidenceItem } from '../types';

interface ZoomModalData {
  title: string;
  code?: string;
  imageUrl: string;
  webpUrl?: string;
  date?: string;
  material?: string;
  dimensions?: string;
  caption?: string;
  forensicNotes?: string[];
}

export const MasterGallery: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = usePrefersReducedMotion();
  const { inspectedIds, isUnlocked, percentage, remainingIds, reset } = useProgression();
  const remaining = EVIDENCE_COLLECTION.filter((item) => remainingIds.includes(item.id));

  const [isRevelationUnsealed, setIsRevelationUnsealed] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeZoomItem, setActiveZoomItem] = useState<ZoomModalData | null>(null);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>('COLLECTION-OBSERVATION');

  // Focus management for reset confirmation modal
  const resetModalRef = useRef<HTMLDivElement>(null);
  const resetTriggerRef = useRef<HTMLElement | null>(null);

  // Focus management for optical zoom inspection modal
  const zoomModalRef = useRef<HTMLDivElement>(null);
  const zoomTriggerRef = useRef<HTMLElement | null>(null);
  const zoomCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Focus containment & auto-focus for Reset Modal
  useEffect(() => {
    if (showResetConfirm && resetModalRef.current) {
      const focusables = getFocusableElements(resetModalRef.current);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }
  }, [showResetConfirm]);

  // Focus containment & auto-focus for Optical Zoom Modal
  useEffect(() => {
    if (activeZoomItem && zoomModalRef.current) {
      if (zoomCloseBtnRef.current) {
        zoomCloseBtnRef.current.focus();
      } else {
        const focusables = getFocusableElements(zoomModalRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        }
      }
    }
  }, [activeZoomItem]);

  // Window-level escape key listener for any open dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeZoomItem) {
          handleCloseOpticalZoom();
        } else if (showResetConfirm) {
          handleCloseResetModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZoomItem, showResetConfirm]);

  // Reset Modal Handlers
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

  // Optical Zoom Handlers
  const handleOpenOpticalZoom = (item: EvidenceItem | { title: string; code?: string; imageUrl: string; webpUrl?: string; date?: string; caption?: string; }) => {
    soundFx.playKeypress();
    zoomTriggerRef.current = document.activeElement as HTMLElement;
    
    if ('material' in item) {
      const evidence = item as EvidenceItem;
      setActiveZoomItem({
        title: evidence.title,
        code: evidence.code,
        imageUrl: evidence.imageUrl,
        webpUrl: evidence.webpUrl,
        date: evidence.dateDiscovered,
        material: evidence.material,
        dimensions: evidence.dimensions,
        caption: evidence.summary,
        forensicNotes: evidence.forensicNotes,
      });
    } else {
      const photo = item as { title: string; code?: string; imageUrl: string; webpUrl?: string; date?: string; caption?: string; };
      setActiveZoomItem({
        title: photo.title,
        code: photo.code,
        imageUrl: photo.imageUrl,
        webpUrl: photo.webpUrl,
        date: photo.date,
        caption: photo.caption,
      });
    }
  };

  const handleCloseOpticalZoom = () => {
    soundFx.playKeypress();
    setActiveZoomItem(null);
    restoreFocusSafely(zoomTriggerRef.current);
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brass/40 bg-investigation-forest mx-auto flex items-center justify-center shadow-brass-sm mb-6">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-brass animate-pulse-subtle" />
            </div>

            <span className="stamp-confidential text-xs px-3 py-1 mb-4 inline-block">
              OPERATION: FIND HER // FINAL REUNION GATE
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-parchment tracking-wide mt-2">
              The Master Curatorial Gallery Is Sealed
            </h1>

            <p className="text-sm font-sans text-investigation-muted max-w-xl mx-auto mt-3 leading-relaxed">
              Curatorial Directive 12 requires all 3 confidential exhibits to undergo full inspection on the Investigation Board before the scenic destination unlocks.
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

  // UNLOCKED STATE: ACT III — SUBJECT FOUND & THE MASTER CURATORIAL GALLERY
  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-gradient-to-b from-[#14100c] via-[#101311] to-[#080d0a] text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="gallery" />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
        
        {/* Top Navigation & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brass/30">
          <div className="flex items-center space-x-3 text-xs font-mono text-investigation-muted">
            <Link
              to="/archive"
              onClick={() => soundFx.playKeypress()}
              className="hover:text-brass transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO BOARD</span>
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
            <span className="text-brass-light font-bold">SUBJECT FOUND & CELEBRATION</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-1.5 rounded-full bg-brass/20 border border-brass text-brass-light font-mono text-xs font-bold flex items-center space-x-2 shadow-brass-sm">
              <Sparkles className="w-3.5 h-3.5 text-brass animate-spin-slow" />
              <span>STATUS: SUBJECT FOUND</span>
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

        {/* ACT III DRAMATIC REVEAL: SUBJECT FOUND AT THE SCENIC OVERLOOK */}
        <section className="relative rounded-2xl overflow-hidden border-2 border-brass/60 bg-gradient-to-b from-[#261d14] via-[#1a1714] to-[#121815] p-8 sm:p-14 shadow-spotlight text-center space-y-8">
          {/* Subtle Ambient Sunlight Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brass/20 border border-brass/60 text-xs font-mono text-brass-light uppercase tracking-widest">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>ACT III: THE CELEBRATION REUNION</span>
            </div>

            {/* Preserves E2E Test String: "The Master Curatorial Gallery" */}
            <div className="text-xs font-mono text-brass/80 tracking-widest">
              The Master Curatorial Gallery // CASE NO. 012 RESOLVED
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black text-parchment tracking-wide max-w-4xl mx-auto leading-tight">
              SUBJECT FOUND.
            </h1>

            <p className="text-sm sm:text-lg font-serif italic text-brass-light/95 max-w-2xl mx-auto">
              At the Scenic Lookout // Bathed in Golden Light
            </p>
          </div>

          {/* Central Hero Portrait Placeholder */}
          <div className="relative z-10 max-w-md mx-auto">
            <div className="bg-parchment p-4 sm:p-5 pb-8 sm:pb-10 rounded-lg shadow-2xl border-2 border-brass transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="w-full aspect-[4/3] bg-charcoal-900 rounded overflow-hidden relative border border-black/20">
                <img
                  src={SUBJECT_FOUND_DATA.heroImage}
                  alt="Subject Located at the Scenic Overlook"
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-left">
                  <span className="px-2.5 py-1 rounded bg-black/75 border border-brass/40 text-brass text-[10px] font-mono font-bold tracking-wider">
                    LOCATION: THE SCENIC OVERLOOK
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="font-serif font-bold text-base text-charcoal-900">
                  {SUBJECT_CASE_DATA.namePlaceholder}
                </p>
                <p className="font-serif italic text-xs text-red-900 mt-0.5">
                  "The most extraordinary individual in any room."
                </p>
              </div>
            </div>
          </div>

          {/* Heartfelt Birthday Message */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-4 pt-4">
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-brass-light tracking-wide">
              {SUBJECT_FOUND_DATA.birthdayCelebrationHeadline}
            </h2>

            <div className="space-y-3 text-sm sm:text-base font-sans text-investigation-text leading-relaxed">
              {SUBJECT_FOUND_DATA.birthdayParagraphs.map((para, idx) => (
                <p key={idx} className={idx === 0 ? "font-serif text-base sm:text-lg italic text-parchment font-semibold" : ""}>
                  {para}
                </p>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-xs font-mono text-brass">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>THE INVESTIGATION IS COMPLETE // YOU ARE DEEPLY LOVED</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          </div>
        </section>

        {/* The Connected Triple Exhibition Pedestals (Preserves E2E Test Suite) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-brass uppercase tracking-wider">
              <Layers className="w-4 h-4 text-brass" />
              <span>CORE ARTEFACT PEDESTALS</span>
            </div>
            <span className="text-[11px] font-mono text-investigation-muted">
              OPTICAL ZOOM AVAILABLE ON ALL PEDESTALS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {EVIDENCE_COLLECTION.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
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

                {/* Exhibit Canvas Frame with Optical Zoom Trigger */}
                <div className="relative aspect-[4/3] w-full bg-charcoal-900 overflow-hidden border-b border-investigation-border group">
                  <picture className="w-full h-full">
                    {item.webpUrl && <source srcSet={item.webpUrl} type="image/webp" />}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-investigation-surface/90 via-transparent to-black/30 pointer-events-none" />
                  
                  {/* Top-Right Optical Zoom Overlay Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={() => handleOpenOpticalZoom(item)}
                      aria-label={`Open optical zoom inspection for ${item.title}`}
                      aria-haspopup="dialog"
                      className="px-2.5 py-1.5 rounded bg-black/75 hover:bg-brass hover:text-charcoal-900 border border-brass/50 text-brass-light font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>OPTICAL ZOOM</span>
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-brass-light pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-brass/30">
                      {item.dateDiscovered}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-brass/30">
                      ✓ SOLVED
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

                  <div className="pt-3 border-t border-investigation-border/40 flex items-center justify-between text-[11px] font-mono text-investigation-muted">
                    <span className="truncate max-w-[180px]">LOC: {item.origin}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenOpticalZoom(item)}
                      className="text-brass hover:text-parchment transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>EXPAND</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Phase 3 Curatorial Photo Series Drawer */}
        <section className="p-6 sm:p-10 rounded-xl bg-investigation-surface border border-investigation-border/80 shadow-dossier space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-investigation-border/60">
            <div>
              <div className="text-xs font-mono text-brass uppercase tracking-widest mb-1 flex items-center space-x-2">
                <FolderArchive className="w-4 h-4 text-brass" />
                <span>PERSONAL MEMORY GALLERIES // PHOTO SERIES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-parchment">
                Curated Memories & Celebrations
              </h2>
            </div>
            
            {/* Collection Tab Selector */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Curatorial Photo Collections">
              {PLACEHOLDER_GALLERY_COLLECTIONS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCollectionTab === col.id}
                  onClick={() => {
                    soundFx.playKeypress();
                    setActiveCollectionTab(col.id);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all ${
                    activeCollectionTab === col.id
                      ? 'bg-brass text-charcoal-900 font-bold shadow-sm'
                      : 'bg-investigation-card border border-investigation-border text-investigation-muted hover:text-parchment'
                  }`}
                >
                  {col.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Collection Photos Grid */}
          {PLACEHOLDER_GALLERY_COLLECTIONS.filter((col) => col.id === activeCollectionTab).map((col) => (
            <div key={col.id} className="pt-2">
              <div className="mb-4">
                <h3 className="font-serif font-bold text-lg text-brass-light">{col.title}</h3>
                <p className="text-xs font-sans text-investigation-muted mt-1">{col.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {col.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-lg bg-investigation-card border border-investigation-border overflow-hidden hover:border-brass/50 transition-all shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-charcoal-900 overflow-hidden group">
                      <picture className="w-full h-full">
                        {photo.webpUrl && <source srcSet={photo.webpUrl} type="image/webp" />}
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </picture>
                      <button
                        type="button"
                        onClick={() => handleOpenOpticalZoom({
                          title: photo.title,
                          imageUrl: photo.imageUrl,
                          webpUrl: photo.webpUrl,
                          date: photo.date,
                          caption: photo.caption,
                        })}
                        aria-label={`Inspect ${photo.title} with optical zoom`}
                        aria-haspopup="dialog"
                        className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 hover:bg-brass hover:text-charcoal-900 border border-brass/40 text-brass-light font-mono text-[10px] flex items-center space-x-1 transition-colors"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>ZOOM</span>
                      </button>
                    </div>
                    <div className="p-4 space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-investigation-muted text-[10px]">
                        <span>{photo.date || 'UNDATED'}</span>
                        <span className="uppercase text-brass-dark">{photo.aspectRatio}</span>
                      </div>
                      <h4 className="font-serif font-bold text-parchment text-sm">{photo.title}</h4>
                      {photo.caption && (
                        <p className="font-sans text-xs text-investigation-muted leading-relaxed">{photo.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Final Narrative Revelation Unseal Drawer */}
        <section className="p-8 sm:p-12 rounded-xl bg-investigation-surface border border-brass/50 shadow-dossier text-center space-y-6">
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
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
              className="p-8 sm:p-12 rounded-xl bg-gradient-to-b from-investigation-forest to-investigation-base border-2 border-brass text-center shadow-spotlight max-w-3xl mx-auto space-y-6"
            >
              <div className="w-16 h-16 rounded-full border border-brass bg-investigation-surface mx-auto flex items-center justify-center p-3 shadow-brass">
                <Sparkles className="w-8 h-8 text-brass" />
              </div>

              <div className="text-xs font-mono text-brass uppercase tracking-widest">
                OPERATION: FIND HER // THE PRIVATE DEDICATION
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif font-black text-parchment leading-snug">
                To An Extraordinary Individual
              </h3>

              <p className="font-serif italic text-base sm:text-lg text-brass-light/95 leading-relaxed max-w-2xl mx-auto">
                "You have searched the archives, examined the polaroids, interviewed the suspects, and followed every clue. 
                Every classified dispatch, every silly witness testimony, and every memory in this collection was assembled to celebrate you."
              </p>

              <div className="p-4 rounded-lg bg-investigation-surface/80 border border-investigation-border text-xs font-mono text-investigation-muted max-w-xl mx-auto">
                <span>INVESTIGATION CONCLUSION: SUBJECT IS IRREPLACEABLE. HAVE THE HAPPIEST BIRTHDAY.</span>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                <Link
                  to="/archive"
                  onClick={() => soundFx.playKeypress()}
                  className="px-5 py-2.5 rounded bg-investigation-surface border border-investigation-border hover:border-brass text-investigation-text transition-colors"
                >
                  RETURN TO BOARD
                </Link>

                <Link
                  to="/scrapbook"
                  onClick={() => soundFx.playKeypress()}
                  className="px-5 py-2.5 rounded bg-investigation-surface border border-investigation-border hover:border-brass text-investigation-text transition-colors"
                >
                  VIEW SCRAPBOOK
                </Link>
              </div>
            </motion.div>
          )}
        </section>

      </main>

      <Footer />

      {/* Optical Zoom Accessible Modal Dialog */}
      <AnimatePresence>
        {activeZoomItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/95 backdrop-blur-md"
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                handleTabFocusWrap(e, zoomModalRef.current);
              }
            }}
          >
            <motion.div
              ref={zoomModalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="optical-zoom-title"
              aria-describedby="optical-zoom-desc"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-investigation-surface border-2 border-brass/60 shadow-dossier flex flex-col overflow-hidden font-mono text-xs"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-investigation-card border-b border-investigation-border flex items-center justify-between">
                <div className="flex items-center space-x-2 text-brass">
                  <ZoomIn className="w-4 h-4 text-brass" />
                  <span id="optical-zoom-title" className="font-bold tracking-wider uppercase">
                    OPTICAL FORENSIC INSPECTION // {activeZoomItem.code || 'EXHIBIT VIEW'}
                  </span>
                </div>
                <button
                  ref={zoomCloseBtnRef}
                  type="button"
                  onClick={handleCloseOpticalZoom}
                  aria-label="Close optical zoom dialog"
                  className="p-1 rounded text-investigation-muted hover:text-parchment hover:bg-investigation-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="relative max-h-[50vh] flex items-center justify-center bg-black/60 rounded-lg overflow-hidden border border-investigation-border p-2">
                  <picture className="max-h-[46vh] max-w-full">
                    {activeZoomItem.webpUrl && <source srcSet={activeZoomItem.webpUrl} type="image/webp" />}
                    <img
                      src={activeZoomItem.imageUrl}
                      alt={activeZoomItem.title}
                      className="w-full h-full object-contain"
                    />
                  </picture>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-xl text-parchment">
                      {activeZoomItem.title}
                    </h3>
                    {activeZoomItem.date && (
                      <span className="px-2.5 py-1 rounded bg-investigation-forest border border-investigation-border text-brass-light text-xs font-mono">
                        {activeZoomItem.date}
                      </span>
                    )}
                  </div>

                  <p id="optical-zoom-desc" className="font-sans text-xs sm:text-sm text-investigation-text leading-relaxed">
                    {activeZoomItem.caption}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-investigation-card border-t border-investigation-border flex items-center justify-between text-[11px] text-investigation-muted">
                <span>PRESS ESCAPE OR CLICK CLOSE TO RETURN</span>
                <button
                  type="button"
                  onClick={handleCloseOpticalZoom}
                  className="px-4 py-1.5 rounded bg-investigation-surface border border-investigation-border hover:bg-brass hover:text-charcoal-900 transition-colors"
                >
                  RETURN TO GALLERY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Accessible Confirmation Modal for Reset Progression */}
      <AnimatePresence>
        {showResetConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md"
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
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
                Resetting your investigation progression will clear your examined clues from local storage and return the Subject Found scene to its sealed state. You can inspect the clues again at any time.
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
