import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Mail, 
  Radio, 
  Users, 
  Compass, 
  Heart, 
  Pin, 
  Lock, 
  ArrowRight 
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EvidenceModal } from '../components/EvidenceModal';
import { LetterModal } from '../components/LetterModal';
import { AudioPlayerWidget } from '../components/AudioPlayerWidget';
import { EVIDENCE_COLLECTION } from '../data/evidence';
import { EvidenceItem } from '../types';
import { 
  INTERACTIVE_LETTERS, 
  PERSONAL_QUIRK_NOTES, 
  LetterData
} from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';
import { useProgression } from '../utils/progression';

const FILTER_OPTIONS = [
  { id: 'all', label: 'ALL EXHIBITS', count: 3 },
  { id: 'photograph', label: 'PHOTOGRAPHS', count: 1 },
  { id: 'document', label: 'DISPATCHES', count: 1 },
  { id: 'artefact', label: 'ARTEFACTS', count: 1 }
] as const;

export const EvidenceArchive: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = usePrefersReducedMotion();
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'photograph' | 'document' | 'artefact'>('all');
  
  const { inspectedIds, markInspected, isUnlocked, hasInspected } = useProgression();

  const filteredItems = EVIDENCE_COLLECTION.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const handleInspect = (item: EvidenceItem) => {
    soundFx.playInspect();
    setSelectedItem(item);
    markInspected(item.id);
  };

  const handleOpenLetter = (letter: LetterData) => {
    soundFx.playInspect();
    setSelectedLetter(letter);
  };

  const handleProceedToFound = () => {
    soundFx.playAccessGranted();
    setSelectedLetter(null);
    navigate('/gallery');
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

      {/* Main Corkboard / Evidence Desk Interface */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10"
      >
        {/* Top Board Header & Status Overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-investigation-border/60">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-investigation-muted mb-2 tracking-wider">
              <span className="text-brass">OPERATION: FIND HER</span>
              <span>•</span>
              <span>CENTRAL INVESTIGATION BOARD</span>
              <span>•</span>
              <span>CASE 012</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-parchment tracking-wide flex items-center space-x-2">
              <span>THE INVESTIGATION BOARD</span>
              <Heart className="w-5 h-5 text-red-500 fill-red-500 inline animate-pulse" />
            </h1>
            <p className="text-sm font-sans text-investigation-muted max-w-2xl mt-1 leading-relaxed">
              Examine the pinned evidence, inspect the polaroids, open recovered letters, and listen to the voice dispatches. Every clue reveals what makes her irreplaceable.
            </p>
          </div>

          {/* Progress / Catalog Counter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-4 py-2.5 rounded bg-investigation-forest border border-brass/40 font-mono text-xs text-brass-light flex items-center space-x-2 shadow-brass-sm">
              <Layers className="w-4 h-4 text-brass" />
              <span>CORE CLUES EXAMINED: {inspectedIds.length} / {EVIDENCE_COLLECTION.length}</span>
            </div>

            {isUnlocked ? (
              <Link
                to="/gallery"
                onClick={() => soundFx.playAccessGranted()}
                className="px-4 py-2.5 rounded bg-brass hover:bg-brass-light text-charcoal-900 font-serif font-bold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-brass animate-bounce"
              >
                <Sparkles className="w-4 h-4" />
                <span>ENTER GALLERY // SUBJECT FOUND</span>
              </Link>
            ) : (
              <div className="px-3 py-2 rounded bg-investigation-surface border border-investigation-border text-xs font-mono text-investigation-muted flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-investigation-muted" />
                <span>FINAL LETTER LOCKED</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Navigation Cards: Scrapbook, Witnesses & Suspects Hubs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/scrapbook"
            onClick={() => soundFx.playKeypress()}
            className="p-4 rounded-lg bg-investigation-card/80 border border-investigation-border hover:border-brass/70 transition-all flex items-center space-x-4 group shadow-md"
          >
            <div className="w-12 h-12 rounded bg-investigation-surface border border-brass/40 flex items-center justify-center text-brass group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-parchment text-sm group-hover:text-brass-light transition-colors">
                The Physical Scrapbook
              </div>
              <div className="text-[11px] font-mono text-investigation-muted mt-0.5">
                Multipage photo album & washi tape memories &rarr;
              </div>
            </div>
          </Link>

          <Link
            to="/witnesses"
            onClick={() => soundFx.playKeypress()}
            className="p-4 rounded-lg bg-investigation-card/80 border border-investigation-border hover:border-brass/70 transition-all flex items-center space-x-4 group shadow-md"
          >
            <div className="w-12 h-12 rounded bg-investigation-surface border border-brass/40 flex items-center justify-center text-brass group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-parchment text-sm group-hover:text-brass-light transition-colors">
                Witnesses & Suspects
              </div>
              <div className="text-[11px] font-mono text-investigation-muted mt-0.5">
                Friend statements & absurd alibis &rarr;
              </div>
            </div>
          </Link>

          <Link
            to="/timeline"
            onClick={() => soundFx.playKeypress()}
            className="p-4 rounded-lg bg-investigation-card/80 border border-investigation-border hover:border-brass/70 transition-all flex items-center space-x-4 group shadow-md"
          >
            <div className="w-12 h-12 rounded bg-investigation-surface border border-brass/40 flex items-center justify-center text-brass group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-parchment text-sm group-hover:text-brass-light transition-colors">
                Investigation Timeline
              </div>
              <div className="text-[11px] font-mono text-investigation-muted mt-0.5">
                Chronological clue trail & connections &rarr;
              </div>
            </div>
          </Link>
        </div>

        {/* SECTION 1: PHYSICAL CORE EVIDENCE EXHIBITS */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-serif font-bold text-brass-light flex items-center space-x-2">
              <Pin className="w-4 h-4 text-red-500 fill-red-500 transform rotate-12" />
              <span>PINNED FORENSIC EXHIBITS</span>
            </h2>

            {/* Filter Buttons */}
            <div
              role="group"
              aria-label="Filter evidence exhibits by category"
              className="flex items-center space-x-2 overflow-x-auto"
            >
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
                      px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brass
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
          </div>

          {/* Exhibits Grid (Polaroid Style Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => {
              const isItemInspected = hasInspected(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.4,
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

                  {/* Exhibit Visual Canvas / Frame */}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-investigation-surface/90 via-transparent to-black/30 pointer-events-none" />

                    {/* Stamp Badge */}
                    <div className="absolute top-2.5 right-2.5 pointer-events-none">
                      <span className="stamp-confidential text-[9px] px-1.5 py-0.5">
                        EVIDENCE
                      </span>
                    </div>

                    {/* Inspect CTA Hover Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                      <div className="px-4 py-2 rounded-full bg-brass text-charcoal-900 font-mono text-xs font-bold tracking-widest flex items-center space-x-2 shadow-brass">
                        <Eye className="w-4 h-4" />
                        <span>INSPECT CLUE</span>
                      </div>
                    </div>

                    {/* Inspected Marker */}
                    {isItemInspected && (
                      <div className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-investigation-forest/90 border border-brass/40 text-brass flex items-center space-x-1">
                        <span>✓ EXAMINED</span>
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
                    <div className="pt-3 border-t border-investigation-border/60 flex items-center justify-between text-[11px] font-mono text-investigation-muted">
                      <span>LOCATION: {item.origin.split(' ')[0]}</span>
                      <span className="text-brass">CONFIDENCE: {item.confidenceScore}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: RECOVERED LETTERS & ENVELOPES */}
        <section className="space-y-4 pt-4 border-t border-investigation-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-brass-light flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brass" />
              <span>RECOVERED LETTERS & SEALED DISPATCHES</span>
            </h2>
            <span className="text-xs font-mono text-investigation-muted">
              CLICK ANY ENVELOPE TO BREAK SEAL & READ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INTERACTIVE_LETTERS.map((letter) => {
              const isFinal = letter.isFinalLetter;
              return (
                <div
                  key={letter.id}
                  onClick={() => handleOpenLetter(letter)}
                  className={`
                    p-5 rounded-lg border cursor-pointer transition-all transform hover:-translate-y-1 shadow-lg relative flex flex-col justify-between space-y-4
                    ${isFinal
                      ? 'bg-gradient-to-b from-[#251e13] to-[#16120b] border-brass/70 hover:border-brass shadow-brass'
                      : 'bg-investigation-card border-investigation-border hover:border-brass/50'}
                  `}
                >
                  {isFinal && (
                    <div className="absolute -top-3 right-3 stamp-confidential text-[9px] bg-red-950/80 border-brass text-brass">
                      KEY CLUE
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow"
                         style={{ backgroundColor: letter.sealColor }}>
                      {letter.sealText.slice(0, 3)}
                    </div>

                    <h3 className="font-serif font-bold text-sm text-parchment leading-snug">
                      {letter.title}
                    </h3>
                    <p className="text-[11px] font-mono text-brass">
                      FROM: {letter.sender}
                    </p>
                    <p className="text-xs font-sans text-investigation-muted line-clamp-2 italic">
                      "{letter.previewSnippet}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-investigation-border/40 flex items-center justify-between text-[11px] font-mono text-brass-light">
                    <span>{isFinal ? 'SEALED OVERLOOK DISPATCH' : 'OPEN ENVELOPE'}</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: VINTAGE AUDIO SURVEILLANCE EVIDENCE PLAYER */}
        <section className="space-y-4 pt-4 border-t border-investigation-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-brass-light flex items-center space-x-2">
              <Radio className="w-4 h-4 text-brass" />
              <span>RECOVERED AUDIO DISPATCHES & VOICE NOTES</span>
            </h2>
          </div>
          <AudioPlayerWidget />
        </section>

        {/* SECTION 4: PINNED PERSONAL NOTES & CLUES (STICKY NOTES) */}
        <section className="space-y-4 pt-4 border-t border-investigation-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-brass-light flex items-center space-x-2">
              <Pin className="w-4 h-4 text-brass" />
              <span>INVESTIGATOR's FIELD NOTES & PERSONAL QUIRKS</span>
            </h2>
            <span className="text-xs font-mono text-investigation-muted">
              OBSERVATIONS ON HER HABITS & SMILE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONAL_QUIRK_NOTES.map((note) => {
              const bgColors = {
                yellow: 'bg-[#fef9c3] text-[#713f12]',
                pink: 'bg-[#ffe4e6] text-[#881337]',
                cyan: 'bg-[#cffafe] text-[#164e63]',
                green: 'bg-[#dcfce7] text-[#14532d]'
              };

              return (
                <div
                  key={note.id}
                  className={`p-4 rounded shadow-lg border border-black/10 space-y-2.5 transition-transform hover:scale-105 duration-200 ${bgColors[note.color]}`}
                  style={{ transform: `rotate(${note.tiltDegree}deg)` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: note.pinColor }} />
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-75">
                      STICKY NOTE
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xs uppercase tracking-wide">
                    {note.title}
                  </h3>

                  <p className="font-sans text-xs leading-relaxed">
                    {note.content}
                  </p>

                  <div className="pt-2 border-t border-black/10 font-mono text-[10px] italic opacity-85">
                    {note.annotation}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: FINAL NARRATIVE BRIDGE TO ACT III */}
        <section className="p-8 rounded-lg border-2 border-brass/60 bg-investigation-forest/90 shadow-spotlight text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-brass bg-brass/10 text-brass flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="text-2xl font-serif font-black text-parchment">
            READY TO REVEAL WHERE SHE IS?
          </h2>

          <p className="text-xs sm:text-sm font-sans text-investigation-muted max-w-xl mx-auto leading-relaxed">
            The evidence has been examined, the letters unfolded, and the suspect alibis disproven. The scenic overlook awaits.
          </p>

          <div className="pt-2">
            <Link
              to="/gallery"
              onClick={() => soundFx.playAccessGranted()}
              className="px-8 py-3.5 bg-brass hover:bg-brass-light text-charcoal-900 rounded font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-brass inline-flex items-center space-x-2"
            >
              <span>ENTER GALLERY // SUBJECT FOUND</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      {/* Primary Evidence Modal Dialog (Keyboard Accessible & Trapped) */}
      <AnimatePresence>
        {selectedItem && (
          <EvidenceModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      {/* Letter Unfolding Dialog Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterModal
            letter={selectedLetter}
            onClose={() => setSelectedLetter(null)}
            onProceedToFound={handleProceedToFound}
          />
        )}
      </AnimatePresence>


    </motion.div>
  );
};
