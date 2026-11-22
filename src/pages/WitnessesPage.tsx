import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, MessageSquare } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SuspectModal } from '../components/SuspectModal';
import { WITNESS_PROFILES, SUSPECT_PROFILES, WitnessProfile, SuspectProfile } from '../data/findHerData';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';

export const WitnessesPage: React.FC = () => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<'witnesses' | 'suspects'>('witnesses');
  const [selectedPerson, setSelectedPerson] = useState<WitnessProfile | SuspectProfile | null>(null);
  const [isSuspectModal, setIsSuspectModal] = useState(false);

  const handleOpenInterview = (person: WitnessProfile | SuspectProfile, isSuspect: boolean) => {
    soundFx.playInspect();
    setSelectedPerson(person);
    setIsSuspectModal(isSuspect);
  };

  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="witnesses" />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-investigation-border/60 gap-4">
          <div>
            <div className="text-xs font-mono text-investigation-muted uppercase tracking-widest flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-brass" />
              <span>OPERATION: FIND HER</span>
              <span>//</span>
              <span className="text-brass-light font-bold">INTERROGATION & STATEMENTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-parchment">
              WITNESSES & SUSPECTS
            </h1>
            <p className="text-xs sm:text-sm font-sans text-investigation-muted max-w-2xl mt-1 leading-relaxed">
              Her closest friends provided statements about where she was last seen. Meanwhile, several notorious fictional suspects have emerged with completely ridiculous alibis.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center space-x-2 bg-investigation-surface p-1 rounded-lg border border-investigation-border text-xs font-mono">
            <button
              type="button"
              onClick={() => { soundFx.playKeypress(); setActiveTab('witnesses'); }}
              className={`px-4 py-2 rounded transition-all ${
                activeTab === 'witnesses'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : 'text-investigation-muted hover:text-parchment'
              }`}
            >
              WITNESS STATEMENTS (FRIENDS)
            </button>
            <button
              type="button"
              onClick={() => { soundFx.playKeypress(); setActiveTab('suspects'); }}
              className={`px-4 py-2 rounded transition-all ${
                activeTab === 'suspects'
                  ? 'bg-brass text-charcoal-900 font-bold shadow-brass-sm'
                  : 'text-investigation-muted hover:text-parchment'
              }`}
            >
              FICTIONAL SUSPECTS (ALIBIS)
            </button>
          </div>
        </div>

        {/* Content Section: Witnesses */}
        {activeTab === 'witnesses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WITNESS_PROFILES.map((witness) => (
                <div
                  key={witness.id}
                  className="bg-investigation-card rounded-lg border border-investigation-border p-5 space-y-4 shadow-lg hover:border-brass/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full border border-brass/40 overflow-hidden shrink-0">
                        <img
                          src={witness.avatarUrl}
                          alt={witness.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-parchment text-sm">
                          {witness.name}
                        </h3>
                        <p className="text-[11px] font-mono text-brass">
                          {witness.relationship}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-investigation-surface/80 border border-investigation-border">
                      <p className="font-serif italic text-xs text-investigation-text line-clamp-3">
                        "{witness.statement}"
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-investigation-muted">
                      <div>SEEN AT: <span className="text-parchment">{witness.locationMentioned}</span></div>
                      <div>CREDIBILITY: <span className="text-brass-light">{witness.credibilityRating}</span></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenInterview(witness, false)}
                    className="w-full py-2 bg-investigation-surface hover:bg-brass hover:text-charcoal-900 border border-investigation-border hover:border-brass text-brass-light rounded text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>READ FULL STATEMENT & CLUES</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Section: Suspects */}
        {activeTab === 'suspects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUSPECT_PROFILES.map((suspect) => (
                <div
                  key={suspect.id}
                  className="bg-investigation-card rounded-lg border border-investigation-border p-5 space-y-4 shadow-lg hover:border-red-500/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded border border-red-500/40 overflow-hidden shrink-0">
                        <img
                          src={suspect.avatarUrl}
                          alt={suspect.codename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="stamp-confidential text-[9px] py-0 px-1 border-red-500 text-red-400">
                            SUSPECT
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-parchment text-sm mt-0.5">
                          {suspect.codename}
                        </h3>
                        <p className="text-[11px] font-mono text-brass">
                          Alias: {suspect.realName}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-investigation-surface/80 border border-investigation-border">
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block mb-1">
                        ALLEGED ALIBI:
                      </span>
                      <p className="font-serif italic text-xs text-investigation-text line-clamp-3">
                        "{suspect.ridiculousAlibi}"
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-investigation-muted">
                      <div>BEHAVIOR: <span className="text-investigation-text">{suspect.suspiciousBehavior}</span></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenInterview(suspect, true)}
                    className="w-full py-2 bg-red-950/40 hover:bg-red-800 text-red-200 hover:text-white border border-red-800/60 rounded text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>INTERROGATE SUSPECT</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suspect/Witness Inspection Dialog Modal */}
        <SuspectModal
          person={selectedPerson}
          isSuspect={isSuspectModal}
          onClose={() => setSelectedPerson(null)}
        />

      </main>

      <Footer />
    </motion.div>
  );
};
