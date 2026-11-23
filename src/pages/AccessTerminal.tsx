import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Gift,
  Sparkles,
  Heart,
  Key,
  FastForward,
  Mail,
  Compass
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';
import { validateClearanceCode } from '../utils/credentials';
import { createTimerTracker } from '../utils/timers';
import { SUBJECT_CASE_DATA } from '../data/findHerData';

const TERMINAL_LINES = [
  "INITIALIZING CONFIDENTIAL DISPATCH PROTOCOL...",
  "LOADING CASE FILE // OPERATION: FIND HER...",
  "CASE NO. 012 // THE SEARCH FOR [HER]...",
  "STATUS: MISSING — LAST SEEN BEING UNNECESSARILY ADORABLE.",
  "WITNESSES: 3 FRIENDS WITH CONFLICTING SNACK THEORIES.",
  "SUSPECTS: MULTIPLE PLAYFUL CULPRITS IDENTIFIED.",
  "One person missing. Several suspicious individuals. Absolutely no reliable witnesses.",
  "Deputizing Lead Investigator: BEGIN INVESTIGATION."
];

export const AccessTerminal: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = usePrefersReducedMotion();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [credential, setCredential] = useState('');
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reusable timer tracker for reliable teardown of active intervals & timeouts
  const timersRef = useRef(createTimerTracker());

  // Typewriter line sequencing with clean interval cancellation for React Strict Mode
  useEffect(() => {
    let lineIdx = 0;
    setDisplayedLines([]);
    setIsTypingComplete(false);

    timersRef.current.setInterval(() => {
      if (lineIdx < TERMINAL_LINES.length) {
        const nextLine = TERMINAL_LINES[lineIdx];
        setDisplayedLines((prev) => [...prev, nextLine]);
        soundFx.playKeypress();
        lineIdx++;
      } else {
        timersRef.current.clearAll();
        setIsTypingComplete(true);
        timersRef.current.addTimeout(() => {
          inputRef.current?.focus();
        }, 80);
      }
    }, 220);

    return () => {
      timersRef.current.clearAll();
    };
  }, []);

  // Skip intro immediately stops the interval and clears any pending timers
  const handleSkipIntro = () => {
    soundFx.playKeypress();
    timersRef.current.clearAll();
    setDisplayedLines(TERMINAL_LINES);
    setIsTypingComplete(true);
    timersRef.current.addTimeout(() => {
      inputRef.current?.focus();
    }, 40);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playKeypress();
    setCredential(e.target.value.toUpperCase());
    if (errorState) setErrorState(null);
  };

  // Direct begin investigation button
  const handleDirectBegin = () => {
    soundFx.playAccessGranted();
    setIsGranted(true);
    setErrorState(null);
    timersRef.current.addTimeout(() => {
      navigate('/briefing');
    }, 1100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = credential.trim().toUpperCase();
    if (!cleanCode) return;

    setIsAuthenticating(true);
    soundFx.playKeypress();

    timersRef.current.addTimeout(() => {
      if (validateClearanceCode(cleanCode)) {
        setIsGranted(true);
        setErrorState(null);
        soundFx.playAccessGranted();

        timersRef.current.addTimeout(() => {
          navigate('/briefing');
        }, 1100);
      } else {
        setIsAuthenticating(false);
        setErrorState("ACCESS DENIED — UNRECOGNIZED CLEARANCE DESIGNATION");
        soundFx.playAccessDenied();
        inputRef.current?.focus();
      }
    }, 400);
  };

  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full bg-[#faf6f0] text-[#38261e] flex flex-col justify-between p-4 sm:p-6 md:p-10 overflow-hidden texture-desk selection:bg-[#d99b9b] selection:text-[#38261e]"
    >
      {/* Subtle Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-10 text-[#d99b9b]/30"
        >
          <Heart className="w-8 h-8 fill-current" />
        </motion.div>
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, 20, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-36 right-16 text-[#c5a059]/35"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-24 left-20 text-[#9caf88]/35"
        >
          <Heart className="w-6 h-6 fill-current" />
        </motion.div>
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-20 right-28 text-[#d99b9b]/25"
        >
          <Sparkles className="w-7 h-7" />
        </motion.div>
      </div>

      {/* Top Header Badge */}
        <header className="relative z-10 flex items-center justify-between border-b border-[#e8dcce] pb-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-[#c5a059]/40 bg-[#ffffff] shadow-sm flex items-center justify-center p-1.5">
                <Gift className="w-5 h-5 text-[#c5a059]" />
              </div>
                <div>
                  <div className="text-xs font-serif font-bold text-[#38261e] tracking-wider uppercase flex items-center space-x-1.5">
                    <span>A PERSONAL BIRTHDAY EXPERIENCE</span>
                    <Heart className="w-3 h-3 text-[#d99b9b] fill-[#d99b9b]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#7a685c]">
                    CASE NO. 012 // OPERATION: FIND HER
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!isTypingComplete && (
                  <button
                    onClick={handleSkipIntro}
                    className="text-[11px] font-mono text-[#7a685c] hover:text-[#38261e] transition-colors flex items-center space-x-1 px-3 py-1 rounded-full border border-[#d99b9b]/40 bg-[#ffffff] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
                    title="Skip intro typing"
                  >
                    <FastForward className="w-3 h-3 text-[#c5a059]" />
                    <span>SKIP INTRO</span>
                  </button>
                )}

                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8c5e58] border border-[#d99b9b]/30 px-3 py-1 rounded-full bg-[#fceeeb]/60">
                    <Mail className="w-3.5 h-3.5 text-[#d99b9b]" />
                    <span>CONFIDENTIAL GIFT DOSSIER</span>
                  </div>
                </div>
              </header>

                {/* Main Gift Cover Presentation Container */}
                <main id="main-content" className="relative z-10 max-w-4xl w-full mx-auto my-auto py-8">

                  {/* Luxury Gift Card Presentation */}
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
                    className="relative rounded-2xl border border-[#e8dcce] bg-[#ffffff] shadow-gift overflow-hidden"
                  >
                          {/* Decorative Silk Ribbon Accent along top */}
                          <div className="h-2 w-full bg-gradient-to-r from-[#d99b9b] via-[#c5a059] to-[#d99b9b]" />

                          {/* Card Header Subtitle */}
                          <div className="px-6 sm:px-10 py-4 bg-[#fbf8f4] border-b border-[#f0e6dc] flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center space-x-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#d99b9b] animate-ping" />
                              <span className="text-xs font-mono font-semibold tracking-wider text-[#8c5e58] uppercase">
                                SPECIAL INVITATION // FOR HER EYES ONLY
                              </span>
                            </div>

                              <div className="text-xs font-serif italic text-[#7a685c] flex items-center space-x-1.5">
                                <span>"The cutest mystery waiting to be unraveled"</span>
                              </div>
                            </div>

                            <div className="p-6 sm:p-10 space-y-8">

                              {/* Title & Dramatic Hero Invitation */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                                      {/* Left Column: Personal Message & Begin Action */}
                                      <div className="md:col-span-8 space-y-5 text-left">
                                        <div className="space-y-2">
                                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#fceeeb] text-[#8c5e58] font-mono text-[11px] font-semibold">
                                            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                                            <span>A LITTLE WORLD CREATED JUST FOR YOU</span>
                                          </div>

                                            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#38261e] leading-tight">
                                              For Someone Truly <br />
                                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c5e58] via-[#d99b9b] to-[#c5a059]">
                                                Extraordinary.
                                              </span>
                                            </h1>
                                        </div>

                                            <div className="space-y-3 text-sm sm:text-base font-sans text-[#5c3d2e] leading-relaxed border-l-2 border-[#d99b9b]/60 pl-4 py-1">
                                              <p className="font-serif italic text-[#38261e] text-base sm:text-lg">
                                                "One person missing. Several suspicious individuals. Absolutely no reliable witnesses."
                                              </p>
                                                <p className="text-xs sm:text-sm text-[#7a685c]">
                                                  Subject was last seen being unnecessarily adorable, laughing at her own jokes, and radiating enough warmth to brighten an entire city. Someone who loves you made this little world to celebrate you.
                                                </p>
                                            </div>

                                              {/* Primary Gift Open Button */}
                                              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                <button
                                                  type="button"
                                                  onClick={handleDirectBegin}
                                                  className="px-8 py-4 bg-gradient-to-r from-[#d99b9b] via-[#c58585] to-[#9c5460] hover:brightness-105 text-white rounded-xl font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] transform hover:-translate-y-0.5 active:translate-y-0"
                                                >
                                                  <Gift className="w-4 h-4 text-white animate-bounce" />
                                                  <span>OPEN YOUR GIFT // BEGIN INVESTIGATION</span>
                                                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Right Column: Polaroid of Subject */}
                                            <div className="md:col-span-4 flex justify-center">
                                                <div className="relative group w-52 sm:w-60 bg-[#ffffff] p-3.5 pt-4 pb-7 rounded-lg shadow-polaroid transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-[#e8dcce]">
                                                  {/* Washi Tape Accent */}
                                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 washi-tape-rose transform -rotate-1 pointer-events-none rounded-sm" />

                                                    {/* Heart Badge Stamp */}
                                                    <div className="absolute top-4 right-4 z-10 stamp-confidential text-[9px] transform rotate-6 bg-[#fceeeb]">
                                                      HER DOSSIER
                                                    </div>

                                                    {/* Photo Frame */}
                                                      <div className="w-full aspect-[4/5] bg-[#f5eee4] rounded overflow-hidden relative border border-[#e8dcce]">
                                                        <img
                                                          src={SUBJECT_CASE_DATA.primaryPhotoUrl}
                                                          alt="The Birthday Girl"
                                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                                                      </div>

                                                      {/* Handwritten Polaroid Caption */}
                                                          <div className="mt-3.5 text-center">
                                                            <p className="font-serif text-sm font-bold text-[#38261e]">
                                                              {SUBJECT_CASE_DATA.namePlaceholder}
                                                            </p>
                                                              <p className="font-handwriting text-base text-[#8c5e58] mt-0.5">
                                                                "Last seen being unnecessarily adorable."
                                                              </p>
                                                          </div>
                                                      </div>
                                                    </div>

                                                  </div>

                                                      {/* Teletype Dispatch Stream (Maintains required line stability for tests) */}
                                                      <div className="p-4 rounded-xl border border-[#e8dcce] bg-[#fdfaf5] font-mono text-xs shadow-inner-dark">
                                                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e8dcce]/60 text-[11px] text-[#7a685c]">
                                                          <div className="flex items-center space-x-2">
                                                            <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                                                            <span className="font-bold text-[#8c5e58]">INCOMING DISPATCH STREAM</span>
                                                            <span>//</span>
                                                            <span>CASE CLUE LOG</span>
                                                          </div>
                                                          <span className="text-[10px] text-[#9c5460]">8 OF 8 DISPATCHES</span>
                                                        </div>

                                                        <div className="space-y-1.5 min-h-[90px]" aria-live="polite">
                                                          {displayedLines.map((line, idx) => (
                                                                <div key={idx} className="flex items-start space-x-2 text-[#5c3d2e]">
                                                                  <span className="text-[#c5a059] font-bold select-none">&gt;</span>
                                                                  <span className={idx === displayedLines.length - 1 ? "text-[#38261e] font-semibold" : ""}>
                                                                    {line}
                                                                  </span>
                                                                </div>
                ))}
                                                                {!isTypingComplete && (
                  <span className="inline-block w-2 h-3.5 bg-[#c5a059] animate-pulse ml-3 align-middle" aria-hidden="true" />
                                                                )}
                                                            </div>
            </div>

                                                        {/* Clearance Form (Kept accessible for direct code entry & test compatibility) */}
                                                        <AnimatePresence>
                                                          {isTypingComplete && !isGranted && (
                                                            <motion.form
                                                              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                                              animate={{ opacity: 1, y: 0 }}
                                                              transition={{ duration: shouldReduceMotion ? 0.01 : 0.4 }}
                                                              onSubmit={handleSubmit}
                                                              className="pt-4 border-t border-[#f0e6dc] space-y-3 font-mono"
                                                            >
                                                                <div className="text-xs text-[#7a685c] flex items-center justify-between">
                                                                  <span>OPTIONAL SECRET CODE ENTRY (OR CLICK 'OPEN YOUR GIFT' ABOVE):</span>
                                                                  <span className="text-[10px] text-[#8c5e58]">COZY EASTER EGG</span>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                                                                  <div className="relative flex-1">
                                                                    <label htmlFor="clearance-input" className="sr-only">
                                                                      Access Credential (Case Designation or Directive Phrase)
                                                                    </label>
                                                                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]" aria-hidden="true">
                                                                        <Key className="w-4 h-4" />
                                                                      </div>
                                                                      <input
                                                                        id="clearance-input"
                                                                        ref={inputRef}
                                                                        type="text"
                                                                        value={credential}
                                                                        onChange={handleInputChange}
                                                                        placeholder="ENTER CLEARANCE (E.G. FINDHER, 012)"
                                                                        disabled={isAuthenticating}
                                                                        autoComplete="off"
                                                                        spellCheck="false"
                                                                        className={`
                          w-full pl-10 pr-4 py-2.5 bg-[#ffffff] border rounded-lg text-xs sm:text-sm font-mono tracking-widest text-[#38261e] placeholder-[#7a685c]/50 transition-all focus:outline-none
                          ${errorState ? 'border-red-400 ring-1 ring-red-400' : 'border-[#e8dcce] focus:border-[#c5a059] focus-visible:ring-2 focus-visible:ring-[#c5a059]'}
                          ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                                                                      />
                                                                    </div>

                                                                    <button
                                                                      type="submit"
                                                                      disabled={isAuthenticating || !credential.trim()}
                                                                      className="px-6 py-2.5 bg-[#fbf8f4] hover:bg-[#fceeeb] border border-[#d99b9b] text-[#8c5e58] rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                                                    >
                                                                      <span>{isAuthenticating ? 'VERIFYING...' : 'AUTHORIZE'}</span>
                                                                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                                                    </button>
                                                                  </div>

                                                                  {errorState && (
                                                                    <div
                                                                      role="alert"
                                                                      aria-live="assertive"
                                                                      className="flex items-center space-x-1.5 text-red-500 font-semibold text-xs pt-1"
                                                                    >
                                                                      <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                                                                      <span>{errorState}</span>
                                                                    </div>
                                                                  )}
                                                                </motion.form>
              )}
                                                              </AnimatePresence>

                                                              {/* Access Granted Animation State */}
                                                              <AnimatePresence>
                                                                {isGranted && (
                                                                  <motion.div
                                                                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="p-6 rounded-xl border border-[#c5a059]/40 bg-[#fbf8f4] text-center space-y-3 shadow-md font-mono"
                                                                  >
                                                                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059] mb-1">
                                                                        <CheckCircle2 className="w-6 h-6" />
                                                                      </div>
                                                                        <div className="text-base sm:text-lg font-serif font-bold text-[#38261e] tracking-wide">
                                                                          GIFT UNLOCKED — WELCOME TO HER LITTLE WORLD
                                                                        </div>
                                                                          <p className="text-xs text-[#7a685c]">
                                                                            OPENING CASE DOSSIER... TRANSITIONING TO THE BRIEFING...
                                                                          </p>
                                                                            <div className="w-48 h-1 bg-[#e8dcce] rounded-full mx-auto overflow-hidden">
                                                                              <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: "100%" }}
                                                                                transition={{ duration: shouldReduceMotion ? 0.01 : 1.0, ease: "easeInOut" }}
                                                                                className="h-full bg-[#d99b9b]"
                                                                              />
                                                                            </div>
                                                                          </motion.div>
              )}
                                                                        </AnimatePresence>

                                                                      </div>
                                                                  </motion.div>
      </main>

                                                              {/* Footer Classification Notice */}
                                                                <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#7a685c] border-t border-[#e8dcce] pt-4 gap-2 max-w-5xl mx-auto w-full">
                                                                  <div>OPERATION: FIND HER // CASE NO. 012</div>
                                                                  <div className="flex items-center space-x-3">
                                                                    <span>CLASSIFICATION: CONFIDENTIAL</span>
                                                                    <span>•</span>
                                                                    <span>A CELEBRATION OF ONE EXTRAORDINARY HUMAN</span>
                                                                  </div>
                                                                </footer>

                                                              </motion.div>
                                                              );
};
