import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { 
  ArrowLeft, 
  Gamepad2, 
  Sparkles, 
  X, 
  Users, 
  Volume2, 
  VolumeX, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { TestRoomEnvironment } from '../components/game/TestRoomEnvironment';
import { PlayerController } from '../components/game/PlayerController';
import { WitnessNPC } from '../components/game/WitnessNPC';
import { WITNESS_NPCS } from '../data/witnessGameData';
import { WitnessData, AnimationState } from '../types/game';
import { soundFx } from '../utils/audio';

export const AdventureGamePage: React.FC = () => {
  const [selectedWitness, setSelectedWitness] = useState<WitnessData | null>(null);
  const [nearWitness, setNearWitness] = useState<WitnessData | null>(null);
  const [overrideAnimState, setOverrideAnimState] = useState<AnimationState | null>(null);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [muted, setMuted] = useState(soundFx.getMuted());

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundFx.playKeypress();
    }
  };

  const handleSelectWitness = (w: WitnessData) => {
    soundFx.playInspect();
    setSelectedWitness(w);
    setOverrideAnimState('talk');
  };

  const handleCloseWitness = () => {
    soundFx.playKeypress();
    setSelectedWitness(null);
    setOverrideAnimState(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#faf6f0] select-none font-sans">
      
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5, 12], fov: 48 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <TestRoomEnvironment />

          {/* 8 Witness NPCs stationed around courtyard */}
          {WITNESS_NPCS.map((w) => (
            <WitnessNPC
              key={w.id}
              witness={w}
              isNear={nearWitness?.id === w.id}
              isTalking={selectedWitness?.id === w.id}
              onSelect={handleSelectWitness}
            />
          ))}

          {/* Player Investigator with 3rd-Person Controller */}
          <PlayerController
            onNearWitnessChange={setNearWitness}
            onInteractWitness={handleSelectWitness}
            isInteracting={Boolean(selectedWitness)}
          />
        </Suspense>
      </Canvas>

      {/* Top Header Navigation Overlay */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:px-8 bg-gradient-to-b from-[#faf6f0]/95 via-[#faf6f0]/80 to-transparent pointer-events-auto">
        <div className="flex items-center space-x-3">
          <Link
            to="/archive"
            onClick={() => soundFx.playKeypress()}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#fdfbf7] border border-[#d8c8b4] hover:border-[#8b3a2b] text-[#38261e] hover:text-[#8b3a2b] text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RETURN TO BOARD</span>
          </Link>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-[#8a7667]">
            <span>/</span>
            <span className="text-[#8b3a2b] font-bold">3D ADVENTURE PROTOTYPE</span>
            <span>•</span>
            <span className="bg-[#fae8e6] text-[#8b3a2b] px-2 py-0.5 rounded-full font-bold">9 STYLIZED MODELS</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => {
              soundFx.playKeypress();
              setIsRosterOpen(!isRosterOpen);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#fdfbf7] border border-[#d8c8b4] hover:border-[#8b3a2b] text-[#38261e] text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-[#8b3a2b]" />
            <span>CHARACTER ROSTER</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? "Enable sound" : "Mute sound"}
            className="p-2 rounded-full border border-[#d8c8b4] hover:border-[#8b3a2b] bg-[#fdfbf7] text-[#6d5b52] hover:text-[#8b3a2b] transition-colors shadow-sm"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#8b3a2b]" />}
          </button>
        </div>
      </header>

      {/* Floating Interactive Action Banner (When close to an NPC) */}
      {nearWitness && !selectedWitness && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-bounce">
          <button
            type="button"
            onClick={() => handleSelectWitness(nearWitness)}
            className="px-5 py-2.5 rounded-full bg-[#8b3a2b] hover:bg-[#722f22] text-[#faf6f0] border-2 border-[#d4af37] font-mono text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 shadow-xl transition-all scale-105"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>PRESS [E] OR CLICK TO TALK TO {nearWitness.name.split('—')[0]}</span>
          </button>
        </div>
      )}

      {/* Bottom Controls Legend */}
      <footer className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
        <div className="p-3.5 rounded-2xl bg-[#fdfbf7]/90 backdrop-blur-md border border-[#d8c8b4] shadow-md font-mono text-[11px] text-[#38261e] space-y-1.5 max-w-xs">
          <div className="flex items-center space-x-2 text-[#8b3a2b] font-bold text-xs">
            <Gamepad2 className="w-4 h-4" />
            <span>ADVENTURE CONTROLS</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#6d5b52] pt-1">
            <div><span className="font-bold text-[#38261e]">W A S D / Arrows:</span> Move</div>
            <div><span className="font-bold text-[#38261e]">Shift:</span> Sprint / Run</div>
            <div><span className="font-bold text-[#38261e]">Mouse Drag:</span> Orbit Look</div>
            <div><span className="font-bold text-[#38261e]">E / Click:</span> Inspect NPC</div>
          </div>
        </div>
      </footer>

      {/* Active Witness Dialogue / Inspection Modal Card */}
      {selectedWitness && (
        <div className="absolute inset-x-4 bottom-6 sm:bottom-8 sm:left-auto sm:right-8 sm:w-[420px] z-30 pointer-events-auto">
          <div className="p-6 rounded-2xl bg-[#fdfbf7] texture-paper border-2 border-[#d8c8b4] shadow-2xl space-y-4 font-sans text-xs">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#e8dcce]">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fae8e6] text-[#8b3a2b] uppercase">
                  WITNESS 0{selectedWitness.index} DOSSIER
                </span>
                <h3 className="font-serif font-bold text-lg text-[#38261e] mt-1">
                  {selectedWitness.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseWitness}
                className="p-1 rounded-full hover:bg-[#ede3d5] text-[#6d5b52] hover:text-[#38261e] transition-colors"
                aria-label="Close dialogue"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#6d5b52] italic leading-relaxed text-xs">
              "{selectedWitness.role}"
            </p>

            {/* Statement Quote */}
            <div className="p-3.5 rounded-xl bg-[#f5ede2] border border-[#e4d8c8] text-[#38261e] font-serif text-sm italic leading-relaxed">
              "{selectedWitness.dialogue}"
            </div>

            {/* Recovered Clue */}
            <div className="p-3 rounded-xl bg-[#eef3ea] border border-[#9caf88]/40 text-[#4f614b] text-[11px] font-mono">
              <span className="font-bold">FORENSIC CLUE: </span>
              {selectedWitness.clue}
            </div>

            {/* Animation Preview Controls on Inspected Witness */}
            <div className="pt-2 border-t border-[#e8dcce] space-y-2">
              <div className="text-[10px] font-mono text-[#8a7667] font-bold uppercase">
                TEST PROCEDURAL ANIMATION:
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {(['idle', 'walk', 'run', 'interact', 'talk'] as AnimationState[]).map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => {
                      soundFx.playKeypress();
                      setOverrideAnimState(state);
                    }}
                    className={`px-2.5 py-1 rounded-md font-bold uppercase transition-all ${
                      overrideAnimState === state
                        ? 'bg-[#8b3a2b] text-[#faf6f0]'
                        : 'bg-[#f5ede2] text-[#6d5b52] hover:text-[#38261e]'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseWitness}
              className="w-full py-2.5 rounded-xl bg-[#8b3a2b] hover:bg-[#722f22] text-[#faf6f0] font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              RESUME EXPLORING
            </button>
          </div>
        </div>
      )}

      {/* Character Roster Drawer (Inspect all 9 models) */}
      {isRosterOpen && (
        <div className="absolute top-16 right-4 sm:right-8 z-30 w-80 sm:w-96 max-h-[80vh] overflow-y-auto p-5 rounded-2xl bg-[#fdfbf7] texture-paper border-2 border-[#d8c8b4] shadow-2xl space-y-4 pointer-events-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#e8dcce]">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#8b3a2b]">
              <Layers className="w-4 h-4 text-[#8b3a2b]" />
              <span>STYLIZED 3D CHARACTER PACK (9 MODELS)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsRosterOpen(false)}
              className="p-1 rounded-full hover:bg-[#ede3d5] text-[#6d5b52]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {/* Playable Investigator Item */}
            <div className="p-3 rounded-xl bg-[#f5ede2] border border-[#d8c8b4] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#8b3a2b]">
                <span>PLAYER INVESTIGATOR</span>
                <span className="text-[10px] bg-[#8b3a2b] text-[#faf6f0] px-2 py-0.5 rounded-full">PLAYABLE</span>
              </div>
              <p className="font-sans text-[11px] text-[#6d5b52]">
                Detective in orange jacket, teal trousers, mustard scarf (WASD controlled).
              </p>
              <div className="text-[10px] text-[#8a7667]">File: player_investigator.glb • Height: ~2.15u</div>
            </div>

            {/* 8 Witness Items */}
            {WITNESS_NPCS.map((w) => (
              <div
                key={w.id}
                onClick={() => handleSelectWitness(w)}
                className="p-3 rounded-xl bg-[#ffffff] hover:bg-[#fceeeb] border border-[#e8dcce] hover:border-[#d99b9b] cursor-pointer transition-all space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between font-bold text-[#38261e]">
                  <span>{w.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8b3a2b]" />
                </div>
                <p className="font-sans text-[11px] text-[#6d5b52] line-clamp-1">
                  {w.role}
                </p>
                <div className="text-[10px] text-[#8a7667]">
                  Pos: ({w.position[0]}, {w.position[2]}) • Height: ~2.15u
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
