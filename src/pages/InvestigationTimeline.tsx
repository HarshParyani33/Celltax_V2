import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  CircleDashed, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Unlock, 
  Layers, 
  Compass,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
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
    era: 'CIRCA 1978 — ARCHIVAL EPOCH',
    order: 1,
    establishedFacts: [
      'Gelatin silver print on double-weight rag paper with custom lens vignetting.',
      'Reverse bears handwritten inscription: "Where the horizon bends inward."',
      'Spectral analysis confirms Sector 7 maritime bluff origin.'
    ],
    investigativeHypothesis:
      'The observatory served as the solitary visual lookout point where the search for an extraordinary life trajectory first took physical form.'
  },
  {
    item: EVIDENCE_COLLECTION[1], // ITEM-012-B
    era: 'CIRCA 1988 — CORRESPONDENCE RECORD',
    order: 2,
    establishedFacts: [
      'Weathered 100% flax rag paper penned in Department iron gall ink.',
      'Archival red wax seal containing micro-impression of an astronomical constellation.',
      'Cipher text references a milestone dedication preserved under Vault Annex 4.'
    ],
    investigativeHypothesis:
      'The confidential dispatch records the vows and milestones of this extraordinary individual, establishing a paper trail leading directly to the vault.'
  },
  {
    item: EVIDENCE_COLLECTION[2], // ITEM-012-C
    era: 'PRESENT ERA — CELEBRATORY CONVERGENCE',
    order: 3,
    establishedFacts: [
      'Concentric engine-turned copper-zinc brass dial with obsidian viewing optic.',
      'Three nested rings rotate with zero friction and tick at exactly 60 bpm.',
      'Perimeter inscriptions calibrate to the exact coordinates of a private celebration.'
    ],
    investigativeHypothesis:
      'The astrolithic dial acts as the mechanical culmination, physically synthesizing the years, coordinates, and memories into an immortal celebration.'
  }
];

export const InvestigationTimeline: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = usePrefersReducedMotion();
  const { inspectedIds, hasInspected, isUnlocked, percentage, remainingIds, connections } = useProgression();
  const remaining = EVIDENCE_COLLECTION.filter((item) => remainingIds.includes(item.id));

  // Expandable memory details state for Phase 3 milestone records
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
      className="min-h-screen flex flex-col bg-investigation-base text-investigation-text selection:bg-brass selection:text-charcoal-900"
    >
      <Header currentScreen="timeline" />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Top Breadcrumb & Status Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-investigation-border/60">
          <div className="flex items-center space-x-3 text-xs font-mono text-investigation-muted">
            <Link
              to="/archive"
              onClick={() => soundFx.playKeypress()}
              className="hover:text-brass transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO EVIDENCE ARCHIVE</span>
            </Link>
            <span>/</span>
            <span className="text-brass-light font-bold">CHRONOLOGICAL SYNTHESIS</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded bg-investigation-surface border border-investigation-border text-investigation-text flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-brass" />
              <span>TIMELINE STATUS: {inspectedIds.length} / 3 NODES AUTHENTICATED ({percentage}%)</span>
            </div>

            {isUnlocked ? (
              <div className="px-3 py-1.5 rounded bg-brass/20 border border-brass/50 text-brass-light font-bold flex items-center space-x-1.5">
                <Unlock className="w-3.5 h-3.5 text-brass" />
                <span>GALLERY UNLOCKED</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded bg-investigation-forest border border-investigation-border text-investigation-muted flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-investigation-muted" />
                <span>GALLERY LOCKED</span>
              </div>
            )}
          </div>
        </div>

        {/* Header Title Section */}
        <div className="my-8 text-center sm:text-left">
          <div className="text-xs font-mono text-brass tracking-widest uppercase mb-2">
            FORENSIC TEMPORAL MAPPING // CASE 012
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-parchment tracking-wide">
            THE CONNECTED INVESTIGATION TIMELINE
          </h1>
          <p className="text-sm font-sans text-investigation-muted max-w-3xl mt-2 leading-relaxed">
            Every recovered artifact occupies a precise moment along a single coherent trajectory. 
            Examine the chronological milestones below to discern how an observatory in 1978 and a sealed dispatch in 1988 
            converge with the astrolithic dial to commemorate an extraordinary life.
          </p>
        </div>

        {/* Chronological Rail Container */}
        <div className="relative my-12">
          {/* Vertical central connector rail (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brass/10 via-brass/40 to-brass/10 -translate-x-1/2" />

          <div className="space-y-12 sm:space-y-16">
            {CHRONO_NODES.map((node, index) => {
              const isExamined = hasInspected(node.item.id);
              const isEven = index % 2 === 0;
              const isExpanded = expandedNodeId === node.item.id;
              const memories = getMemoriesForExhibit(node.item.id);

              return (
                <div
                  key={node.item.id}
                  className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card Side */}
                  <div className="w-full md:w-[calc(50%-2rem)]">
                    <motion.div
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.15 }}
                      className={`
                        rounded-lg border p-6 transition-all duration-300 relative overflow-hidden
                        ${isExamined
                          ? 'bg-investigation-surface border-brass/40 shadow-evidenceCard'
                          : 'bg-investigation-surface/40 border-investigation-border/60 opacity-80'}
                      `}
                    >
                      {/* Era Banner */}
                      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-investigation-border/60">
                        <div className="flex items-center space-x-2 text-xs font-mono text-brass-light font-bold">
                          <Calendar className="w-3.5 h-3.5 text-brass" />
                          <span>{node.era}</span>
                        </div>
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-investigation-forest border border-investigation-border text-investigation-muted uppercase">
                          {node.item.code}
                        </span>
                      </div>

                      {/* Title & Image preview */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded border border-investigation-border bg-charcoal-900 overflow-hidden shrink-0">
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
                          <h3 className="font-serif font-bold text-base sm:text-lg text-parchment line-clamp-2">
                            {node.item.title}
                          </h3>
                          <p className="text-xs font-mono text-investigation-muted mt-1">
                            ORIGIN: {node.item.origin}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            {isExamined ? (
                              <span className="text-[11px] font-mono text-brass flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>AUTHENTICATED BY AGENT</span>
                              </span>
                            ) : (
                              <Link
                                to="/archive"
                                onClick={() => soundFx.playKeypress()}
                                className="text-[11px] font-mono text-investigation-muted hover:text-brass flex items-center space-x-1 transition-colors"
                              >
                                <CircleDashed className="w-3.5 h-3.5" />
                                <span>UNEXAMINED — CLICK TO INSPECT IN ARCHIVE</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Established Facts vs Hypothesis Section */}
                      <div className="mt-5 pt-4 border-t border-investigation-border/50 space-y-3">
                        <div>
                          <div className="text-[10px] font-mono text-brass uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brass" />
                            <span>ESTABLISHED FORENSIC DATA:</span>
                          </div>
                          <ul className="text-xs font-sans text-investigation-text/90 space-y-1 pl-3 list-disc list-outside">
                            {node.establishedFacts.map((fact, idx) => (
                              <li key={idx} className="leading-relaxed">{fact}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded bg-investigation-forest/70 border border-investigation-border/40 text-xs">
                          <div className="text-[10px] font-mono text-parchment-aged tracking-wider uppercase mb-1 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-brass" />
                            <span>INVESTIGATIVE HYPOTHESIS:</span>
                          </div>
                          <p className="font-serif italic text-investigation-text/80 leading-relaxed">
                            "{node.investigativeHypothesis}"
                          </p>
                        </div>
                      </div>

                      {/* Phase 3: Expandable Memory Milestone Details */}
                      <div className="mt-4 pt-3 border-t border-investigation-border/40">
                        <button
                          type="button"
                          onClick={() => toggleNodeExpansion(node.item.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`memory-panel-${node.item.id}`}
                          className="w-full flex items-center justify-between px-3 py-2 rounded bg-investigation-card/80 hover:bg-investigation-card border border-investigation-border/60 text-xs font-mono text-brass-light hover:text-brass transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brass"
                        >
                          <span className="flex items-center space-x-2">
                            <FileText className="w-3.5 h-3.5 text-brass" />
                            <span>{isExpanded ? 'CONCEAL ARCHIVAL MEMORY LOG' : 'EXPAND ARCHIVAL MEMORY LOG'}</span>
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              id={`memory-panel-${node.item.id}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
                              className="overflow-hidden mt-3 space-y-3 pt-2"
                            >
                              {memories.map((mem) => (
                                <div
                                  key={mem.id}
                                  className="p-3.5 rounded bg-investigation-base/90 border border-brass/30 space-y-2 text-xs font-sans"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-investigation-border/40">
                                    <span className="font-serif font-bold text-parchment text-sm">{mem.title}</span>
                                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                                      {mem.isApproximateDate && (
                                        <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-600/40 text-amber-300">
                                          APPROXIMATE ERA
                                        </span>
                                      )}
                                      <span className="text-investigation-muted">{mem.displayDate || mem.date}</span>
                                    </div>
                                  </div>

                                  <p className="text-investigation-text/90 leading-relaxed text-xs">
                                    {mem.fullNarrative}
                                  </p>

                                  {mem.personalNote && (
                                    <div className="p-2 rounded bg-investigation-forest/60 border border-investigation-border/60 text-[11px] font-serif italic text-brass-light/90">
                                      "{mem.personalNote}"
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-investigation-muted">
                                    {mem.location && (
                                      <span className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3 text-brass" />
                                        <span>{mem.location}</span>
                                      </span>
                                    )}
                                    <span className="uppercase text-brass-dark">{mem.category}</span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>

                  {/* Center Node Badge on timeline rail */}
                  <div className="relative z-10 w-10 h-10 rounded-full border-2 border-brass bg-investigation-surface flex items-center justify-center shrink-0 shadow-brass-sm">
                    {isExamined ? (
                      <CheckCircle2 className="w-5 h-5 text-brass" />
                    ) : (
                      <span className="font-mono text-xs font-bold text-investigation-muted">{node.order}</span>
                    )}
                  </div>

                  {/* Spacer for symmetrical layout */}
                  <div className="hidden md:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Progressive Narrative Connection Insights */}
        <div className="my-10 p-6 sm:p-8 rounded-lg border border-brass/40 bg-investigation-surface/90 shadow-dossier">
          <div className="flex items-center space-x-2 text-xs font-mono text-brass uppercase tracking-widest mb-3">
            <Compass className="w-4 h-4 text-brass" />
            <span>PROGRESSIVE TIMELINE CORROBORATION // SEQUENTIAL DISCOVERY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono mt-4">
            {/* Tier 1 Link: Activated when Item 012-A is inspected */}
            <div className={`p-4 rounded border ${connections.link1Active ? 'bg-investigation-card border-brass/50 text-parchment' : 'bg-investigation-forest/40 border-investigation-border text-investigation-muted'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-brass-light">LINK 1: THE TOWER (1978)</span>
                {connections.link1Active ? <CheckCircle2 className="w-4 h-4 text-brass" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
              <p className="font-sans text-xs leading-relaxed text-investigation-text/80">
                {connections.link1Active
                  ? 'Establishes the physical origin point at Sector 7. The observatory lens is aligned to capture the exact solstice twilight.'
                  : 'Pending forensic inspection of Item 012-A.'}
              </p>
            </div>

            {/* Tier 2 Link: Activated sequentially when Item 012-A and Item 012-B are inspected */}
            <div className={`p-4 rounded border ${connections.link2Active ? 'bg-investigation-card border-brass/50 text-parchment' : 'bg-investigation-forest/40 border-investigation-border text-investigation-muted'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-brass-light">LINK 2: THE DISPATCH (1988)</span>
                {connections.link2Active ? <CheckCircle2 className="w-4 h-4 text-brass" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
              <p className="font-sans text-xs leading-relaxed text-investigation-text/80">
                {connections.link2Active
                  ? 'Corroborates the observatory coordinates with personal cipher dispatches. Hand-penned in archival iron gall ink.'
                  : 'Requires sequential inspection of Item 012-A and Item 012-B.'}
              </p>
            </div>

            {/* Tier 3 Link: Activated only when all three exhibits are inspected */}
            <div className={`p-4 rounded border ${connections.link3Active ? 'bg-investigation-card border-brass text-parchment' : 'bg-investigation-forest/40 border-investigation-border text-investigation-muted'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-brass-light">LINK 3: THE DIAL (CONVERGENCE)</span>
                {connections.link3Active ? <CheckCircle2 className="w-4 h-4 text-brass" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
              <p className="font-sans text-xs leading-relaxed text-investigation-text/80">
                {connections.link3Active
                  ? 'Complete synthesis achieved! Concentric brass mechanics lock the timeline to the milestone celebration date.'
                  : 'Requires inspection of all three exhibits (Item 012-A, 012-B, and 012-C).'}
              </p>
            </div>
          </div>
        </div>

        {/* Master Gallery Callout & Gateway */}
        <div className="mt-12 p-6 sm:p-10 rounded-lg border border-brass/50 bg-gradient-to-r from-investigation-forest via-investigation-surface to-investigation-forest text-center relative overflow-hidden shadow-spotlight">
          {isUnlocked ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass/20 border border-brass text-brass-light font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4 text-brass" />
                <span>ALL 3 TIMELINE ARTEFACTS AUTHENTICATED</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-serif font-black text-parchment">
                The Master Curatorial Gallery Is Open
              </h2>
              <p className="text-sm font-sans text-investigation-text/90 leading-relaxed">
                You have resolved the chronology connecting the coastal tower, the dispatch folio, and the astrolithic dial. 
                Step inside the confidential curatorial gallery for the final celebration and unified revelation.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playAccessGranted();
                    navigate('/gallery');
                  }}
                  className="px-8 py-3.5 rounded font-mono text-xs sm:text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-brass via-brass-light to-brass text-charcoal-900 hover:brightness-110 shadow-brass transition-all inline-flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  <span>ENTER MASTER CURATORIAL GALLERY</span>
                  <ArrowRight className="w-4 h-4 text-charcoal-900" />
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-investigation-surface border border-investigation-border text-investigation-muted font-mono text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>CURATORIAL VAULT LOCKED — {3 - inspectedIds.length} REMAINING</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-parchment">
                Complete Your Examination of the Evidence Archive
              </h2>
              <p className="text-xs sm:text-sm font-sans text-investigation-muted leading-relaxed">
                The Master Curatorial Gallery unlocks only after all 3 exhibits have been thoroughly examined in the archive.
                Currently unexamined: {remaining.map((r) => r.code).join(', ')}.
              </p>
              <div className="pt-2">
                <Link
                  to="/archive"
                  onClick={() => soundFx.playKeypress()}
                  className="px-6 py-2.5 rounded font-mono text-xs font-bold tracking-wider uppercase bg-investigation-surface border border-brass/50 text-brass hover:bg-brass hover:text-charcoal-900 transition-all inline-flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  <Eye className="w-4 h-4" />
                  <span>INSPECT REMAINING EXHIBITS IN ARCHIVE</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};
