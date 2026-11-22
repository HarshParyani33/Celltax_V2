import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MailOpen, Sparkles } from 'lucide-react';
import { LetterData } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';

interface LetterModalProps {
  letter: LetterData | null;
  onClose: () => void;
  onProceedToFound?: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ letter, onClose, onProceedToFound }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (letter) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      setIsOpen(false); // start closed for envelope opening effect
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-900/90 backdrop-blur-md overflow-y-auto"
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
        className="w-full max-w-2xl bg-investigation-forest border border-brass/50 rounded-lg shadow-dossier overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-investigation-surface border-b border-investigation-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-investigation-muted">
            <Mail className="w-4 h-4 text-brass" />
            <span className="text-brass-light font-bold uppercase">{letter.title}</span>
            <span>//</span>
            <span>{letter.unfoldedDate}</span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close letter"
            className="p-1 rounded text-investigation-muted hover:text-parchment hover:bg-investigation-card focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Envelope & Letter Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {!isOpen ? (
            /* CLOSED ENVELOPE PRESENTATION */
            <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
              <div 
                onClick={handleOpenEnvelope}
                className="w-full max-w-md bg-[#1d2721] border-2 border-brass/40 rounded-lg p-8 shadow-2xl relative cursor-pointer hover:border-brass transition-all transform hover:-translate-y-1 group"
              >
                {/* Triangular Envelope Flap */}
                <div className="absolute top-0 inset-x-0 h-16 border-b-2 border-brass/20 bg-[#16211a] [clip-path:polygon(0_0,50%_100%,100%_0)]" />
                
                {/* Wax Seal in Center */}
                <div className="relative z-10 w-16 h-16 rounded-full mx-auto my-6 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                     style={{ backgroundColor: letter.sealColor }}>
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-[10px] font-mono font-bold text-white tracking-widest">
                    {letter.sealText}
                  </div>
                </div>

                <div className="text-center space-y-1 relative z-10 pt-2">
                  <p className="font-serif font-bold text-lg text-parchment group-hover:text-brass-light transition-colors">
                    {letter.title}
                  </p>
                  <p className="text-xs font-mono text-investigation-muted">
                    FROM: {letter.sender} ({letter.senderRole})
                  </p>
                  <p className="text-[11px] font-mono text-brass italic mt-3 animate-pulse">
                    [ CLICK TO BREAK WAX SEAL & UNFOLD LETTER ]
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenEnvelope}
                className="px-6 py-2.5 rounded bg-brass hover:bg-brass-light text-charcoal-900 font-serif font-bold text-xs tracking-widest uppercase transition-all shadow-brass flex items-center space-x-2"
              >
                <MailOpen className="w-4 h-4" />
                <span>UNFOLD LETTER</span>
              </button>
            </div>
          ) : (
            /* UNFOLDED LETTER PRESENTATION */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Aged Textured Paper Sheet */}
              <div className="bg-[#fcf8ef] text-[#1d1a16] p-6 sm:p-10 rounded shadow-2xl border border-[#d5c497] space-y-4 font-serif leading-relaxed relative">
                {/* Paper Crease Effect */}
                <div className="absolute inset-x-0 top-1/3 h-px bg-black/5 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-black/5 pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#dfd2af] text-xs font-mono text-[#736348]">
                  <span>DISPATCH: {letter.sender}</span>
                  <span>RECORD NO. {letter.id}</span>
                </div>

                <div id="letter-modal-desc" className="space-y-4 text-sm sm:text-base text-[#2c261e] pt-2">
                  {letter.contentParagraphs.map((para, idx) => (
                    <p key={idx} className={idx === 0 ? "font-bold text-[#1a1713]" : ""}>
                      {para}
                    </p>
                  ))}
                </div>

                {letter.investigatorAnnotation && (
                  <div className="mt-6 pt-4 border-t border-[#dfd2af] font-mono text-xs text-[#8e2b2b] italic flex items-start space-x-2">
                    <span className="font-bold uppercase tracking-wider">[INVESTIGATOR NOTE]:</span>
                    <span>{letter.investigatorAnnotation}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded bg-investigation-surface border border-investigation-border text-xs font-mono text-investigation-muted hover:text-parchment"
                >
                  &larr; FOLD LETTER & RE-SEAL
                </button>

                {letter.isFinalLetter && onProceedToFound ? (
                  <button
                    type="button"
                    onClick={onProceedToFound}
                    className="px-6 py-2.5 rounded bg-brass hover:bg-brass-light text-charcoal-900 font-serif font-bold text-xs tracking-widest uppercase transition-all shadow-brass flex items-center space-x-2 animate-bounce"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>PROCEED TO SCENIC OVERLOOK // SUBJECT FOUND &rarr;</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded bg-investigation-card border border-brass text-brass-light hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors"
                  >
                    RETURN TO BOARD
                  </button>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
