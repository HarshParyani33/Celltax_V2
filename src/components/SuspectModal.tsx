import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Key, Sparkles, MessageSquare } from 'lucide-react';
import { SuspectProfile, WitnessProfile } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { handleTabFocusWrap, restoreFocusSafely } from '../utils/focus';

interface SuspectModalProps {
  person: SuspectProfile | WitnessProfile | null;
  isSuspect: boolean;
  onClose: () => void;
}

export const SuspectModal: React.FC<SuspectModalProps> = ({ person, isSuspect, onClose }) => {
  const [isInterrogated, setIsInterrogated] = React.useState(false);
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
        aria-labelledby="suspect-modal-title"
        aria-describedby="suspect-modal-desc"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-investigation-forest border border-brass/50 rounded-lg shadow-dossier overflow-hidden my-auto font-mono text-xs"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-investigation-surface border-b border-investigation-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-brass">
            <Search className="w-4 h-4" />
            <span id="suspect-modal-title" className="font-bold tracking-wider uppercase text-brass-light">
              {isSuspect ? `SUSPECT INTERROGATION // ${suspect?.codename}` : `WITNESS STATEMENT // ${witness?.name}`}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close interview dossier"
            className="p-1 rounded text-investigation-muted hover:text-parchment hover:bg-investigation-card focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Avatar Photo Frame */}
            <div className="w-28 sm:w-36 aspect-square bg-charcoal-900 rounded border border-brass/40 p-1 shrink-0 overflow-hidden shadow-md">
              <img
                src={person.avatarUrl}
                alt={witness ? witness.name : (suspect?.codename || 'Person')}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-serif font-bold text-parchment">
                {isSuspect ? suspect?.codename : witness?.name}
              </h3>
              <p className="text-xs text-brass">
                {isSuspect ? `KNOWN ALIAS: ${suspect?.realName}` : `RELATIONSHIP: ${witness?.relationship}`}
              </p>
              <p className="text-xs text-investigation-muted font-sans leading-relaxed">
                {isSuspect ? suspect?.aliasDescription : `LAST SEEN WITH SUBJECT NEAR: ${witness?.locationMentioned}`}
              </p>
            </div>
          </div>

          {/* Statement or Alibi Section */}
          <div className="p-4 rounded bg-investigation-surface/80 border border-investigation-border space-y-2">
            <span className="text-[10px] text-brass uppercase tracking-wider block font-bold">
              {isSuspect ? "ALLEGED ALIBI & BEHAVIOR:" : "OFFICIAL WITNESS STATEMENT:"}
            </span>
            <p id="suspect-modal-desc" className="font-serif italic text-sm text-parchment leading-relaxed">
              "{isSuspect ? suspect?.ridiculousAlibi : witness?.statement}"
            </p>
          </div>

          {/* Suspect Interrogation Interactive Dialogue */}
          {isSuspect && (
            <div className="space-y-4">
              {!isInterrogated ? (
                <div className="text-center py-2">
                  <button
                    type="button"
                    onClick={handleInterrogate}
                    className="px-6 py-2.5 rounded bg-brass hover:bg-brass-light text-charcoal-900 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-brass flex items-center space-x-2 mx-auto"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>CONDUCT FORMAL INTERROGATION & REVEAL CONTRADICTION</span>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 rounded bg-black/40 border border-brass/40 space-y-2">
                    <span className="text-[10px] text-brass uppercase tracking-wider block font-bold">
                      INTERROGATION TRANSCRIPT // CROSS-EXAMINATION:
                    </span>
                    <pre className="font-mono text-xs text-investigation-text whitespace-pre-wrap leading-relaxed">
                      {suspect?.interrogationTranscript}
                    </pre>
                  </div>

                  <div className="p-3.5 rounded bg-investigation-highlight/60 border border-brass text-brass-light flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider">NEW CONTRADICTION UNLOCKED:</strong>
                      <span className="font-sans text-xs text-parchment">{suspect?.unlockedClue}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Witness Clue Section */}
          {!isSuspect && witness?.keyClue && (
            <div className="p-3.5 rounded bg-investigation-card border border-brass/50 text-brass-light flex items-start space-x-2.5">
              <Key className="w-4 h-4 text-brass shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase tracking-wider">KEY RECOVERED CLUE:</strong>
                <span className="font-sans text-xs text-parchment">{witness.keyClue}</span>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded bg-investigation-surface border border-investigation-border hover:border-brass/60 text-xs font-mono text-investigation-text hover:text-parchment transition-colors"
            >
              RETURN TO DOSSIER
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
