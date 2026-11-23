import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { LetterData } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';

interface LetterModalProps {
  letter: LetterData | null;
  onClose: () => void;
  onProceedToFound?: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ letter, onClose, onProceedToFound }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (letter) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setIsOpen(false);
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      restoreFocusSafely(triggerElementRef.current);
    }
  }, [letter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && letter) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [letter, onClose]);

  if (!letter) return null;

  const handleOpenEnvelope = () => {
    soundFx.playInspect();
    setIsOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2a1d17]/75 backdrop-blur-md overflow-y-auto"
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          handleTabFocusWrap(e, modalRef.current);
        }
      }}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-modal-title"
        aria-describedby="letter-modal-desc"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#ffffff] border border-[#e8dcce] rounded-3xl shadow-envelope overflow-hidden my-auto"
      >
            {/* Top Header Bar */}
            <div className="px-6 py-4 bg-[#fbf8f4] border-b border-[#f0e6dc] flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-xs font-mono text-[#7a685c]">
                <Mail className="w-4 h-4 text-[#d99b9b]" />
                <span id="letter-modal-title" className="text-[#38261e] font-serif font-bold uppercase tracking-wider">
                  {letter.title}
                </span>
                <span>//</span>
                <span>{letter.unfoldedDate}</span>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close letter"
                className="p-1.5 rounded-full text-[#7a685c] hover:text-[#38261e] hover:bg-[#fceeeb] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Envelope & Letter Content Area */}
              <div className="p-6 sm:p-10 space-y-6">

          <AnimatePresence mode="wait">
                      {!isOpen ? (
                        /* CLOSED PHYSICAL ENVELOPE WITH WAX SEAL */
                        <motion.div
                          key="closed-envelope"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex flex-col items-center justify-center py-6 space-y-6 text-center"
                        >
                          <div
                            onClick={handleOpenEnvelope}
                            className="w-full max-w-md bg-[#fdfbf7] texture-paper border-2 border-[#e8dcce] rounded-2xl p-8 shadow-polaroid relative cursor-pointer hover:border-[#d99b9b] transition-all transform hover:-translate-y-1 group"
                          >
                            {/* Triangular Envelope Flap */}
                            <div className="absolute top-0 inset-x-0 h-20 border-b border-[#e8dcce] bg-[#fbf6ee] [clip-path:polygon(0_0,50%_100%,100%_0)]" />

                            {/* Embossed Wax Seal in Center */}
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 3 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative z-10 w-18 h-18 rounded-full mx-auto my-7 p-3 flex items-center justify-center shadow-lg transition-transform"
                              style={{ backgroundColor: letter.sealColor }}
                            >
                              <div className="w-13 h-13 rounded-full border-2 border-white/40 flex items-center justify-center text-[10px] font-mono font-bold text-white tracking-widest text-center px-1">
                                {letter.sealText}
                              </div>
                            </motion.div>

                                  <div className="text-center space-y-1.5 relative z-10 pt-2">
                                    <p className="font-serif font-bold text-xl text-[#38261e] group-hover:text-[#8c5e58] transition-colors">
                                      {letter.title}
                                    </p>
                                    <p className="text-xs font-mono text-[#7a685c]">
                                      FROM: {letter.sender} ({letter.senderRole})
                                    </p>
                                    <p className="text-xs font-serif italic text-[#8c5e58] pt-2 flex items-center justify-center space-x-1">
                                      <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                                      <span>Click to break wax seal &amp; unfold letter</span>
                                    </p>
                                  </div>
                                </div>

                              <button
                                type="button"
                                onClick={handleOpenEnvelope}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d99b9b] via-[#c58585] to-[#9c5460] text-white font-serif font-bold text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>BREAK SEAL &amp; UNFOLD LETTER</span>
                              </button>
                            </motion.div>
                            ) : (
                            /* UNFOLDED LETTER STATIONERY SHEET */
                            <motion.div
                              key="unfolded-letter"
                              initial={{ opacity: 0, y: 25, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.45, ease: "easeOut" }}
                              className="space-y-6"
                            >
                              {/* Textured Letter Sheet */}
                              <div className="bg-[#fdfbf7] texture-paper text-[#38261e] p-6 sm:p-10 rounded-2xl shadow-polaroid border border-[#e8dcce] space-y-4 font-serif leading-relaxed relative overflow-hidden">

                                {/* Subtle Paper Fold Creases */}
                                <div className="absolute inset-x-0 top-1/3 h-px bg-[#38261e]/5 pointer-events-none" />
                                <div className="absolute inset-x-0 top-2/3 h-px bg-[#38261e]/5 pointer-events-none" />

                                  {/* Letter Header */ }
                                  < div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#e8dcce] text-xs font-mono text-[#7a685c]">
                                <span className="font-bold text-[#8c5e58] flex items-center space-x-1.5">
                                  <Heart className="w-3.5 h-3.5 text-[#d99b9b] fill-[#d99b9b]" />
                                  <span>FROM: {letter.sender}</span>
                                </span>
                                <span>DISPATCH ID: {letter.id}</span>
                              </div>

                              {/* Letter Body Paragraphs */}
                              <div id="letter-modal-desc" className="space-y-4 text-sm sm:text-base text-[#38261e] pt-2 leading-relaxed">
                                {letter.contentParagraphs.map((para, idx) => (
                                  <p key={idx} className={idx === 0 ? "font-serif text-base sm:text-lg italic text-[#38261e] font-semibold" : ""}>
                                    {para}
                                  </p>
                                ))}
                              </div>

                              {/* Handwritten Annotation */}
                              {letter.investigatorAnnotation && (
                                <div className="mt-6 pt-4 border-t border-[#e8dcce] space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8c5e58]">
                                    FIELD OBSERVATION NOTE:
                                  </span>
                                  <p className="font-handwriting text-lg text-[#5c3d2e] italic">
                                    "{letter.investigatorAnnotation}"
                                  </p>
                                </div>
                              )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-2 rounded-full bg-[#fbf8f4] hover:bg-[#fceeeb] border border-[#e8dcce] text-xs font-mono text-[#7a685c] hover:text-[#38261e] transition-colors flex items-center space-x-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>FOLD LETTER &amp; RE-SEAL</span>
                            </button>

                      {letter.isFinalLetter && onProceedToFound ? (
                        <button
                          type="button"
                          onClick={onProceedToFound}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d99b9b] via-[#c58585] to-[#9c5460] text-white font-serif font-bold text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center space-x-2 animate-bounce"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>PROCEED TO SCENIC OVERLOOK // SUBJECT FOUND &rarr;</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-6 py-2 rounded-full bg-[#fbf8f4] hover:bg-[#fceeeb] border border-[#d99b9b] text-[#8c5e58] text-xs font-mono font-bold tracking-wider uppercase transition-colors"
                        >
                          CLOSE LETTER
                        </button>
                      )}
                  </div>
              </motion.div>
            )}
            </AnimatePresence>

          </div>
      </motion.div>
    </div>
  );
};
