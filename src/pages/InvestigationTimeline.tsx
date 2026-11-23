import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  CircleDashed,
  ArrowLeft,
  Sparkles,
  Lock,
  Unlock,
  Layers,
  Compass,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EVIDENCE_COLLECTION } from '../data/evidence';
import { useProgression } from '../utils/progression';
import { soundFx } from '../utils/audio';
import { getPageTransition, usePrefersReducedMotion } from '../utils/animations';
import { getMemoriesForExhibit } from '../data/memories';

interface ChronoNode {
  item: typeof EVIDENCE_COLLECTION[number];
  era: string;
  order: number;
  establishedFacts: string[];
  investigativeHypothesis: string;
}

const CHRONO_NODES: ChronoNode[] = [
  {
    item: EVIDENCE_COLLECTION[0], // ITEM-012-A
    era: 'CHRONO CLUE 01: THE SCENIC OVERLOOK SIGHTING',
    order: 1,
    establishedFacts: [
      'Gelatin silver print on double-weight rag paper with custom lens vignetting.',
      'Reverse bears handwritten inscription: "Evidence suggests an unusually high concentration of cuteness."',
      'Confirmed sighting of subject laughing by the scenic maritime bluff.'
    ],
    investigativeHypothesis:
      'The scenic lookout serves as the primary sighting point where she paused to take in the golden hour and admire the horizon.'
  },
  {
    item: EVIDENCE_COLLECTION[1], // ITEM-012-B
    era: 'CHRONO CLUE 02: THE HANDWRITTEN DISPATCH',
    order: 2,
    establishedFacts: [
      'Weathered 100% flax rag paper penned with personal messages.',
      'Archival red wax seal containing micro-impression of an astronomical constellation.',
      'Cipher text references a milestone dedication and warm messages from friends.'
    ],
    investigativeHypothesis:
      'The confidential dispatch records the love and milestones of this extraordinary individual, establishing a paper trail leading directly to her celebration.'
  },
  {
    item: EVIDENCE_COLLECTION[2], // ITEM-012-C
    era: 'CHRONO CLUE 03: THE CELEBRATORY CONVERGENCE',
    order: 3,
    establishedFacts: [
      'Concentric engine-turned copper-zinc brass dial with obsidian viewing optic.',
      'Three nested rings rotate with zero friction and tick at exactly 60 bpm.',
      'Perimeter inscriptions calibrate to the exact coordinates of her scenic birthday reunion.'
    ],
    investigativeHypothesis:
      'The astrolithic dial acts as the keepsake compass, physically synthesizing the clues, years, and memories into an immortal celebration.'
  }
];

export const InvestigationTimeline: React.FC = () => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const { inspectedIds, hasInspected, isUnlocked, percentage, connections } = useProgression();

  // Expandable memory details state
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const toggleNodeExpansion = (nodeId: string) => {
    soundFx.playKeypress();
    setExpandedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <motion.div
      variants={getPageTransition(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-[#faf6f0] text-[#38261e] texture-desk selection:bg-[#d99b9b] selection:text-[#38261e]"
    >
      <Header currentScreen="timeline" />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Top Breadcrumb & Status Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8dcce]">
              <div className="flex items-center space-x-3 text-xs font-mono text-[#7a685c]">
                <Link
                  to="/archive"
                  onClick={() => soundFx.playKeypress()}
                  className="hover:text-[#8c5e58] transition-colors flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>RETURN TO INVESTIGATION BOARD</span>
                </Link>
                <span>/</span>
                <span className="text-[#38261e] font-bold">CHRONOLOGICAL TRAIL</span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="px-4 py-1.5 rounded-full bg-[#ffffff] border border-[#e8dcce] text-[#5c3d2e] flex items-center space-x-2 shadow-sm">
                    <Layers className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span className="font-semibold">TIMELINE STATUS: {inspectedIds.length} / 3 CLUES EXAMINED ({percentage}%)</span>
                  </div>

                  {isUnlocked ? (
                      <div className="px-4 py-1.5 rounded-full bg-[#fceeeb] border border-[#d99b9b]/50 text-[#8c5e58] font-bold flex items-center space-x-1.5 shadow-sm">
                        <Unlock className="w-3.5 h-3.5 text-[#d99b9b]" />
                        <span>SUBJECT FOUND UNLOCKED</span>
                      </div>
                      ) : (
                        <div className="px-4 py-1.5 rounded-full bg-[#fbf8f4] border border-[#e8dcce] text-[#7a685c] flex items-center space-x-1.5 shadow-sm">
                          <Lock className="w-3.5 h-3.5 text-[#7a685c]" />
                          <span>SUBJECT FOUND LOCKED</span>
                        </div>
            )}
                      </div>
                    </div>

                      {/* Header Title Section (Preserves E2E test string) */}
                      <div className="my-8 text-center sm:text-left space-y-2">
                        <div className="text-xs font-mono text-[#8c5e58] tracking-widest uppercase flex items-center space-x-2">
                          <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span>OPERATION: FIND HER // CASE NO. 012</span>
                        </div>
                          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#38261e] tracking-tight">
                            THE CONNECTED INVESTIGATION TIMELINE
                          </h1>
                            <p className="text-sm font-sans text-[#7a685c] max-w-3xl leading-relaxed">
                              Trace the trail of memories, handwritten dispatches, and compass readings that lead directly to the scenic birthday reunion.
                              Examine the chronological milestones below to discern how an observatory in 1978 and a sealed dispatch in 1988
                              converge with the astrolithic dial to commemorate an extraordinary life.
                            </p>
                          </div>

                          {/* Chronological Rail Container */}
                          <div className="relative my-12">
                            {/* Vertical central connector ribbon */}
                            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#d99b9b]/30 via-[#c5a059]/40 to-[#d99b9b]/30 -translate-x-1/2 rounded-full" />

                            <div className="space-y-12 sm:space-y-16">
                              {CHRONO_NODES.map((node, index) => {
                                const isExamined = hasInspected(node.item.id);
                                const isEven = index % 2 === 0;
                                const isExpanded = expandedNodeId === node.item.id;
                                const memories = getMemoriesForExhibit(node.item.id);

                                return (
                                  <div
                                    key={node.item.id}
                                    className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${isEven ? 'md:flex-row-reverse' : ''
                                      }`}
                                  >
                                    {/* Content Card Side */}
                                    <div className="w-full md:w-[calc(50%-2rem)]">
                                      <motion.div
                                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.15 }}
                                        className={`
                        rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden shadow-gift
                        ${isExamined
                          ? 'bg-[#ffffff] border-[#e8dcce] hover:border-[#d99b9b]'
                          : 'bg-[#ffffff]/80 border-[#e8dcce]/60 opacity-85'}
                      `}
                                      >
                                        {/* Era Banner */}
                                            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#f0e6dc]">
                                              <div className="flex items-center space-x-2 text-xs font-mono text-[#8c5e58] font-bold">
                                                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                                                <span>{node.era}</span>
                                              </div>
                                                <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-[#fceeeb] text-[#8c5e58] uppercase font-semibold">
                                                  {node.item.code}
                                                </span>
                                            </div>

                                            {/* Title & Image preview */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#e8dcce] bg-[#f5eee4] overflow-hidden shrink-0 shadow-sm">
                                                  <picture>
                                                    {node.item.webpUrl && <source srcSet={node.item.webpUrl} type="image/webp" />}
                                                    <img
                                                      src={node.item.imageUrl}
                                                      alt={node.item.title}
                                                      className={`w-full h-full object-cover ${!isExamined ? 'filter grayscale contrast-125' : ''}`}
                                                    />
                                                  </picture>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#38261e] line-clamp-2">
                                                      {node.item.title}
                                                    </h3>
                                                      <p className="text-xs font-mono text-[#7a685c] mt-1">
                                                        ORIGIN: {node.item.origin}
                                                      </p>
                                                        <div className="mt-2.5 flex items-center space-x-2">
                                                          {isExamined ? (
                                                              <span className="text-[11px] font-mono text-[#4f614b] font-bold flex items-center space-x-1">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#9caf88]" />
                                                                <span>AUTHENTICATED BY AGENT</span>
                                                              </span>
                                                              ) : (
                                                              <Link
                                                                to="/archive"
                                                                onClick={() => soundFx.playKeypress()}
                                                                className="text-[11px] font-mono text-[#7a685c] hover:text-[#8c5e58] flex items-center space-x-1 transition-colors"
                                                              >
                                                                <CircleDashed className="w-3.5 h-3.5" />
                                                                <span>UNEXAMINED — CLICK TO INSPECT IN ARCHIVE</span>
                                                              </Link>
                            )}
                                                            </div>
                        </div>
                                                      </div>

                                                          {/* Established Facts List */}
                                                          <div className="mt-4 pt-3 border-t border-[#f0e6dc] space-y-1.5 font-mono text-xs">
                                                            <div className="text-[10px] text-[#7a685c] uppercase font-bold tracking-wider">
                                                              ESTABLISHED FORENSIC DATA:
                                                            </div>
                                                            <ul className="space-y-1 text-[#5c3d2e]">
                                                              {node.establishedFacts.map((fact, fIdx) => (
                                                                <li key={fIdx} className="flex items-start space-x-2">
                                                                  <span className="text-[#c5a059] font-bold select-none">&bull;</span>
                                                                  <span className="text-[11px] leading-relaxed">{fact}</span>
                                                                </li>
                                                              ))}
                                                            </ul>
                                                          </div>

                                                            {/* Investigative Hypothesis */}
                                                            <div className="mt-4 p-3.5 rounded-2xl bg-[#fdfaf5] border border-[#e8dcce] text-xs">
                                                              <div className="text-[10px] font-mono font-bold text-[#8c5e58] uppercase mb-1">
                                                                INVESTIGATIVE HYPOTHESIS:
                                                              </div>
                                                              <p className="font-serif italic text-xs text-[#38261e] leading-relaxed">
                                                                "{node.investigativeHypothesis}"
                                                              </p>
                                                            </div>

                                                              {/* Expandable Memory Log Details (Tested in E2E step 9) */}
                                                              <div className="mt-4 pt-3 border-t border-[#f0e6dc]">
                                                                <button
                                                                  type="button"
                                                                  onClick={() => toggleNodeExpansion(node.item.id)}
                                                                  className="w-full flex items-center justify-between text-xs font-mono font-bold text-[#8c5e58] hover:text-[#38261e] transition-colors py-1"
                                                                >
                                                                    <span className="flex items-center space-x-1.5">
                                                                      <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
                                                                      <span>{isExpanded ? 'CONCEAL ARCHIVAL MEMORY LOG' : 'EXPAND ARCHIVAL MEMORY LOG'}</span>
                                                                    </span>
                                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                </button>

                                                                <AnimatePresence>
                                                                  {isExpanded && (
                                                                    <motion.div
                                                                      initial={{ opacity: 0, height: 0 }}
                                                                      animate={{ opacity: 1, height: 'auto' }}
                                                                      exit={{ opacity: 0, height: 0 }}
                                                                      className="mt-3 pt-3 border-t border-[#e8dcce] space-y-2 text-xs font-mono"
                                                                    >
                                                                      <div className="text-[#7a685c] text-[10px] uppercase font-bold">
                                                                        RECOVERED MEMORY LOG ENTRIES ({memories.length}):
                                                                      </div>
                                                                      {memories.map((mem) => (
                                                                            <div key={mem.id} className="p-3 rounded-xl bg-[#fceeeb]/50 border border-[#d99b9b]/30 space-y-1">
                                                                              <div className="font-serif font-bold text-[#38261e] text-xs flex justify-between">
                                                                                <span>{mem.title}</span>
                                                                                <span className="text-[#8c5e58] font-mono text-[10px]">{mem.date}</span>
                                                                              </div>
                                                                                <p className="font-sans text-[11px] text-[#5c3d2e] leading-relaxed">
                                                                                  {mem.shortDescription}
                                                                                </p>
                                                                            </div>
                              ))}
                                                                          </motion.div>
                          )}
                                                                        </AnimatePresence>
                      </div>
                    </motion.div>
                                                              </div>

                                                                {/* Central Node Badge */}
                                                                <div className="relative z-10 w-10 h-10 rounded-full border-2 border-[#c5a059] bg-[#ffffff] flex items-center justify-center font-serif font-bold text-xs text-[#8c5e58] shadow-md">
                                                                  {node.order}
                                                                </div>

                                                                {/* Spacer for symmetry */}
                                                                <div className="hidden md:block w-[calc(50%-2rem)]" />
                                                              </div>
                                                              );
            })}
                                                            </div>
                                                          </div>

                                                              {/* Progressive Timeline Corroboration Tiers */}
                                                              <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e8dcce] shadow-gift space-y-5 my-8">
                                                                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#8c5e58] uppercase tracking-wider">
                                                                  <Compass className="w-4 h-4 text-[#c5a059]" />
                                                                  <span>PROGRESSIVE TIMELINE CORROBORATION // SEQUENTIAL DISCOVERY</span>
                                                                </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                                                                      <div className={`p-4 rounded-2xl border transition-all ${connections.link1Active
                                                                          ? 'bg-[#eef3ea] border-[#9caf88] text-[#4f614b]'
                                                                          : 'bg-[#fbf8f4] border-[#e8dcce] text-[#7a685c]'
                                                                        }`}>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                          <span className="font-bold">LINK 1: THE TOWER (1978)</span>
                                                                          {connections.link1Active ? <CheckCircle2 className="w-4 h-4 text-[#9caf88]" /> : <Lock className="w-4 h-4" />}
                                                                        </div>
                                                                          <p className="text-[11px] leading-relaxed opacity-85">
                                                                            {connections.link1Active ? 'Temporal coordinate established via Item 012-A.' : 'Pending forensic inspection of Item 012-A.'}
                                                                          </p>
                                                                      </div>

                                                                        <div className={`p-4 rounded-2xl border transition-all ${connections.link2Active
                                                                            ? 'bg-[#eef3ea] border-[#9caf88] text-[#4f614b]'
                                                                            : 'bg-[#fbf8f4] border-[#e8dcce] text-[#7a685c]'
                                                                          }`}>
                                                                          <div className="flex items-center justify-between mb-2">
                                                                            <span className="font-bold">LINK 2: THE DISPATCH (1988)</span>
                                                                            {connections.link2Active ? <CheckCircle2 className="w-4 h-4 text-[#9caf88]" /> : <Lock className="w-4 h-4" />}
                                                                          </div>
                                                                            <p className="text-[11px] leading-relaxed opacity-85">
                                                                              {connections.link2Active ? 'Epistolary correspondence correlated.' : 'Requires sequential inspection of all three exhibits.'}
                                                                            </p>
                                                                        </div>

                                                                          <div className={`p-4 rounded-2xl border transition-all ${connections.link3Active
                                                                              ? 'bg-[#eef3ea] border-[#9caf88] text-[#4f614b]'
                                                                              : 'bg-[#fbf8f4] border-[#e8dcce] text-[#7a685c]'
                                                                            }`}>
                                                                            <div className="flex items-center justify-between mb-2">
                                                                              <span className="font-bold">LINK 3: THE DIAL (CONVERGENCE)</span>
                                                                              {connections.link3Active ? <Sparkles className="w-4 h-4 text-[#c5a059]" /> : <Lock className="w-4 h-4" />}
                                                                            </div>
                                                                              <p className="text-[11px] leading-relaxed opacity-85">
                                                                                {connections.link3Active ? 'Full synthesis unlocked. Coordinates confirmed!' : 'Requires inspection of all three exhibits (012-A, 012-B, 012-C).'}
                                                                              </p>
                                                                          </div>
                                                                        </div>
                                                                      </div>

                                                                        {/* Bottom Navigation */}
                                                                        <div className="text-center pt-4">
                                                                          <Link
                                                                            to="/archive"
                                                                            onClick={() => soundFx.playKeypress()}
                                                                            className="px-8 py-3.5 rounded-full bg-[#ffffff] hover:bg-[#fceeeb] border border-[#e8dcce] text-xs font-serif font-bold tracking-wider text-[#8c5e58] uppercase transition-all shadow-sm hover:shadow inline-flex items-center space-x-2"
                                                                          >
                                                                            <ArrowLeft className="w-4 h-4" />
                                                                            <span>INSPECT REMAINING EXHIBITS IN ARCHIVE</span>
                                                                          </Link>
                                                                        </div>

                                                                      </main>

                                                                      <Footer />
                                                                    </motion.div>
                                                                    );
};
