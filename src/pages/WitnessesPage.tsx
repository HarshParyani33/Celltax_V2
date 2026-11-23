import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageSquare, Sparkles } from 'lucide-react';
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
      className="min-h-screen flex flex-col bg-[#faf6f0] text-[#38261e] texture-desk selection:bg-[#d99b9b] selection:text-[#38261e]"
    >
      <Header currentScreen="witnesses" />

        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">

          {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#e8dcce] gap-4">
              <div>
                  <div className="text-xs font-mono text-[#7a685c] uppercase tracking-widest flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-[#d99b9b]" />
                    <span className="text-[#8c5e58] font-bold">HER PEOPLE</span>
                    <span>//</span>
                    <span>WITNESS STATEMENTS & PLAYFUL SUSPECTS</span>
                  </div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#38261e] tracking-tight flex items-center space-x-2.5">
                      <span>WITNESSES & SUSPECTS</span>
                      <Heart className="w-6 h-6 text-[#d99b9b] fill-[#d99b9b]" />
                    </h1>
                      <p className="text-xs sm:text-sm font-sans text-[#7a685c] max-w-2xl mt-1.5 leading-relaxed">
                        Her closest friends provided statements about where she was last seen laughing. Meanwhile, several notorious fictional suspects have emerged with completely ridiculous alibis.
                      </p>
                    </div>

                    {/* Tab Selector */}
                      <div className="flex items-center space-x-2 bg-[#ffffff] p-1.5 rounded-full border border-[#e8dcce] text-xs font-mono shadow-sm">
                        <button
                          type="button"
                          onClick={() => { soundFx.playKeypress(); setActiveTab('witnesses'); }}
                                  ? 'bg-gradient-to-r from-[#d99b9b] to-[#9c5460] text-white shadow-sm'
                                  : 'text-[#7a685c] hover:text-[#38261e]'
                              }`}
            >
              WITNESS STATEMENTS (FRIENDS)
            </button>
            <button
              type="button"
              onClick={() => { soundFx.playKeypress(); setActiveTab('suspects'); }}
              className = {`px-5 py-2 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'suspects'
                                ? 'bg-gradient-to-r from-[#d99b9b] to-[#9c5460] text-white shadow-sm'
                                : 'text-[#7a685c] hover:text-[#38261e]'
                            }`}
                        >
                          FICTIONAL SUSPECTS (ALIBIS)
                        </button>
                      </div>
                    </div>

                    {/* Content Section: Witnesses */}
                    {activeTab === 'witnesses' && (
                      <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {WITNESS_PROFILES.map((witness) => (
                              <div
                                key={witness.id}
                                className="bg-[#ffffff] rounded-3xl border border-[#e8dcce] p-6 space-y-4 shadow-gift hover:shadow-xl hover:border-[#d99b9b] transition-all flex flex-col justify-between"
                              >
                                      <div className="space-y-4">
                                        <div className="flex items-center space-x-3.5">
                                          <div className="w-14 h-14 rounded-full border-2 border-[#d99b9b]/50 overflow-hidden shrink-0 shadow-sm">
                                            <img
                                              src={witness.avatarUrl}
                                              alt={witness.name}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div>
                                              <h3 className="font-serif font-bold text-[#38261e] text-base">
                                                {witness.name}
                                              </h3>
                                                <p className="text-xs font-mono text-[#8c5e58] font-semibold">
                                                  {witness.relationship}
                                                </p>
                                              </div>
                                          </div>

                                              <div className="p-4 rounded-2xl bg-[#fdfbf7] texture-paper border border-[#e8dcce]">
                                                <p className="font-handwriting text-lg sm:text-xl text-[#38261e] leading-relaxed line-clamp-3">
                                                  "{witness.statement}"
                                                </p>
                                              </div>

                                                <div className="space-y-1.5 text-xs font-mono text-[#7a685c] pt-1">
                                                  <div>SEEN AT: <span className="text-[#38261e] font-semibold">{witness.locationMentioned}</span></div>
                                                  <div>CREDIBILITY: <span className="text-[#8c5e58] font-bold">{witness.credibilityRating}</span></div>
                                                </div>
                                              </div>

                                              <button
                                                type="button"
                                                onClick={() => handleOpenInterview(witness, false)}
                                                className="w-full py-2.5 bg-[#fbf8f4] hover:bg-[#fceeeb] border border-[#e8dcce] hover:border-[#d99b9b] text-[#8c5e58] rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 shadow-sm"
                                              >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>READ FULL STATEMENT &amp; CLUES</span>
                                              </button>
                                          </div>
              ))}
                                        </div>
                                      </div>
        )}

                                      {/* Content Section: Suspects */}
                                      {activeTab === 'suspects' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                              {SUSPECT_PROFILES.map((suspect) => (
                                                <div
                                                  key={suspect.id}
                                                  className="bg-[#ffffff] rounded-3xl border border-[#e8dcce] p-6 space-y-4 shadow-gift hover:shadow-xl hover:border-[#d99b9b] transition-all flex flex-col justify-between"
                                                >
                                                        <div className="space-y-4">
                                                          <div className="flex items-center space-x-3.5">
                                                            <div className="w-14 h-14 rounded-full border-2 border-[#c5a059]/50 overflow-hidden shrink-0 shadow-sm">
                                                              <img
                                                                src={suspect.avatarUrl}
                                                                alt={suspect.codename}
                                                                className="w-full h-full object-cover"
                                                              />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-serif font-bold text-[#38261e] text-base">
                                                                  {suspect.codename}
                                                                </h3>
                                                                  <p className="text-xs font-mono text-[#8c5e58]">
                                                                    ALIAS: {suspect.realName}
                                                                  </p>
                                                                </div>
                                                            </div>

                                                                <div className="p-4 rounded-2xl bg-[#fceeeb]/50 border border-[#d99b9b]/30">
                                                                  <div className="text-[10px] font-mono font-bold text-[#9c5460] uppercase mb-1">
                                                                    SUSPICIOUS ALIBI:
                                                                  </div>
                                                                  <p className="font-serif italic text-xs text-[#5c3d2e] leading-relaxed line-clamp-3">
                                                                    "{suspect.ridiculousAlibi}"
                                                                  </p>
                                                                </div>

                                                                  <div className="text-xs text-[#7a685c] leading-relaxed">
                                                                    {suspect.aliasDescription}
                                                                  </div>
                                                                </div>

                                                                <button
                                                                  type="button"
                                                                  onClick={() => handleOpenInterview(suspect, true)}
                                                                  className="w-full py-2.5 bg-gradient-to-r from-[#d99b9b] to-[#9c5460] hover:brightness-105 text-white rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-2 shadow-sm"
                                                                >
                                                                  <Sparkles className="w-3.5 h-3.5" />
                                                                  <span>INTERROGATE SUSPECT &rarr;</span>
                                                                </button>
                                                            </div>
              ))}
                                                          </div>
                                                        </div>
        )}

                                                      </main>

                                                      {/* Suspect / Witness Modal */}
                                                      {selectedPerson && (
                                                        <SuspectModal
                                                          person={selectedPerson}
                                                          isSuspect={isSuspectModal}
                                                          onClose={() => setSelectedPerson(null)}
                                                        />
                                                      )}

                                                    <Footer />
                                                  </motion.div>
                                                  );
};
