import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Sparkles,
  BookOpen,
  Mail,
  Radio,
  Users,
  Compass,
  Heart,
  Pin,
  Lock,
  ArrowRight,
  Gamepad2,
  Gift,
  Smile,
  Bookmark
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
      className="min-h-screen flex flex-col bg-[#faf6f0] text-[#38261e] texture-desk selection:bg-[#d99b9b] selection:text-[#38261e]"
    >
      <Header currentScreen="archive" />

      {/* Main Keepsake Hub Interface */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12"
      >
        {/* Top Board Header & Status Overview */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e8dcce]">
            <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-[#7a685c] mb-2 tracking-wider">
                  <span className="text-[#8c5e58] font-bold">OPERATION: FIND HER</span>
                  <span>•</span>
                  <span>KEEPSAKE HUB // CASE 012</span>
                </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#38261e] tracking-tight flex items-center space-x-3">
                    <span>HER LITTLE WORLD</span>
                    <Heart className="w-6 h-6 text-[#d99b9b] fill-[#d99b9b] inline animate-pulse" />
                  </h1>
                    <p className="text-sm font-sans text-[#7a685c] max-w-2xl mt-2 leading-relaxed">
                      Welcome to the keepsakes, letters, voice notes, and memories collected just for you. Explore each section below to uncover every clue leading to your birthday surprise.
                    </p>
                  </div>

                  {/* Progress / Catalog Counter (Keeps test required text intact) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="px-4 py-2.5 rounded-full bg-[#fbf8f4] border border-[#e8dcce] font-mono text-xs text-[#5c3d2e] flex items-center space-x-2 shadow-sm">
                        <Bookmark className="w-4 h-4 text-[#c5a059]" />
                        <span className="font-semibold">CORE CLUES EXAMINED: {inspectedIds.length} / {EVIDENCE_COLLECTION.length}</span>
                      </div>

                      {isUnlocked ? (
                        <Link
                          to="/gallery"
                          onClick={() => soundFx.playAccessGranted()}
                          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d99b9b] via-[#c58585] to-[#9c5460] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-md hover:shadow-lg animate-bounce"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>ENTER GALLERY // SUBJECT FOUND</span>
                        </Link>
                      ) : (
                          <div className="px-4 py-2 rounded-full bg-[#fbf8f4] border border-[#e8dcce] text-xs font-mono text-[#7a685c] flex items-center space-x-1.5">
                            <Lock className="w-3.5 h-3.5 text-[#7a685c]" />
                            <span>FINAL LETTER LOCKED ({inspectedIds.length}/3)</span>
                          </div>
            )}
                        </div>
        </div>

                      {/* PRIMARY DESTINATIONS: The Keepsake Collection Showcase Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Link
                          to="/scrapbook"
                          onClick={() => soundFx.playKeypress()}
                          className="group p-5 rounded-2xl bg-[#ffffff] border border-[#e8dcce] hover:border-[#d99b9b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#fceeeb] text-[#d99b9b] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <BookOpen className="w-6 h-6" />
                            </div>
                                <div className="space-y-1">
                                  <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors flex items-center space-x-1.5">
                                    <span>The Physical Scrapbook</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#d99b9b] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  <p className="text-xs text-[#7a685c] leading-relaxed">
                                    A real 3D memory album with turning pages, washi tape, stamps, and handwritten memories.
                                  </p>
                                </div>
                              </Link>

                              <a
                                href="#letters-section"
                                onClick={() => soundFx.playKeypress()}
                                className="group p-5 rounded-2xl bg-[#ffffff] border border-[#e8dcce] hover:border-[#d99b9b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4"
                              >
                                <div className="w-12 h-12 rounded-xl bg-[#fdfaf5] text-[#c5a059] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Mail className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors flex items-center space-x-1.5">
                                    <span>Keepsake Letters</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#c5a059] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  <p className="text-xs text-[#7a685c] leading-relaxed">
                                    4 physical wax-sealed envelopes that open, unfold, and reveal affectionate messages.
                                  </p>
                                </div>
                              </a>

                              <a
                                href="#audio-section"
                                onClick={() => soundFx.playKeypress()}
                                className="group p-5 rounded-2xl bg-[#ffffff] border border-[#e8dcce] hover:border-[#d99b9b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4"
                              >
                                <div className="w-12 h-12 rounded-xl bg-[#eef3ea] text-[#9caf88] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Radio className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors flex items-center space-x-1.5">
                                    <span>Voice Notes Deck</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#9caf88] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </div>
                                  <p className="text-xs text-[#7a685c] leading-relaxed">
                                    Vintage cassette deck with rotating spools and audio recordings from your favorite people.
                                  </p>
                                </div>
                              </a>

                              <Link
                                to="/witnesses"
                                onClick={() => soundFx.playKeypress()}
                                className="group p-5 rounded-2xl bg-[#ffffff] border border-[#e8dcce] hover:border-[#d99b9b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4"
                              >
                                  <div className="w-12 h-12 rounded-xl bg-[#fceeeb] text-[#8c5e58] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <Users className="w-6 h-6" />
                                  </div>
                                      <div className="space-y-1">
                                        <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors flex items-center space-x-1.5">
                                          <span>Her People & Suspects</span>
                                          <ArrowRight className="w-3.5 h-3.5 text-[#8c5e58] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-xs text-[#7a685c] leading-relaxed">
                                          Friend testimonies and hilarious fictional suspects with interactive cross-examinations.
                                        </p>
                                      </div>
                                    </Link>

                                    <Link
                                      to="/timeline"
                                      onClick={() => soundFx.playKeypress()}
                                      className="group p-5 rounded-2xl bg-[#ffffff] border border-[#e8dcce] hover:border-[#d99b9b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-[#fdfaf5] text-[#c5a059] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                          <Compass className="w-6 h-6" />
                                        </div>
                                            <div className="space-y-1">
                                              <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors flex items-center space-x-1.5">
                                                <span>The Chronological Trail</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-[#c5a059] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                              </div>
                                                <p className="text-xs text-[#7a685c] leading-relaxed">
                                                  A connected timeline tracing how all the milestones and clues piece together.
                                                </p>
                                              </div>
                                            </Link>

                                            <Link
                                              to="/gallery"
                                              onClick={() => soundFx.playKeypress()}
                                              className="group p-5 rounded-2xl bg-gradient-to-br from-[#fceeeb] via-[#ffffff] to-[#fbf8f4] border border-[#d99b9b]/50 hover:border-[#d99b9b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4"
                                            >
                                              <div className="w-12 h-12 rounded-xl bg-[#d99b9b] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                                <Gift className="w-6 h-6 animate-pulse" />
                                              </div>
                                              <div className="space-y-1">
                                                <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors flex items-center space-x-1.5">
                                                  <span>The Final Surprise</span>
                                                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                                                </div>
                                                <p className="text-xs text-[#7a685c] leading-relaxed">
                                                  The grand scenic reveal at golden hour, photo series, and heartfelt birthday message.
                                                </p>
                                              </div>
                                            </Link>

                                            <Link
                                              to="/game"
                                              onClick={() => soundFx.playKeypress()}
                                              className="group p-5 rounded-2xl bg-gradient-to-br from-[#f5ede2] via-[#ffffff] to-[#fbf8f4] border-2 border-[#c5a059] hover:border-[#8b3a2b] transition-all duration-300 shadow-gift hover:shadow-xl flex items-start space-x-4 col-span-1 md:col-span-2 lg:col-span-3"
                                            >
                                              <div className="w-12 h-12 rounded-xl bg-[#8b3a2b] text-[#faf6f0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                                <Gamepad2 className="w-6 h-6 text-[#d4af37]" />
                                              </div>
                                              <div className="space-y-1 flex-1">
                                                <div className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8b3a2b] transition-colors flex flex-wrap items-center gap-2">
                                                  <span>3D Adventure Prototype (PEAK-Style Characters)</span>
                                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d4af37]/20 text-[#8b3a2b] border border-[#d4af37]/50">9 STYLIZED GLB MODELS</span>
                                                  <ArrowRight className="w-3.5 h-3.5 text-[#8b3a2b] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                </div>
                                                <p className="text-xs text-[#7a685c] leading-relaxed">
                                                  Explore the 3D test room: third-person playable Investigator with WASD movement, sprint, mouse camera orbit, collision sliding, and all 8 witness NPCs with procedural animations.
                                                </p>
                                              </div>
                                            </Link>
                                          </div>

                                                {/* SECTION 1: POLAROID EVIDENCE EXHIBITS (Maintains E2E Test Compatibility) */}
                                                <section className="space-y-6 pt-4">
                                                  <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#e8dcce]">
                                                    <h2 className="text-2xl font-serif font-bold text-[#38261e] flex items-center space-x-2">
                                                      <Pin className="w-5 h-5 text-[#d99b9b] fill-[#d99b9b] transform rotate-12" />
                                                      <span>PINNED FORENSIC EXHIBITS</span>
                                                    </h2>

                                                    {/* Filter Buttons (Required by E2E test: ALL EXHIBITS & PHOTOGRAPHS) */}
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
                      px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]
                      ${isSelected
                        ? 'bg-[#d99b9b] text-white border-[#d99b9b] font-bold shadow-sm'
                        : 'bg-[#ffffff] hover:bg-[#fceeeb] text-[#7a685c] hover:text-[#38261e] border-[#e8dcce]'}
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
                                                          className="group relative flex flex-col rounded-2xl bg-[#ffffff] border border-[#e8dcce] hover:border-[#d99b9b] shadow-polaroid hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
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
                                                            {/* Top Polaroid Accent Bar */}
                                                            <div className="px-5 py-3 bg-[#fbf8f4] border-b border-[#f0e6dc] flex items-center justify-between text-xs font-mono">
                                                              <div className="flex items-center space-x-2">
                                                                <span className={`w-2.5 h-2.5 rounded-full ${isItemInspected ? 'bg-[#9caf88]' : 'bg-[#d99b9b]'}`} />
                                                                <span className="font-bold text-[#8c5e58]">{item.code}</span>
                                                              </div>
                                                                <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#fceeeb] text-[#8c5e58]">
                                                                  {item.type}
                                                                </span>
                                                            </div>

                                                              {/* Exhibit Image */}
                                                              <div className="relative aspect-[4/3] w-full bg-[#f5eee4] overflow-hidden">
                                                                <picture className="w-full h-full">
                                                                  {item.webpUrl && <source srcSet={item.webpUrl} type="image/webp" />}
                                                                  <img
                                                                    src={item.imageUrl}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                  />
                                                                </picture>
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                                                                {isItemInspected && (
                                                                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-mono font-bold text-[#4f614b] shadow-sm flex items-center space-x-1">
                                                                      <span>✓ EXAMINED</span>
                                                                    </div>
                    )}
                                                                  </div>

                                                                  {/* Exhibit Details */}
                                                                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                                                    <div>
                                                                        <h3 className="font-serif font-bold text-[#38261e] text-base group-hover:text-[#8c5e58] transition-colors leading-snug">
                                                                          {item.title}
                                                                        </h3>
                                                                          <p className="text-xs text-[#7a685c] mt-1.5 line-clamp-2 leading-relaxed">
                                                                            {item.summary}
                                                                          </p>
                                                                        </div>

                                                                          <div className="pt-3 border-t border-[#f0e6dc] flex items-center justify-between text-[11px] font-mono text-[#7a685c]">
                                                                            <span>{item.dateDiscovered}</span>
                                                                            <span className="text-[#8c5e58] font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                                                                              <Eye className="w-3.5 h-3.5 inline mr-1" />
                                                                              <span>INSPECT</span>
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                      </motion.div>
                                                                      );
            })}
                                                                    </div>
                                                                  </section>

                                                                        {/* SECTION 2: INTERACTIVE LETTERS & ENVELOPES */}
                                                                        <section id="letters-section" className="space-y-6 pt-6 border-t border-[#e8dcce]">
                                                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                            <div>
                                                                              <h2 className="text-2xl font-serif font-bold text-[#38261e] flex items-center space-x-2">
                                                                                <Mail className="w-5 h-5 text-[#c5a059]" />
                                                                                <span>KEEPSAKE LETTERS & ENVELOPES</span>
                                                                              </h2>
                                                                              <p className="text-xs text-[#7a685c] mt-0.5">
                                                                                Physical envelopes sealed with red wax. Click any letter to break the seal and unfold the note.
                                                                              </p>
                                                                            </div>
                                                                            <span className="text-xs font-mono text-[#8c5e58]">
                                                                              4 CORRESPONDENCE ENVELOPES
                                                                            </span>
                                                                          </div>

                                                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                                                            {INTERACTIVE_LETTERS.map((letter) => {
                                                                              const isFinal = letter.id === 'letter-final';

                                                                              return (
                                                                                <div
                                                                                  key={letter.id}
                                                                                  className={`
                    p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg
                    ${isFinal
                                                                                      ? 'bg-gradient-to-br from-[#fceeeb] via-[#ffffff] to-[#fbf8f4] border-[#d99b9b] hover:border-[#b87383]'
                                                                                      : 'bg-[#ffffff] border-[#e8dcce] hover:border-[#c5a059]'}
                  `}
                                                                                >
                                                                                      <div className="space-y-3">
                                                                                        <div className="flex items-center justify-between">
                                                                                          <div className="w-8 h-8 rounded-full bg-[#fbf8f4] border border-[#e8dcce] flex items-center justify-center font-mono text-xs font-bold text-[#8c5e58]">
                                                                                            {letter.id}
                                                                                          </div>
                                                                                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${isFinal ? 'bg-[#d99b9b] text-white font-bold' : 'bg-[#fbf8f4] text-[#7a685c]'}`}>
                                                                                            {isFinal ? 'FINAL CLUE' : 'SEALED'}
                                                                                          </span>
                                                                                        </div>

                                                                                            <div>
                                                                                              <h3 className="font-serif font-bold text-[#38261e] text-sm">
                                                                                                {letter.title}
                                                                                              </h3>
                                                                                              <div className="text-[11px] font-mono text-[#7a685c] mt-1">
                                                                                                FROM: {letter.sender}
                                                                                              </div>
                                                                                            </div>

                                                                                              <p className="font-handwriting text-base text-[#5c3d2e] italic line-clamp-2 leading-relaxed">
                                                                                                "{letter.previewSnippet}"
                                                                                              </p>
                                                                                          </div>

                                                                                            <button
                                                                                              type="button"
                                                                                              onClick={() => handleOpenLetter(letter)}
                                                                                              className={`
                      w-full py-2.5 rounded-xl font-serif text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5 shadow-sm
                      ${isFinal
                                                                                                  ? 'bg-gradient-to-r from-[#d99b9b] to-[#9c5460] hover:brightness-105 text-white'
                                                                                                  : 'bg-[#fbf8f4] hover:bg-[#fceeeb] text-[#8c5e58] border border-[#e8dcce]'}
                    `}
                                                                                            >
                                                                                              <span>{isFinal ? 'SEALED OVERLOOK DISPATCH' : 'OPEN ENVELOPE'}</span>
                                                                                          <ArrowRight className="w-3.5 h-3.5" />
                                                                                        </button>
                                                                                      </div>
                                                                                      );
            })}
                                                                                    </div>
        </section>

                                                                                {/* SECTION 3: VINTAGE AUDIO KEEPSAKE RECORDER */}
                                                                                <section id="audio-section" className="space-y-4 pt-6 border-t border-[#e8dcce]">
                                                                                  <div className="flex items-center justify-between">
                                                                                      <h2 className="text-2xl font-serif font-bold text-[#38261e] flex items-center space-x-2">
                                                                                        <Radio className="w-5 h-5 text-[#9caf88]" />
                                                                                        <span>VINTAGE VOICE NOTES & CASSETTE KEEPSAKES</span>
                                                                                      </h2>
                                                                                  </div>
                                                                                  <AudioPlayerWidget />
                                                                                </section>

                                                                                      {/* SECTION 4: LITTLE DISCOVERIES & PERSONAL QUIRKS (STICKY NOTES) */}
                                                                                      <section className="space-y-4 pt-6 border-t border-[#e8dcce]">
                                                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                                          <div>
                                                                                            <h2 className="text-2xl font-serif font-bold text-[#38261e] flex items-center space-x-2">
                                                                                              <Smile className="w-5 h-5 text-[#d99b9b]" />
                                                                                              <span>LITTLE DISCOVERIES & OBSERVATIONS</span>
                                                                                            </h2>
                                                                                            <p className="text-xs text-[#7a685c] mt-0.5">
                                                                                              Affectionate field notes documenting the little things that make you completely unforgettable.
                                                                                            </p>
                                                                                          </div>
                                                                                          <span className="text-xs font-mono text-[#8c5e58]">
                                                                                            HER UNIQUE HABITS & SMILE
                                                                                          </span>
                                                                                        </div>

                                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                                          {PERSONAL_QUIRK_NOTES.map((note) => {
                                                                                            const bgColors = {
                yellow: 'bg-[#fefce8] text-[#713f12] border-[#fef08a]',
                                                                                              pink: 'bg-[#fff1f2] text-[#881337] border-[#fecdd3]',
                                                                                              cyan: 'bg-[#ecfeff] text-[#164e63] border-[#a5f3fc]',
                                                                                              green: 'bg-[#f0fdf4] text-[#14532d] border-[#bbf7d0]'
                                                                                            };

                                                                                            return (
                                                                                              <div
                                                                                                key={note.id}
                                                                                                className={`p-5 rounded-2xl shadow-sm hover:shadow-md border space-y-3 transition-transform hover:-translate-y-1 duration-200 ${bgColors[note.color]}`}
                                                                                                style={{ transform: `rotate(${note.tiltDegree}deg)` }}
                                                                                              >
                                                                                                <div className="flex items-center justify-between">
                                                                                                  <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: note.pinColor }} />
                                                                                                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-75">
                                                                                                    KEEPSAKE NOTE
                                                                                                  </span>
                                                                                                </div>

                                                                                                  <h3 className="font-serif font-bold text-sm tracking-wide">
                                                                                                    {note.title}
                                                                                                  </h3>

                                                                                                  <p className="font-sans text-xs leading-relaxed">
                                                                                                    {note.content}
                                                                                                  </p>

                                                                                                    <div className="pt-2 border-t border-black/10 font-handwriting text-base italic opacity-90">
                                                                                                      "{note.annotation}"
                                                                                                    </div>
                                                                                                  </div>
                                                                                                  );
            })}
                                                                                              </div>
        </section>

                                                                                      {/* SECTION 5: FINAL NARRATIVE BRIDGE TO ACT III */}
                                                                                          <section className="p-8 sm:p-12 rounded-3xl border border-[#d99b9b]/50 bg-gradient-to-br from-[#ffffff] via-[#fceeeb]/40 to-[#fdfaf5] shadow-gift text-center space-y-4">
                                                                                            <div className="w-14 h-14 rounded-full border border-[#d99b9b] bg-[#ffffff] text-[#d99b9b] flex items-center justify-center mx-auto shadow-sm">
                                                                                              <Gift className="w-7 h-7 animate-bounce" />
                                                                                            </div>

                                                                                              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#38261e] tracking-tight">
                                                                                                READY TO REVEAL WHERE SHE IS?
                                                                                              </h2>

                                                                                                <p className="text-xs sm:text-sm font-sans text-[#7a685c] max-w-xl mx-auto leading-relaxed">
                                                                                                  The clues have been gathered, the envelopes opened, and the testimonies confirmed. The golden-hour scenic overlook awaits.
                                                                                                </p>

                                                                                                  <div className="pt-3">
                                                                                                    <Link
                                                                                                      to="/gallery"
                                                                                                      onClick={() => soundFx.playAccessGranted()}
                                                                                                      className="px-8 py-4 bg-gradient-to-r from-[#d99b9b] via-[#c58585] to-[#9c5460] hover:brightness-105 text-white rounded-xl font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-md hover:shadow-lg inline-flex items-center space-x-2.5"
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
