import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  User,
  Compass,
  Heart,
  Sparkles,
  Smile,
  Coffee,
  CheckCircle2,
  FolderHeart
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
  }, 450);
};

return (
  <motion.div
    variants={getPageTransition(shouldReduceMotion)}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-screen flex flex-col bg-[#faf6f0] text-[#38261e] texture-desk selection:bg-[#d99b9b] selection:text-[#38261e]"
  >
    <Header currentScreen="briefing" />

    {/* Main Briefing Dossier Container */}
    <main
      id="main-content"
      className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Navigation Breadcrumb / Classification Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#e8dcce]">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#7a685c]">
              <FolderHeart className="w-4 h-4 text-[#d99b9b]" />
              <span>OPERATION: FIND HER</span>
              <span>/</span>
              <span className="text-[#38261e] font-semibold">CASE FILE 012: THE BIRTHDAY DISPATCH</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="stamp-confidential text-xs">
                TOP SECRET // BIRTHDAY SPECIAL
              </span>
            </div>
          </div>

          {/* The Keepsake Case Dossier Document */}
          <motion.div
            variants={getDocumentReveal(shouldReduceMotion)}
            initial="initial"
            animate="animate"
            className="relative bg-[#ffffff] border border-[#e8dcce] rounded-2xl shadow-gift overflow-hidden"
          >
              {/* Top Folder Header Ribbon */}
              <div className="px-6 sm:px-10 py-5 bg-[#fbf8f4] border-b border-[#f0e6dc] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 rounded-full border border-[#c5a059]/40 bg-[#ffffff] p-2 flex items-center justify-center shadow-sm">
                      <Heart className="w-6 h-6 text-[#d99b9b] fill-[#d99b9b]" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl font-serif font-black tracking-tight text-[#38261e]">
                          {CASE_DOSSIER_DATA.caseTitle}
                        </h1>
                          <p className="text-xs font-mono text-[#7a685c] tracking-wider uppercase flex items-center space-x-2 mt-0.5">
                            <span className="text-[#8c5e58] font-bold">CASE DIRECTIVE NO. 012</span>
                            <span>•</span>
                            <span>THE MYSTERY OF THE EXTRAORDINARY BIRTHDAY GIRL</span>
                          </p>
                        </div>
                    </div>

                      <div className="text-right font-mono text-xs text-[#7a685c]">
                        <div>ASSIGNED TO: <span className="text-[#38261e] font-bold">YOU (LEAD INVESTIGATOR)</span></div>
                        <div>STATUS: <span className="text-[#9c5460] font-bold">MISSING // EXTREMELY ADORABLE</span></div>
                      </div>
                    </div>

                    {/* Dossier Body Content */}
                    <div className="p-6 sm:p-10 space-y-8">

                        {/* Core Subject & Story Synopsis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                          {/* Left Column: Missing Person Polaroid */}
                          <div className="md:col-span-4 flex justify-center">
                                <div className="w-full max-w-[240px] bg-[#ffffff] p-3.5 pt-3.5 pb-6 rounded-lg shadow-polaroid border border-[#e8dcce] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                                  <div className="w-full aspect-[4/5] bg-[#f5eee4] rounded overflow-hidden mb-2.5 relative border border-[#e8dcce]">
                                    <img
                                      src={SUBJECT_CASE_DATA.primaryPhotoUrl}
                                      alt="The Birthday Girl Portrait"
                                      className="w-full h-full object-cover"
                                    />
                                      <div className="absolute top-2 right-2 stamp-confidential text-[9px] bg-[#fceeeb]">
                                        WANTED
                                      </div>
                                    </div>
                                    <div className="text-center font-mono">
                                        <div className="font-serif text-sm font-bold text-[#38261e]">
                                          {SUBJECT_CASE_DATA.namePlaceholder}
                                        </div>
                                          <div className="font-handwriting text-base text-[#8c5e58] mt-0.5">
                                            "Dangerously high levels of charm."
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right Column: Case Synopsis */}
                                            <div className="md:col-span-8 space-y-5">
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[#e8dcce] bg-[#fbf8f4] font-mono text-xs">
                                                <div className="space-y-1">
                                                  <span className="text-[#7a685c] uppercase flex items-center space-x-1.5 text-[11px]">
                                                    <User className="w-3.5 h-3.5 text-[#c5a059]" />
                                                    <span>PRIMARY SUBJECT</span>
                                                  </span>
                                                  <span className="text-[#38261e] font-bold text-sm">{SUBJECT_CASE_DATA.namePlaceholder}</span>
                                                </div>

                                                    <div className="space-y-1">
                                                      <span className="text-[#7a685c] uppercase flex items-center space-x-1.5 text-[11px]">
                                                        <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                                                        <span>LAST SEEN LOCATION</span>
                                                      </span>
                                                      <span className="text-[#38261e] font-bold text-xs">{SUBJECT_CASE_DATA.lastSeenLocation}</span>
                                                    </div>

                                                        <div className="space-y-1 pt-1">
                                                          <span className="text-[#7a685c] uppercase flex items-center space-x-1.5 text-[11px]">
                                                            <Coffee className="w-3.5 h-3.5 text-[#d99b9b]" />
                                                            <span>ALLEGED OFFENSE</span>
                                                          </span>
                                                          <span className="text-[#8c5e58] font-bold">Unnecessary adorableness & spontaneous vanishing</span>
                                                        </div>

                                                            <div className="space-y-1 pt-1">
                                                              <span className="text-[#7a685c] uppercase flex items-center space-x-1.5 text-[11px]">
                                                                <Smile className="w-3.5 h-3.5 text-[#9caf88]" />
                                                                <span>HEART TRANSGRESSION</span>
                                                              </span>
                                                              <span className="text-[#9caf88] font-bold">Caring too much & lighting up every room</span>
                                                            </div>
                                                        </div>

                                                            <div className="space-y-2 text-xs sm:text-sm text-[#5c3d2e] leading-relaxed font-sans">
                                                              <h3 className="font-serif font-bold text-[#38261e] text-base uppercase tracking-wider flex items-center space-x-2">
                                                                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                                                                <span>CASE DISPATCH SUMMARY</span>
                                                              </h3>
                                                              <p>
                                                                Earlier today, our subject disappeared under thoroughly suspicious circumstances. Witnesses report she was last seen laughing, ordering an overly customized coffee drink, and talking about scenic mountain overlooks.
                                                              </p>
                                                                <p className="text-[#7a685c] text-xs">
                                                                  Her closest friends have provided contradictory testimonies, while our top suspects have alibis that are frankly ridiculous. It is up to you, our Lead Investigator, to review the evidence locker, examine the letters, browse her scrapbook, and piece together the trail that leads to her.
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* Distinguishing Features Checklist */}
                                                        <div className="space-y-3 pt-4 border-t border-[#f0e6dc]">
                                                          <h3 className="font-mono text-xs font-bold text-[#8c5e58] uppercase tracking-widest flex items-center space-x-2">
                                                            <Heart className="w-3.5 h-3.5 text-[#d99b9b] fill-[#d99b9b]" />
                                                            <span>SUBJECT DISTINGUISHING CHARACTERISTICS</span>
                                                          </h3>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                                                              {SUBJECT_CASE_DATA.distinguishingFeatures.map((trait, idx) => (
                                                                  <div key={idx} className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#e8dcce] flex items-start space-x-3 shadow-sm hover:border-[#d99b9b] transition-colors">
                                                                    <CheckCircle2 className="w-4 h-4 text-[#d99b9b] shrink-0 mt-0.5" />
                                                                    <span className="text-[#38261e] leading-relaxed">{trait}</span>
                                                                  </div>
                ))}
                                                                </div>
            </div>

                                                                {/* Rules of Engagement */}
                                                                <div className="p-5 rounded-xl border border-[#c5a059]/40 bg-[#fbf8f4] space-y-3 font-mono text-xs">
                                                                  <div className="flex items-center space-x-2 text-[#38261e] font-bold tracking-wider font-serif text-sm">
                                                                    <Sparkles className="w-4 h-4 text-[#c5a059]" />
                                                                    <span>INVESTIGATOR RULES OF ENGAGEMENT</span>
                                                                  </div>
                                                                    <ul className="space-y-2 text-[#7a685c] font-sans text-xs">
                                                                      {CASE_DOSSIER_DATA.specialInstructions.map((instruction, idx) => (
                                                                        <li key={idx} className="flex items-start space-x-2">
                                                                          <span className="text-[#c5a059] font-mono font-bold select-none">&bull;</span>
                                                                          <span className="text-[#38261e]">{instruction}</span>
                                                                        </li>
                                                                      ))}
                                                                    </ul>
                                                                </div>

                                                                    {/* Investigation Acceptance Call-To-Action (Matches E2E test requirement) */}
                                                                    <div className="pt-6 border-t border-[#f0e6dc] flex flex-col sm:flex-row items-center justify-between gap-4">
                                                                      <div className="text-xs font-mono text-[#7a685c] text-center sm:text-left">
                                                                        <span className="block text-[#8c5e58] font-bold">ALL EVIDENCE LOGS UNLOCKED</span>
                                                                        <span>Proceed to the Investigation Board to begin examining clues.</span>
                                                                      </div>

                                                                      <button
                                                                        type="button"
                                                                        onClick={handleAcceptInvestigation}
                                                                        disabled={isAccepted}
                                                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d99b9b] via-[#c58585] to-[#9c5460] hover:brightness-105 text-white rounded-xl font-serif font-bold text-sm tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] disabled:opacity-50"
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
