import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, CheckCircle2, Lock, Terminal, Key } from 'lucide-react';
import { soundFx } from '../utils/audio';

const TERMINAL_LINES = [
  "INITIALIZING CLASSIFIED ARCHIVE PROTOCOL...",
  "ESTABLISHING SECURE CONNECTION TO CENTRAL VAULT...",
  "AUTHENTICATING TERMINAL NODE // SEC-012...",
  "THE DEPARTMENT OF EXTRAORDINARY THINGS",
  "RESTRICTED ACCESS — CONFIDENTIAL COLLECTION",
  "CASE NO. 012",
  "A new investigation has been assigned to you.",
  "Enter your access credential."
];

// Accepted clearance credentials (configurable placeholder development codes)
const ACCEPTED_CODES = ["EXTRAORDINARY", "012", "CASE012", "CONFIDENTIAL", "ARCHIVE", "AGENT"];

export const AccessTerminal: React.FC = () => {
  const navigate = useNavigate();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [credential, setCredential] = useState('');
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter line sequencing
  useEffect(() => {
    let currentLineIdx = 0;
    const interval = setInterval(() => {
      if (currentLineIdx < TERMINAL_LINES.length) {
        setDisplayedLines((prev) => [...prev, TERMINAL_LINES[currentLineIdx]]);
        soundFx.playKeypress();
        currentLineIdx++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playKeypress();
    setCredential(e.target.value.toUpperCase());
    if (errorState) setErrorState(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim()) return;

    setIsAuthenticating(true);
    soundFx.playKeypress();

    setTimeout(() => {
      const cleanCode = credential.trim().toUpperCase();
      if (ACCEPTED_CODES.includes(cleanCode)) {
        setIsGranted(true);
        setErrorState(null);
        soundFx.playAccessGranted();

        // Smooth transition to briefing after authentication reveal
        setTimeout(() => {
          navigate('/briefing');
        }, 1400);
      } else {
        setIsAuthenticating(false);
        setErrorState("ACCESS DENIED — INVALID CLEARANCE IDENTIFIER");
        soundFx.playAccessDenied();
        inputRef.current?.focus();
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full bg-investigation-base flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-hidden terminal-scanlines">
      
      {/* Background Radial Vignette */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between border-b border-investigation-border/40 pb-4">
        <div className="flex items-center space-x-3">
          <img src="/seal.svg" alt="Department Seal" className="w-8 h-8 opacity-80" />
          <div className="text-xs font-mono text-investigation-muted tracking-widest uppercase">
            SEC-NODE // TERMINAL 012
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-brass-light border border-brass/30 px-2.5 py-1 rounded bg-investigation-surface/60">
          <Lock className="w-3.5 h-3.5 text-brass" />
          <span>SECURITY PROTOCOL ENFORCED</span>
        </div>
      </div>

      {/* Center Console Container */}
      <div className="relative z-10 max-w-3xl w-full mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-lg border border-investigation-border bg-investigation-forest/80 shadow-2xl p-6 sm:p-10 font-mono relative backdrop-blur-sm"
        >
          {/* Subtle Institutional Watermark */}
          <div className="absolute right-6 top-6 opacity-5 pointer-events-none w-48 h-48">
            <img src="/seal.svg" alt="" className="w-full h-full" />
          </div>

          {/* Console Header Bar */}
          <div className="flex items-center space-x-2 border-b border-investigation-border/60 pb-4 mb-6 text-xs text-investigation-muted">
            <Terminal className="w-4 h-4 text-brass" />
            <span className="text-brass-light font-bold">DEPARTMENT SECURE TERMINAL</span>
            <span>//</span>
            <span>CLEARANCE VERIFICATION GATEWAY</span>
          </div>

          {/* Sequenced Text Stream */}
          <div className="space-y-3 min-h-[180px] text-xs sm:text-sm leading-relaxed">
            {displayedLines.map((line, idx) => {
              const isTitle = line.includes("THE DEPARTMENT OF EXTRAORDINARY THINGS");
              const isCase = line.includes("CASE NO. 012");
              const isRestricted = line.includes("RESTRICTED ACCESS");
              const isPrompt = line.includes("Enter your access credential.");

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    ${isTitle ? 'text-base sm:text-xl font-serif font-bold text-brass tracking-wider pt-2' : ''}
                    ${isRestricted ? 'text-xs tracking-widest text-red-400 font-bold' : ''}
                    ${isCase ? 'text-sm font-mono text-parchment-aged tracking-widest font-semibold' : ''}
                    ${isPrompt ? 'text-investigation-text font-semibold pt-2 text-sm sm:text-base' : 'text-investigation-muted'}
                  `}
                >
                  <span className="text-brass/60 mr-2">&gt;</span>
                  {line}
                </motion.div>
              );
            })}

            {/* Blinking Cursor while typing */}
            {!isTypingComplete && (
              <span className="inline-block w-2.5 h-4 bg-brass animate-pulse ml-1 align-middle" />
            )}
          </div>

          {/* Input Form Area */}
          <AnimatePresence>
            {isTypingComplete && !isGranted && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="mt-8 pt-6 border-t border-investigation-border space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={credential}
                      onChange={handleInputChange}
                      placeholder="ENTER CLEARANCE CODE (E.G. EXTRAORDINARY)"
                      disabled={isAuthenticating}
                      autoComplete="off"
                      spellCheck="false"
                      className={`
                        w-full pl-10 pr-4 py-3 bg-investigation-surface border rounded text-sm sm:text-base font-mono tracking-widest text-parchment placeholder-investigation-muted/50 focus:outline-none transition-all
                        ${errorState ? 'border-red-500 ring-1 ring-red-500' : 'border-brass/40 focus:border-brass focus:ring-1 focus:ring-brass'}
                        ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating || !credential.trim()}
                    className="px-6 py-3 bg-investigation-card hover:bg-investigation-surface border border-brass text-brass-light hover:text-white rounded font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brass disabled:opacity-40 disabled:cursor-not-allowed shadow-brass-sm"
                  >
                    <span>{isAuthenticating ? 'AUTHENTICATING...' : 'VERIFY ACCESS'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Validation Feedback & Developer Hint */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 pt-1">
                  {errorState ? (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-1.5 text-red-400 font-semibold"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>{errorState}</span>
                    </motion.div>
                  ) : (
                    <div className="text-investigation-muted text-[11px]">
                      AWAITING 8-CHARACTER SECURITY DESIGNATION
                    </div>
                  )}

                  {/* Configurable Development Hint */}
                  <div className="text-[11px] text-investigation-muted/70 sm:text-right">
                    Demo Clearance: <code className="text-brass/90 bg-investigation-surface px-1.5 py-0.5 rounded border border-investigation-border">EXTRAORDINARY</code> or <code className="text-brass/90 bg-investigation-surface px-1.5 py-0.5 rounded border border-investigation-border">012</code>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Access Granted Animation State */}
          <AnimatePresence>
            {isGranted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 rounded border border-brass bg-investigation-surface/90 text-center space-y-3 shadow-brass"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-brass bg-brass/10 text-brass mb-1">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-brass-light tracking-widest">
                  ACCESS GRANTED — WELCOME AGENT
                </div>
                <p className="text-xs font-mono text-investigation-muted">
                  DECRYPTING CASE NO. 012 DOSSIER... TRANSITIONING TO BRIEFING ROOM...
                </p>
                <div className="w-48 h-1 bg-investigation-border rounded-full mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="h-full bg-brass"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* Footer Classification Notice */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-investigation-muted border-t border-investigation-border/40 pt-4 gap-2">
        <div>AUTHORIZED ACCESS ONLY // PENALTY FOR UNRECORDED ACCESS APPLIES</div>
        <div className="flex items-center space-x-3">
          <span>CLASSIFICATION: CONFIDENTIAL</span>
          <span>•</span>
          <span>EST. ARCHIVE 1984</span>
        </div>
      </div>

    </div>
  );
};
