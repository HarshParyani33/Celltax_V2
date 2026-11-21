import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileCheck2, 
  ArrowRight, 
  ShieldAlert, 
  FolderLock, 
  User, 
  Compass, 
  CheckCircle 
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CASE_DOSSIER_DATA } from '../data/evidence';
import { soundFx } from '../utils/audio';
import { getPageTransition, getDocumentReveal, usePrefersReducedMotion } from '../utils/animations';

export const CaseBriefing: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = usePrefersReducedMotion();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAcceptInvestigation = () => {
    soundFx.playAccessGranted();
    setIsAccepted(true);
    setTimeout(() => {
      navigate('/archive');
    }, 1100);
  };

  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="briefing" />

      {/* Main Briefing Dossier Container */}
      <main
        id="main-content"
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"
      >
        {/* Navigation Breadcrumb / Classification Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-investigation-border/60">
          <div className="flex items-center space-x-2 text-xs font-mono text-investigation-muted">
            <FolderLock className="w-4 h-4 text-brass" />
            <span>ARCHIVE REPOSITORY</span>
            <span>/</span>
            <span className="text-brass-light font-bold">CASE FILE 012-BRIEFING</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="stamp-confidential text-xs">
              TOP SECRET // ULTRA
            </span>
          </div>
        </div>

        {/* The Confidential Case Dossier Physical Document */}
        <motion.div
          variants={getDocumentReveal(shouldReduceMotion)}
          initial="initial"
          animate="animate"
          className="relative bg-investigation-forest border border-brass/40 rounded-lg shadow-dossier overflow-hidden"
        >
          {/* Top Physical Folder Tab Header */}
          <div className="px-6 sm:px-10 py-5 bg-investigation-surface border-b border-investigation-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded border border-brass/50 bg-investigation-base p-1.5 flex items-center justify-center">
                <img src="/seal.svg" alt="Department Crest" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-serif font-black tracking-wider text-brass-light">
                  {CASE_DOSSIER_DATA.caseNumber}
                </h1>
                <p className="text-xs font-mono text-investigation-muted tracking-widest uppercase">
                  THE DEPARTMENT OF EXTRAORDINARY THINGS // CLASSIFIED DOSSIER
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-investigation-muted">
              <div>DISPATCH: <span className="text-parchment font-semibold">{CASE_DOSSIER_DATA.assignmentDate}</span></div>
              <div>SECURITY: <span className="text-red-400 font-semibold">{CASE_DOSSIER_DATA.securityClassification}</span></div>
            </div>
          </div>

          {/* Dossier Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Core Metadata Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-md border border-investigation-border bg-investigation-surface/60 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-investigation-muted uppercase flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-brass" />
                  <span>SUBJECT</span>
                </span>
                <p className="text-sm font-serif font-semibold text-parchment">
                  {CASE_DOSSIER_DATA.subject}
                </p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-investigation-border sm:pl-4">
                <span className="text-investigation-muted uppercase flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-brass" />
                  <span>STATUS</span>
                </span>
                <p className="text-sm font-mono font-bold text-brass">
                  {CASE_DOSSIER_DATA.status} — UNDER INVESTIGATION
                </p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-investigation-border sm:pl-4">
                <span className="text-investigation-muted uppercase flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-brass" />
                  <span>OBJECTIVE</span>
                </span>
                <p className="text-xs font-sans text-investigation-text/90 leading-snug">
                  Identify the connection between a collection of unusual artefacts.
                </p>
              </div>
            </div>

            {/* Formal Case Directive */}
            <div className="space-y-3">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-brass flex items-center space-x-2">
                <span>01. OPERATIONAL DIRECTIVE</span>
              </h2>
              <div className="p-5 rounded-md border-l-2 border-brass bg-investigation-card/70 text-sm font-sans text-investigation-text leading-relaxed">
                <p>
                  A confidential cache of artefacts has been retrieved by Department operatives. 
                  Initial forensics confirm each piece is genuine, yet conventional provenance analysis 
                  fails to explain their concurrent presence in the central vault. 
                  As lead investigator, your assignment is to conduct meticulous visual and metallurgical inspection 
                  of every catalogued item to reconstruct the singular life and journey connecting them.
                </p>
              </div>
            </div>

            {/* Special Investigation Instructions */}
            <div className="space-y-3">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-brass flex items-center space-x-2">
                <span>02. SPECIAL PROTOCOLS & INSTRUCTIONS</span>
              </h2>
              <ul className="space-y-2 text-xs font-mono text-investigation-text">
                {CASE_DOSSIER_DATA.specialInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start space-x-3 p-3 rounded bg-investigation-surface/40 border border-investigation-border/40">
                    <span className="text-brass font-bold">[{idx + 1}]</span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Artefact Summary Notice */}
            <div className="p-4 rounded border border-investigation-border/80 bg-investigation-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brass animate-pulse-subtle" />
                <span className="text-investigation-text">
                  3 PRIMARY EVIDENCE ARTEFACTS CURRENTLY UNSEALED FOR EXAMINATION
                </span>
              </div>
              <span className="text-brass-light font-bold">ARC-012-P / ARC-012-D / ARC-012-M</span>
            </div>

            {/* Accept Investigation CTA Box */}
            <div className="pt-6 border-t border-investigation-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-investigation-muted text-center sm:text-left">
                <span>BY ACCEPTING, YOU ASSUME INVESTIGATIVE CLEARANCE LEVEL 3.</span>
              </div>

              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                onClick={handleAcceptInvestigation}
                disabled={isAccepted}
                className={`
                  w-full sm:w-auto px-8 py-3.5 rounded font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-3 shadow-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass
                  ${isAccepted 
                    ? 'bg-brass text-charcoal-900 border border-brass' 
                    : 'bg-gradient-to-r from-brass via-brass-light to-brass text-charcoal-900 hover:brightness-110 border border-brass-light'}
                `}
              >
                {isAccepted ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-charcoal-900" />
                    <span>INVESTIGATION ACCEPTED — OPENING ARCHIVE...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5 text-charcoal-900" />
                    <span>ACCEPT INVESTIGATION</span>
                    <ArrowRight className="w-4 h-4 text-charcoal-900" />
                  </>
                )}
              </motion.button>
            </div>

          </div>
        </motion.div>

      </main>

      <Footer />
    </motion.div>
  );
};
