import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SCRAPBOOK_PAGES } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';

export const ScrapbookPage: React.FC = () => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = SCRAPBOOK_PAGES[currentPageIndex];

  const handleNextPage = () => {
    if (currentPageIndex < SCRAPBOOK_PAGES.length - 1) {
      soundFx.playKeypress();
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      soundFx.playKeypress();
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="scrapbook" />

      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-investigation-border/60 gap-4">
          <div>
            <div className="text-xs font-mono text-investigation-muted uppercase tracking-widest flex items-center space-x-2 mb-1">
              <BookOpen className="w-4 h-4 text-brass" />
              <span>OPERATION: FIND HER</span>
              <span>//</span>
              <span className="text-brass-light font-bold">RECOVERED SCRAPBOOK ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-parchment">
              THE PHYSICAL SCRAPBOOK
            </h1>
            <p className="text-xs sm:text-sm font-sans text-investigation-muted max-w-xl mt-1">
              A physical keepsake album discovered among her belongings. Filled with candid polaroids, washi tape, tickets, and handwritten memories.
            </p>
          </div>

          {/* Page Turn Controls Indicator */}
          <div className="flex items-center space-x-3 bg-investigation-surface px-4 py-2 rounded-lg border border-investigation-border text-xs font-mono">
            <span>PAGE {currentPageIndex + 1} OF {SCRAPBOOK_PAGES.length}</span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                aria-label="Previous scrapbook page"
                className="p-1.5 rounded hover:bg-investigation-card text-investigation-muted hover:text-brass disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPageIndex === SCRAPBOOK_PAGES.length - 1}
                aria-label="Next scrapbook page"
                className="p-1.5 rounded hover:bg-investigation-card text-investigation-muted hover:text-brass disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* The Physical Scrapbook Book Container */}
        <div className="relative mx-auto max-w-3xl">
          {/* Leather / Fabric Book Spine Effect */}
          <div className="absolute -left-3 inset-y-2 w-6 bg-[#3a2818] rounded-l-lg shadow-2xl border-r-2 border-[#1c120a] hidden sm:block" />

          {/* Book Page Spread */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage.id}
              initial={{ opacity: 0, rotateY: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: shouldReduceMotion ? 0 : 8 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.4 }}
              className="bg-[#fbf6e9] text-[#241e17] rounded-lg shadow-2xl border-2 border-[#d9caa7] p-6 sm:p-12 relative overflow-hidden"
              style={{
                backgroundImage: `radial-gradient(#e5d7b5 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            >
              {/* Paper Binder Holes on Left Edge */}
              <div className="absolute left-2 inset-y-0 flex flex-col justify-around pointer-events-none opacity-40">
                <div className="w-3 h-3 rounded-full bg-[#3a2818] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#3a2818] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#3a2818] shadow-inner" />
              </div>

              {/* Chapter Title & Header */}
              <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-[#cbb892] text-xs font-mono">
                <span className="font-serif font-bold text-base text-[#564223]">
                  {currentPage.chapterTitle}
                </span>
                <span className="text-[#88704c] tracking-wider font-semibold">
                  {currentPage.photoDate}
                </span>
              </div>

              {/* Main Content: Tilted Polaroid with Washi Tape */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left: Polaroid Frame */}
                <div className="md:col-span-7 flex justify-center">
                  <div
                    className="relative bg-white p-4 pb-8 rounded shadow-xl border border-black/10 transform transition-transform hover:scale-105 duration-300 w-full max-w-sm"
                    style={{ transform: `rotate(${currentPage.rotationDegree}deg)` }}
                  >
                    {/* Decorative Washi Tape on Top Center */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 opacity-85 shadow-sm transform rotate-1"
                      style={{ backgroundColor: currentPage.tapeColor }}
                    />

                    {/* Image Area */}
                    <div className="w-full aspect-[4/3] bg-charcoal-900 rounded-sm overflow-hidden relative border border-black/10">
                      <img
                        src={currentPage.imageUrl}
                        alt={currentPage.caption}
                        className="w-full h-full object-cover filter contrast-105"
                      />
                    </div>

                    {/* Handwritten Polaroid Caption */}
                    <p className="font-serif italic text-xs sm:text-sm text-[#382e22] text-center mt-4 px-2 leading-relaxed">
                      "{currentPage.caption}"
                    </p>
                  </div>
                </div>

                {/* Right: Notes, Stickers & Annotations */}
                <div className="md:col-span-5 space-y-6">
                  {/* Handwritten Note Pad */}
                  <div className="bg-[#fffdf7] p-5 rounded border border-[#dfd4b8] shadow-sm transform rotate-1 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-[#8a3333] uppercase font-mono">
                      <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                      <span>INVESTIGATOR ANNOTATION:</span>
                    </div>
                    <p className="font-serif text-xs sm:text-sm text-[#2f271c] leading-relaxed">
                      {currentPage.handwrittenAnnotation}
                    </p>
                  </div>

                  {/* Decorative Stickers Stamp Collection */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#796342] block">
                      ALBUM EMBLEMS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentPage.stickers.map((sticker, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-[#eeddb9] border border-[#d2bc90] text-[11px] font-mono text-[#574426] flex items-center space-x-1 shadow-sm"
                        >
                          <Sparkles className="w-3 h-3 text-[#c5a059]" />
                          <span>{sticker}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Navigation Ribbon */}
              <div className="mt-10 pt-4 border-t border-[#dfd2af] flex items-center justify-between text-xs font-mono text-[#6e5837]">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className="hover:text-[#1d1a16] font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS PAGE</span>
                </button>

                <div className="flex space-x-2">
                  {SCRAPBOOK_PAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      aria-label={`Go to scrapbook page ${idx + 1}`}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentPageIndex === idx
                          ? 'bg-[#c5a059] w-6'
                          : 'bg-[#d8c8a7] hover:bg-[#bba882]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPageIndex === SCRAPBOOK_PAGES.length - 1}
                  className="hover:text-[#1d1a16] font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <span>NEXT PAGE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </motion.div>
  );
};
