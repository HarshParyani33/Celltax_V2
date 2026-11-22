import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldAlert, 
  FolderLock, 
  User, 
  Compass, 
  CheckCircle,
  Heart,
  Search,
  AlertCircle
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CASE_DOSSIER_DATA } from '../data/evidence';
import { SUBJECT_CASE_DATA } from '../data/findHerData';
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
    }, 500);
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
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Navigation Breadcrumb / Classification Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-investigation-border/60">
          <div className="flex items-center space-x-2 text-xs font-mono text-investigation-muted">
            <FolderLock className="w-4 h-4 text-brass" />
            <span>OPERATION: FIND HER</span>
            <span>/</span>
            <span className="text-brass-light font-bold">CASE FILE 012-BRIEFING</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="stamp-confidential text-xs">
              CONFIDENTIAL // EYES ONLY
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
                  {CASE_DOSSIER_DATA.caseTitle}
                </h1>
                <p className="text-xs font-mono text-investigation-muted tracking-widest uppercase flex items-center space-x-1.5">
                  <span>OFFICIAL INVESTIGATIVE BRIEFING</span>
                  <span>•</span>
                  <span className="text-brass">CASE NO. 012</span>
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-investigation-muted">
              <div>ASSIGNED: <span className="text-parchment font-semibold">{CASE_DOSSIER_DATA.assignmentDate}</span></div>
              <div>STATUS: <span className="text-red-400 font-semibold">{SUBJECT_CASE_DATA.status}</span></div>
            </div>
          </div>

          {/* Dossier Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Core Subject & Crime Synopsis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Missing Person Polaroid */}
              <div className="md:col-span-4 flex justify-center">
                <div className="w-full max-w-[240px] bg-parchment p-3 pt-3 pb-5 rounded shadow-xl border border-parchment-border transform -rotate-1">
                  <div className="w-full aspect-square bg-charcoal-800 rounded-sm overflow-hidden mb-2 relative">
                    <img
                      src={SUBJECT_CASE_DATA.primaryPhotoUrl}
                      alt="Missing Person Portrait"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute top-2 right-2 stamp-confidential text-[9px] bg-red-950/80">
                      MISSING
                    </div>
                  </div>
                  <div className="text-center font-mono">
                    <div className="text-xs font-bold text-charcoal-900 tracking-wider uppercase">
                      {SUBJECT_CASE_DATA.namePlaceholder}
                    </div>
                    <div className="text-[10px] text-red-900 italic mt-0.5">
                      "Dangerously high levels of charm."
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Case Synopsis */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-md border border-investigation-border bg-investigation-surface/60 font-mono text-xs">
                  <div>
                    <span className="text-investigation-muted uppercase flex items-center space-x-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-brass" />
                      <span>PRIMARY SUBJECT</span>
                    </span>
                    <span className="text-parchment font-semibold">{SUBJECT_CASE_DATA.namePlaceholder}</span>
                  </div>

                  <div>
                    <span className="text-investigation-muted uppercase flex items-center space-x-1.5 mb-1">
                      <Compass className="w-3.5 h-3.5 text-brass" />
                      <span>LAST SEEN LOCATION</span>
                    </span>
                    <span className="text-parchment font-semibold">{SUBJECT_CASE_DATA.lastSeenLocation}</span>
                  </div>

                  <div>
                    <span className="text-investigation-muted uppercase flex items-center space-x-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-brass" />
                      <span>PRIMARY CHARGE</span>
                    </span>
                    <span className="text-red-400 font-semibold">Unnecessary adorableness & spontaneous vanishing</span>
                  </div>

                  <div>
                    <span className="text-investigation-muted uppercase flex items-center space-x-1.5 mb-1">
                      <Heart className="w-3.5 h-3.5 text-red-400" />
                      <span>HEART TRANSGRESSION</span>
                    </span>
                    <span className="text-brass-light font-semibold">Caring too much & lighting up every room</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-investigation-text leading-relaxed font-sans">
                  <h3 className="font-serif font-bold text-brass text-base uppercase tracking-wider">
                    CASE DISPATCH SUMMARY
                  </h3>
                  <p>
                    Earlier today, our subject disappeared under thoroughly suspicious circumstances. Witnesses report she was last seen laughing, ordering an overly customized coffee drink, and talking about scenic mountain overlooks.
                  </p>
                  <p className="text-investigation-muted text-xs">
                    Her closest friends have provided contradictory testimonies, while our top suspects have alibis that are frankly ridiculous. It is up to you, our Lead Investigator, to review the evidence locker, examine the letters, browse her scrapbook, and piece together the trail that leads to her.
                  </p>
                </div>
              </div>

            </div>

            {/* Distinguishing Features Checklist */}
            <div className="space-y-3 pt-4 border-t border-investigation-border/60">
              <h3 className="font-mono text-xs font-bold text-brass uppercase tracking-widest flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-brass" />
                <span>SUBJECT DISTINGUISHING CHARACTERISTICS</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                {SUBJECT_CASE_DATA.distinguishingFeatures.map((trait, idx) => (
                  <div key={idx} className="p-3 rounded bg-investigation-card/70 border border-investigation-border flex items-start space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                    <span className="text-investigation-text leading-relaxed">{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions & Directives */}
            <div className="p-5 rounded-md border border-brass/30 bg-investigation-surface/80 space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-brass font-bold tracking-wider">
                <ShieldAlert className="w-4 h-4 text-brass" />
                <span>INVESTIGATOR RULES OF ENGAGEMENT</span>
              </div>
              <ul className="space-y-2 text-investigation-muted font-sans text-xs">
                {CASE_DOSSIER_DATA.specialInstructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-brass font-mono font-bold select-none">&bull;</span>
                    <span className="text-investigation-text">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Investigation Acceptance Call-To-Action */}
            <div className="pt-6 border-t border-investigation-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-investigation-muted text-center sm:text-left">
                <span className="block text-brass font-semibold">ALL EVIDENCE LOGS UNLOCKED</span>
                <span>Proceed to the Investigation Board to begin examining clues.</span>
              </div>

              <button
                type="button"
                onClick={handleAcceptInvestigation}
                disabled={isAccepted}
                className="w-full sm:w-auto px-8 py-3.5 bg-brass hover:bg-brass-light text-charcoal-900 rounded font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-brass flex items-center justify-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-light disabled:opacity-50"
              >
                <span>{isAccepted ? 'ENTERING BOARD...' : 'ACCEPT INVESTIGATION & OPEN BOARD'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};
