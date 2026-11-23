import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { SuspectProfile, WitnessProfile } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';

interface SuspectModalProps {
  person: SuspectProfile | WitnessProfile | null;
  isSuspect: boolean;
  onClose: () => void;
}

export const SuspectModal: React.FC<SuspectModalProps> = ({ person, isSuspect, onClose }) => {
  const [isInterrogated, setIsInterrogated] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (person) {
      triggerRef.current = document.activeElement as HTMLElement;
      setIsInterrogated(false);
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      restoreFocusSafely(triggerRef.current);
    }
  }, [person]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && person) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [person, onClose]);

  if (!person) return null;

  const handleInterrogate = () => {
    soundFx.playAccessGranted();
    setIsInterrogated(true);
  };

  const suspect = isSuspect ? (person as SuspectProfile) : null;
  const witness = !isSuspect ? (person as WitnessProfile) : null;

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
        aria-labelledby="suspect-modal-title"
        aria-describedby="suspect-modal-desc"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#ffffff] border border-[#e8dcce] rounded-3xl shadow-gift overflow-hidden my-auto text-xs"
      >
        {/* Header */}
              <div className="px-6 py-4 bg-[#fbf8f4] border-b border-[#f0e6dc] flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#8c5e58]">
                  <Search className="w-4 h-4 text-[#d99b9b]" />
                  <span id="suspect-modal-title" className="font-serif font-bold tracking-wider uppercase text-sm text-[#38261e]">
                    {isSuspect ? `SUSPECT INTERROGATION // ${suspect?.codename}` : `WITNESS STATEMENT // ${witness?.name}`}
                  </span>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close interview dossier"
                  className="p-1.5 rounded-full text-[#7a685c] hover:text-[#38261e] hover:bg-[#fceeeb] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-6">

                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* Avatar Photo Frame */}
                    <div className="w-28 sm:w-36 aspect-square bg-[#f5eee4] rounded-2xl border border-[#e8dcce] p-1 shrink-0 overflow-hidden shadow-polaroid">
                      <img
                        src={person.avatarUrl}
                        alt={witness ? witness.name : (suspect?.codename || 'Person')}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 flex-1">
                        <div className="space-y-0.5">
                          <h3 className="font-serif font-bold text-xl text-[#38261e]">
                            {witness ? witness.name : suspect?.codename}
                          </h3>
                          <p className="font-mono text-xs text-[#8c5e58]">
                            {witness ? witness.relationship : `ALIAS: ${suspect?.realName}`}
                          </p>
                        </div>

                        <p id="suspect-modal-desc" className="font-sans text-xs sm:text-sm text-[#5c3d2e] leading-relaxed">
                          {witness ? witness.statement : suspect?.aliasDescription}
                        </p>

                        {suspect && (
                          <div className="p-3.5 rounded-xl bg-[#fceeeb]/60 border border-[#d99b9b]/40 text-xs">
                            <span className="font-mono font-bold text-[#9c5460] block mb-1">SUSPICIOUS BEHAVIOR:</span>
                            <span className="text-[#38261e] leading-relaxed">{suspect.suspiciousBehavior}</span>
                          </div>
                        )}
                    </div>
                  </div>

                      {/* Suspect Interrogation Section */}
                      {isSuspect && suspect && (
                        <div className="space-y-4 pt-2 border-t border-[#f0e6dc]">
                          {!isInterrogated ? (
                              <div className="text-center p-6 rounded-2xl bg-[#fdfaf5] border border-[#e8dcce] space-y-3">
                                <p className="font-serif italic text-sm text-[#5c3d2e]">
                                  "This suspect claims complete innocence, but their alibi smells fishy..."
                                </p>
                                <button
                                  type="button"
                                  onClick={handleInterrogate}
                                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d99b9b] to-[#9c5460] hover:brightness-105 text-white font-serif font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 mx-auto"
                                >
                                  <Sparkles className="w-4 h-4" />
                                  <span>CROSS-EXAMINE &amp; BREAK ALIBI</span>
                                </button>
                              </div>
                              ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                              >
                                    <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#e8dcce] space-y-2">
                                      <span className="font-mono font-bold text-[#8c5e58] text-[11px] uppercase">
                                        OFFICIAL INTERROGATION TRANSCRIPT:
                                      </span>
                                      <div className="font-mono text-xs text-[#38261e] whitespace-pre-line leading-relaxed">
                                        {suspect.interrogationTranscript}
                                      </div>
                                    </div>

                                        {suspect.unlockedClue && (
                                          <div className="p-4 rounded-2xl bg-[#eef3ea] border border-[#9caf88]/40 space-y-1 text-xs">
                                            <span className="font-mono font-bold text-[#4f614b] flex items-center space-x-1.5">
                                              <CheckCircle2 className="w-4 h-4 text-[#9caf88]" />
                                              <span>CONTRADICTION DETECTED // NEW CLUE UNLOCKED:</span>
                                            </span>
                                            <p className="font-serif italic text-[#38261e] text-sm pt-1">
                                              "{suspect.unlockedClue}"
                                            </p>
                                          </div>
                  )}
                                    </motion.div>
              )}
                                </div>
          )}

                                      {/* Witness Extended Statement */}
                                      {witness && (
                                        <div className="space-y-3 pt-2 border-t border-[#f0e6dc]">
                                          <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#e8dcce] space-y-1.5">
                                            <span className="font-mono font-bold text-[#8c5e58] text-[11px] uppercase flex items-center space-x-1.5">
                                              <Heart className="w-3.5 h-3.5 text-[#d99b9b] fill-[#d99b9b]" />
                                              <span>SPECIAL MESSAGE FOR HER BIRTHDAY:</span>
                                            </span>
                                            <p className="font-handwriting text-lg text-[#38261e] leading-relaxed">
                                              "You are the brightest light in every room, and having you as a friend is the greatest gift. Don't ever stop being as wonderfully silly, loving, and extraordinary as you are."
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Action Close */}
                                      <div className="pt-2 flex justify-end">
                                        <button
                                          type="button"
                                          onClick={onClose}
                                          className="px-6 py-2 rounded-full bg-[#fbf8f4] hover:bg-[#fceeeb] border border-[#e8dcce] text-xs font-serif font-bold tracking-wider text-[#8c5e58] uppercase transition-colors"
                                        >
                                          CLOSE INTERVIEW
                                        </button>
                                      </div>

                                    </div>
                                  </motion.div>
    </div>
                          );
};
