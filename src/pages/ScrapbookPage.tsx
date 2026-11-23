import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Camera,
  Calendar,
  Flower2,
  Bookmark
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SCRAPBOOK_PAGES } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';

export const ScrapbookPage: React.FC = () => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const totalPages = SCRAPBOOK_PAGES.length;
  const currentPage = SCRAPBOOK_PAGES[currentPageIndex];

  const handleNextPage = () => {
    if (isFlipping || currentPageIndex >= totalPages - 1) return;
    soundFx.playKeypress();
    setFlipDirection('next');
    setIsFlipping(true);
  };

  const handlePrevPage = () => {
      if (isFlipping || currentPageIndex <= 0) return;
      soundFx.playKeypress();
      setFlipDirection('prev');
      setIsFlipping(true);
    };

    const handleAnimationComplete = () => {
      if (flipDirection === 'next') {
        setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
      } else if (flipDirection === 'prev') {
        setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
      }
      setFlipDirection(null);
      setIsFlipping(false);
    };

    // Keyboard Arrow Left/Right Navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          handleNextPage();
        } else if (e.key === 'ArrowLeft') {
          handlePrevPage();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPageIndex, isFlipping]);

    return (
      <motion.div
        variants={getPageTransition(shouldReduceMotion)}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen flex flex-col bg-[#faf6f0] text-[#38261e] texture-desk selection:bg-[#d99b9b] selection:text-[#38261e]"
      >
        <Header currentScreen="scrapbook" />

          <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-between">

            {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#e8dcce] gap-4">
                <div>
                    <div className="text-xs font-mono text-[#7a685c] uppercase tracking-widest flex items-center space-x-2 mb-1">
                      <Bookmark className="w-4 h-4 text-[#d99b9b]" />
                      <span className="text-[#8c5e58] font-bold">KEEPSAKE ALBUM</span>
                      <span>//</span>
                      <span>HER PHYSICAL MEMORY BOOK</span>
                    </div>
                      <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#38261e] tracking-tight flex items-center space-x-2.5">
                        <span>THE PHYSICAL SCRAPBOOK</span>
                        <Flower2 className="w-6 h-6 text-[#d99b9b]" />
                      </h1>
                        <p className="text-xs sm:text-sm font-sans text-[#7a685c] max-w-xl mt-1.5 leading-relaxed">
                          A real physical keepsake album made just for you. Filled with polaroids, washi tape, tickets, and handwritten annotations. Turn the pages to travel through time.
                        </p>
                      </div>

                      {/* Page Turn Controls Indicator */}
                          <div className="flex items-center space-x-3 bg-[#ffffff] px-4 py-2 rounded-full border border-[#e8dcce] text-xs font-mono shadow-sm">
                            <span className="font-bold text-[#8c5e58]">PAGE {currentPageIndex + 1} OF {totalPages}</span>
                            <div className="flex items-center space-x-1 pl-2 border-l border-[#e8dcce]">
                              <button
                                type="button"
                                onClick={handlePrevPage}
                                disabled={currentPageIndex === 0 || isFlipping}
                                aria-label="Previous scrapbook page"
                                className="p-1.5 rounded-full hover:bg-[#fceeeb] text-[#7a685c] hover:text-[#38261e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextPage}
                                disabled={currentPageIndex === totalPages - 1 || isFlipping}
                                aria-label="Next scrapbook page"
                                className="p-1.5 rounded-full hover:bg-[#fceeeb] text-[#7a685c] hover:text-[#38261e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                          {/* PHYSICAL SCRAPBOOK BOOK CONTAINER (3D PERSPECTIVE) */}
                          <div className="relative mx-auto w-full max-w-5xl my-auto perspective-1500 py-4">

                            {/* Leather Book Cover Background with Page Thickness Shadow */}
                            <div className="relative rounded-2xl bg-[#4a3429] p-2.5 sm:p-5 shadow-2xl border-4 border-[#3a251b] overflow-hidden">

                              {/* Stitched Gold Thread Edge on Book Cover */}
                              <div className="absolute inset-2 border border-dashed border-[#c5a059]/40 rounded-xl pointer-events-none" />

                                  {/* Central Book Spine Shadow Crease */}
                                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-black/25 to-transparent z-30 pointer-events-none hidden md:block" />

                                  {/* TWO-PAGE SPREAD CONTAINER */}
                                  <div className="relative grid grid-cols-1 md:grid-cols-2 rounded-xl bg-[#fdfbf7] shadow-inner-dark overflow-hidden min-h-[500px] border border-[#e8dcce]">

                                    {/* LEFT PAGE (Verso): Chapter Context, Memory Note, Stamps */}
                                    <div className="p-6 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e8dcce]/80 bg-[#fdfbf7] texture-paper relative">
                                      {/* Paper Crease Vignette along Spine */}
                                      <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/5 to-transparent pointer-events-none hidden md:block" />

                                            {/* Binder Punch Holes */}
                                            <div className="absolute left-3 inset-y-0 flex flex-col justify-around pointer-events-none opacity-30">
                                              <div className="w-2.5 h-2.5 rounded-full bg-[#4a3429] shadow-inner" />
                                              <div className="w-2.5 h-2.5 rounded-full bg-[#4a3429] shadow-inner" />
                                              <div className="w-2.5 h-2.5 rounded-full bg-[#4a3429] shadow-inner" />
                                            </div>

                                            {/* Left Page Top Header */}
                                            <div className="space-y-2 pb-4 border-b border-[#e8dcce]">
                                              <div className="flex items-center justify-between text-xs font-mono text-[#7a685c]">
                                                <span className="stamp-confidential text-[9px] bg-[#fceeeb]">
                                                  ARCHIVE ENTRY
                                                </span>
                                                <span className="font-semibold text-[#8c5e58] flex items-center space-x-1">
                                                  <Calendar className="w-3 h-3 inline mr-1" />
                                                  {currentPage.photoDate}
                                                </span>
                                              </div>

                                            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#38261e] tracking-tight">
                                              {currentPage.chapterTitle}
                                            </h2>
                                          </div>

                                                {/* Left Page Body: Romantic Reflection Note */}
                                                <div className="my-6 space-y-4">
                                                  <div className="p-4 rounded-xl bg-[#fceeeb]/50 border border-[#d99b9b]/30 space-y-2">
                                                    <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#8c5e58]">
                                                      <Heart className="w-3.5 h-3.5 text-[#d99b9b] fill-current" />
                                                      <span>INVESTIGATOR'S MEMORY NOTE</span>
                                                    </div>
                                                      <p className="font-handwriting text-lg sm:text-xl text-[#38261e] leading-relaxed">
                                                        "{currentPage.handwrittenAnnotation}"
                                                      </p>
                                                  </div>

                                                  {/* Stamp & Sticker Badges */}
                                                  <div className="space-y-2">
                                                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#7a685c]">
                                                        ALBUM EMBLEMS:
                                                      </span>
                                                      <div className="flex flex-wrap gap-2">
                                                        {currentPage.stickers.map((sticker, idx) => (
                                                          <span
                                                            key={idx}
                                                            className="px-3 py-1 rounded-full text-xs font-serif font-semibold bg-[#fbf8f4] border border-[#c5a059]/40 text-[#8c5e58] shadow-sm flex items-center space-x-1.5"
                                                          >
                                                            <Sparkles className="w-3 h-3 text-[#c5a059]" />
                                                            <span>{sticker}</span>
                                                          </span>
                                                        ))}
                                                      </div>
                                                  </div>
                                                </div>

                                                {/* Left Page Bottom Footer */}
                                                <div className="pt-4 border-t border-[#e8dcce] flex items-center justify-between text-xs font-mono text-[#7a685c]">
                                                  <span>BOOK SPREAD // LEFT FOLIO</span>
                                                  <button
                                                    type="button"
                                                    onClick={handlePrevPage}
                                                    disabled={currentPageIndex === 0 || isFlipping}
                                                    className="text-[#8c5e58] font-bold hover:underline disabled:opacity-30 disabled:no-underline flex items-center space-x-1"
                                                  >
                                                    <ChevronLeft className="w-3.5 h-3.5" />
                                                    <span>PREVIOUS PAGE</span>
                                                  </button>
                                                </div>
                                              </div>

                                                {/* RIGHT PAGE (Recto): Mounted Polaroid with Washi Tape */}
                                                <div className="p-6 sm:p-10 flex flex-col justify-between bg-[#fdfbf7] texture-paper relative">
                                                  {/* Paper Crease Vignette along Spine */}
                                                  <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/5 to-transparent pointer-events-none hidden md:block" />

                {/* Right Page Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e8dcce] text-xs font-mono text-[#7a685c]">
                  <span className="flex items-center space-x-1 text-[#8c5e58] font-semibold">
                    <Camera className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>CANDID POLAROID EVIDENCE</span>
                  </span>
                  <span>PLATE NO. 0{currentPageIndex + 1}</span>
                </div>

                {/* Center Mounted Polaroid */ }
                                                      < div className = "my-auto py-4 flex justify-center" >
                                                      <motion.div
                                                        animate={{ rotate: currentPage.rotationDegree }}
                                                        transition={{ duration: 0.4 }}
                                                        className="relative bg-white p-3.5 pt-4 pb-7 rounded-lg shadow-polaroid border border-[#e8dcce] max-w-xs w-full"
                                                      >
                                                        {/* Top Decorative Washi Tape */}
                                                        <div
                                                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 opacity-85 shadow-sm transform rotate-1 pointer-events-none rounded-sm"
                                                          style={{ backgroundColor: currentPage.tapeColor }}
                                                        />

                                                        {/* Polaroid Photo Frame */}
                                                        <div className="w-full aspect-[4/3] bg-[#f5eee4] rounded overflow-hidden relative border border-[#e8dcce]">
                                                          <img
                                                            src={currentPage.imageUrl}
                                                            alt={currentPage.caption}
                                                            className="w-full h-full object-cover filter contrast-105"
                                                          />
                                                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                                                        </div>

                                                        {/* Handwritten Polaroid Caption */}
                                                        <div className="mt-3 text-center px-1">
                                                          <p className="font-handwriting text-base sm:text-lg text-[#38261e] leading-snug">
                                                            "{currentPage.caption}"
                                                          </p>
                                                        </div>
                                                      </motion.div>
                </div>

                                                  {/* Right Page Bottom Navigation */}
                                                  <div className="pt-4 border-t border-[#e8dcce] flex items-center justify-between text-xs font-mono text-[#7a685c]">
                                                    <div className="flex items-center space-x-1.5">
                                                      {SCRAPBOOK_PAGES.map((_, i) => (
                                                        <span
                                                          key={i}
                                                          className={`w-2 h-2 rounded-full transition-all ${i === currentPageIndex ? 'w-5 bg-[#d99b9b]' : 'bg-[#e8dcce]'
                                                            }`}
                                                        />
                                                      ))}
                                                    </div>

                                                    <button
                                                      type="button"
                                                      onClick={handleNextPage}
                                                      disabled={currentPageIndex === totalPages - 1 || isFlipping}
                                                      className="text-[#8c5e58] font-bold hover:underline disabled:opacity-30 disabled:no-underline flex items-center space-x-1"
                                                    >
                                                      <span>NEXT PAGE</span>
                                                      <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>

                                                </div>

                                          </div>

                                          {/* 3D TURNING LEAF ANIMATION OVERLAY */}
                                          <AnimatePresence>
                                            {isFlipping && flipDirection === 'next' && (
                                              <motion.div
                                                initial={{ rotateY: 0 }}
                                                animate={{ rotateY: shouldReduceMotion ? 0 : -180 }}
                                                exit={{ opacity: 0 }}
                                                transition={{
                                                  duration: shouldReduceMotion ? 0.01 : 0.7,
                                                  ease: [0.645, 0.045, 0.355, 1.0]
                                                }}
                                                onAnimationComplete={handleAnimationComplete}
                                                className="absolute inset-y-2.5 sm:inset-y-5 right-2.5 sm:right-5 w-1/2 hidden md:block origin-left-spine transform-style-3d z-40 pointer-events-none"
                                              >
                                                {/* FRONT FACE (Turning Right Page going left) */}
                                                <div className="absolute inset-0 bg-[#fdfbf7] texture-paper rounded-r-xl border border-[#e8dcce] p-6 sm:p-10 shadow-page-flip backface-hidden flex flex-col justify-between">
                                                  <div className="flex items-center justify-between pb-4 border-b border-[#e8dcce] text-xs font-mono text-[#7a685c]">
                                                    <span>TURNING...</span>
                                                    <span>PAGE {currentPageIndex + 1}</span>
                                                  </div>

                                                  <div className="my-auto flex justify-center opacity-80">
                                                    <div className="bg-white p-3 pb-6 rounded shadow border max-w-[200px] w-full text-center">
                                                      <div className="w-full aspect-[4/3] bg-[#f5eee4] rounded overflow-hidden">
                                                        <img src={currentPage.imageUrl} alt="" className="w-full h-full object-cover" />
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Dynamic Shadow Gradient on Front */}
                                                  <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent pointer-events-none" />
                                                </div>

                                                {/* BACK FACE (Verso of the turning page, facing user when rotated > 90deg) */}
                                                <div
                                                  className="absolute inset-0 bg-[#fbf8f4] texture-paper rounded-l-xl border border-[#e8dcce] p-6 sm:p-10 shadow-page-flip backface-hidden flex flex-col justify-between"
                                                  style={{ transform: 'rotateY(180deg)' }}
                                                >
                                                  <div className="flex items-center justify-between pb-4 border-b border-[#e8dcce] text-xs font-mono text-[#7a685c]">
                                                    <span className="font-bold text-[#8c5e58]">CHAPTER REVEAL</span>
                                                    <span>PAGE {currentPageIndex + 2}</span>
                                                  </div>

                                                  <div className="my-auto space-y-3 text-center">
                                                    <Sparkles className="w-8 h-8 text-[#c5a059] mx-auto animate-spin-slow" />
                                                    <p className="font-serif italic text-base text-[#38261e]">
                                                      Turning to the next memory...
                                                    </p>
                                                  </div>

                                                  {/* Dynamic Shadow Gradient on Back */}
                                                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
                                                </div>
                                              </motion.div>
                                            )}

                                            {isFlipping && flipDirection === 'prev' && (
                                              <motion.div
                                                initial={{ rotateY: 0 }}
                                                animate={{ rotateY: shouldReduceMotion ? 0 : 180 }}
                                                exit={{ opacity: 0 }}
                                                transition={{
                                                  duration: shouldReduceMotion ? 0.01 : 0.7,
                                                  ease: [0.645, 0.045, 0.355, 1.0]
                                                }}
                                                onAnimationComplete={handleAnimationComplete}
                                                className="absolute inset-y-2.5 sm:inset-y-5 left-2.5 sm:left-5 w-1/2 hidden md:block origin-right-spine transform-style-3d z-40 pointer-events-none"
                                              >
                                                {/* FRONT FACE (Turning Left Page going right) */}
                                                <div className="absolute inset-0 bg-[#fdfbf7] texture-paper rounded-l-xl border border-[#e8dcce] p-6 sm:p-10 shadow-page-flip backface-hidden flex flex-col justify-between">
                                                  <div className="flex items-center justify-between pb-4 border-b border-[#e8dcce] text-xs font-mono text-[#7a685c]">
                                                    <span>PAGE {currentPageIndex + 1}</span>
                                                    <span>RETURNING...</span>
                                                  </div>

                                                  <div className="my-auto text-center space-y-2">
                                                    <Bookmark className="w-8 h-8 text-[#d99b9b] mx-auto" />
                                                    <p className="font-serif italic text-base text-[#38261e]">
                                                      Returning to previous memory...
                                                    </p>
                                                  </div>

                                                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
                                                </div>

                                                {/* BACK FACE */}
                                                <div
                                                  className="absolute inset-0 bg-[#fbf8f4] texture-paper rounded-r-xl border border-[#e8dcce] p-6 sm:p-10 shadow-page-flip backface-hidden flex flex-col justify-between"
                                                  style={{ transform: 'rotateY(180deg)' }}
                                                >
                                                  <div className="flex items-center justify-between pb-4 border-b border-[#e8dcce] text-xs font-mono text-[#7a685c]">
                                                    <span>PREVIOUS SPREAD</span>
                                                    <span>PAGE {currentPageIndex}</span>
                                                  </div>

                                                  <div className="my-auto text-center">
                                                    <Heart className="w-8 h-8 text-[#d99b9b] fill-current mx-auto" />
                                                  </div>

                                                  <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent pointer-events-none" />
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>

                                        </div>
                                      </div>

                                      {/* Bottom Helper Keyboard Hint */}
                                      <div className="text-center pt-4 text-xs font-mono text-[#7a685c]">
                                        <span className="hidden sm:inline">TIP: USE LEFT &amp; RIGHT ARROW KEYS TO FLIP THROUGH THE SCRAPBOOK</span>
                                      </div>

                                    </main>

                                    <Footer />
                                </motion.div>
                                );
};
