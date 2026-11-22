import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, CheckCircle2, Lock, Terminal, Key, FastForward, Heart, FolderOpen } from 'lucide-react';
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

        // Smooth transition to briefing after clearance reveal
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
      className="relative min-h-screen w-full bg-investigation-base flex flex-col justify-between p-4 sm:p-6 md:p-10 overflow-hidden terminal-scanlines selection:bg-brass selection:text-charcoal-900"
    >
      {/* Background Radial Vignette */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Top Header Badge */}
      <header className="relative z-10 flex items-center justify-between border-b border-investigation-border/40 pb-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border border-brass/50 bg-investigation-surface flex items-center justify-center p-1">
            <img src="/seal.svg" alt="Department Seal" className="w-full h-full object-contain opacity-80" />
          </div>
          <div className="text-xs font-mono text-investigation-muted tracking-widest uppercase flex items-center space-x-1.5">
            <span className="text-brass-light font-bold">CASE NO. 012</span>
            <span>//</span>
            <span>OPERATION: FIND HER</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isTypingComplete && (
            <button
              onClick={handleSkipIntro}
              className="text-[11px] font-mono text-investigation-muted hover:text-brass transition-colors flex items-center space-x-1 px-2.5 py-1 rounded border border-brass/20 hover:border-brass/40 bg-investigation-surface/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
              title="Skip intro typing"
            >
              <FastForward className="w-3 h-3 text-brass" />
              <span>SKIP INTRO</span>
            </button>
          )}

          <div className="flex items-center space-x-2 text-[11px] font-mono text-brass-light border border-brass/30 px-2.5 py-1 rounded bg-investigation-surface/60">
            <Lock className="w-3.5 h-3.5 text-brass" />
            <span className="hidden sm:inline">MISSING PERSON DOSSIER</span>
          </div>
        </div>
      </header>

      {/* Main Case-File Visual Presentation Container */}
      <main id="main-content" className="relative z-10 max-w-4xl w-full mx-auto my-auto py-6">
        
        {/* Physical Case File Folder Wrap */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="relative rounded-lg border-2 border-brass/40 bg-investigation-forest/95 shadow-dossier overflow-hidden backdrop-blur-md"
        >
          {/* Top Folder Tab Header */}
          <div className="px-6 py-4 bg-investigation-surface border-b border-investigation-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="stamp-confidential text-xs">
                CONFIDENTIAL CASE FILE
              </span>
              <span className="text-xs font-mono text-investigation-muted">
                URGENT // ALL AGENTS NOTIFIED
              </span>
            </div>

            <div className="text-xs font-mono text-brass-light flex items-center space-x-2">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span>STATUS: MISSING (EXTREMELY ADORABLE)</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Title & Dramatic Hero Briefing */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Copy & Synopsis */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono tracking-widest text-brass uppercase">
                    OFFICIAL SPECIAL DIRECTIVE
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-wide text-parchment leading-tight">
                    OPERATION:<br />
                    <span className="text-brass-light">FIND HER</span>
                  </h1>
                </div>

                <div className="space-y-2 border-l-2 border-brass/50 pl-4 py-1 text-sm font-sans text-investigation-text">
                  <p className="font-semibold text-brass-light italic">
                    "One person missing. Several suspicious individuals. Absolutely no reliable witnesses."
                  </p>
                  <p className="text-xs text-investigation-muted leading-relaxed">
                    Subject was last seen being unnecessarily adorable, laughing at her own jokes, and radiating enough warmth to brighten an entire city block. All normal tracking fails—we need an investigator to review the evidence.
                  </p>
                </div>

                {/* Primary CTA Button: Begin Investigation */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDirectBegin}
                    className="w-full sm:w-auto px-8 py-4 bg-brass hover:bg-brass-light text-charcoal-900 rounded font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-brass flex items-center justify-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-light transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FolderOpen className="w-4 h-4 text-charcoal-900" />
                    <span>BEGIN INVESTIGATION</span>
                    <ArrowRight className="w-4 h-4 text-charcoal-900 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Pinned Missing Person Polaroid Placeholder */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group w-52 sm:w-60 bg-parchment p-3 pt-3 pb-6 rounded shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-parchment-border">
                  {/* Washi Tape Decor */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-brass/70 opacity-80 shadow-sm transform -rotate-1 pointer-events-none" />
                  
                  {/* Missing Stamp */}
                  <div className="absolute top-4 right-4 z-10 stamp-confidential text-[10px] transform rotate-12 bg-red-950/80">
                    MISSING
                  </div>

                  {/* Photo Frame */}
                  <div className="w-full aspect-[4/5] bg-charcoal-800 rounded-sm overflow-hidden relative border border-black/20">
                    <img
                      src={SUBJECT_CASE_DATA.primaryPhotoUrl}
                      alt="Missing Person Subject"
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent pointer-events-none" />
                  </div>

                  {/* Handwritten Polaroid Caption */}
                  <div className="mt-3 text-center">
                    <p className="font-mono text-[11px] text-charcoal-900 font-bold uppercase tracking-wider">
                      {SUBJECT_CASE_DATA.namePlaceholder}
                    </p>
                    <p className="font-serif italic text-[11px] text-red-900 mt-0.5">
                      "Last seen being unnecessarily adorable."
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Teletype Dispatch Stream */}
            <div className="p-4 rounded border border-investigation-border bg-investigation-surface/60 font-mono text-xs">
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-investigation-border/40 text-[11px] text-investigation-muted">
                <Terminal className="w-3.5 h-3.5 text-brass" />
                <span className="text-brass">INCOMING TELEX WIRE</span>
                <span>//</span>
                <span>DISPATCH LOG</span>
              </div>

              <div className="space-y-1.5 min-h-[90px]" aria-live="polite">
                {displayedLines.map((line, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-investigation-text">
                    <span className="text-brass/70 font-bold select-none">&gt;</span>
                    <span className={idx === displayedLines.length - 1 ? "text-brass-light font-semibold" : ""}>
                      {line}
                    </span>
                  </div>
                ))}
                {!isTypingComplete && (
                  <span className="inline-block w-2 h-3.5 bg-brass animate-pulse ml-3 align-middle" aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Agent Access Gate & Clearance Form (Maintained for interactive authorization & test validation) */}
            <AnimatePresence>
              {isTypingComplete && !isGranted && (
                <motion.form
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.4 }}
                  onSubmit={handleSubmit}
                  className="pt-4 border-t border-investigation-border/60 space-y-3 font-mono"
                >
                  <div className="text-xs text-investigation-muted flex items-center justify-between">
                    <span>AGENT CLEARANCE VERIFICATION (OPTIONAL CODE ENTRY):</span>
                    <span className="text-[10px] text-brass/70">OR CLICK 'BEGIN INVESTIGATION' ABOVE</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="relative flex-1">
                      <label htmlFor="clearance-input" className="sr-only">
                        Access Credential (Case Designation or Directive Phrase)
                      </label>
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass" aria-hidden="true">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        id="clearance-input"
                        ref={inputRef}
                        type="text"
                        value={credential}
                        onChange={handleInputChange}
                        placeholder="ENTER CLEARANCE (E.G. EXTRAORDINARY, 012, FINDHER)"
                        disabled={isAuthenticating}
                        autoComplete="off"
                        spellCheck="false"
                        className={`
                          w-full pl-10 pr-4 py-2.5 bg-investigation-surface border rounded text-xs sm:text-sm font-mono tracking-widest text-parchment placeholder-investigation-muted/50 transition-all focus:outline-none
                          ${errorState ? 'border-red-500 ring-1 ring-red-500' : 'border-brass/40 focus:border-brass focus-visible:ring-2 focus-visible:ring-brass'}
                          ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating || !credential.trim()}
                      className="px-5 py-2.5 bg-investigation-card hover:bg-investigation-surface border border-brass text-brass-light hover:text-white rounded font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-40 disabled:cursor-not-allowed shadow-brass-sm"
                    >
                      <span>{isAuthenticating ? 'AUTHORIZING...' : 'AUTHORIZE'}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {errorState && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-center space-x-1.5 text-red-400 font-semibold text-xs pt-1"
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
                  className="p-6 rounded border border-brass bg-investigation-surface/90 text-center space-y-3 shadow-brass font-mono"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-brass bg-brass/10 text-brass mb-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-base sm:text-lg font-serif font-bold text-brass-light tracking-widest">
                    INVESTIGATOR DEPUTIZED — WELCOME TO OPERATION: FIND HER
                  </div>
                  <p className="text-xs text-investigation-muted">
                    OPENING CASE DOSSIER... TRANSITIONING TO CASE BRIEFING...
                  </p>
                  <div className="w-48 h-1 bg-investigation-border rounded-full mx-auto overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: shouldReduceMotion ? 0.01 : 1.0, ease: "easeInOut" }}
                      className="h-full bg-brass"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </main>

      {/* Footer Classification Notice */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-investigation-muted border-t border-investigation-border/40 pt-4 gap-2 max-w-5xl mx-auto w-full">
        <div>OPERATION: FIND HER // CASE NO. 012</div>
        <div className="flex items-center space-x-3">
          <span>CLASSIFICATION: CONFIDENTIAL</span>
          <span>•</span>
          <span>REPUTED AS THE CUTEST MYSTERY EVER</span>
        </div>
      </footer>

    </motion.div>
  );
};
