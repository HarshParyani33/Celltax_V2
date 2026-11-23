import React from 'react';
import { Html } from '@react-three/drei';
import { Character } from './Character';
import { WitnessData } from '../../types/game';

interface WitnessNPCProps {
  witness: WitnessData;
  isNear: boolean;
  isTalking: boolean;
  onSelect: (witness: WitnessData) => void;
}

export const WitnessNPC: React.FC<WitnessNPCProps> = ({
  witness,
  isNear,
  isTalking,
  onSelect,
}) => {
  return (
    <group position={witness.position}>
      <Character
        modelPath={witness.modelUrl}
        position={[0, 0, 0]}
        rotation={[0, witness.rotation, 0]}
        animationState={isTalking ? 'talk' : 'idle'}
        name={witness.name}
        role={witness.role}
        isHighlighted={isNear || isTalking}
        onClick={() => onSelect(witness)}
      />

      {/* Floating Overhead Nameplate / Interactive Prompt */}
      <Html
        position={[0, 2.35, 0]}
        center
        distanceFactor={14}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={() => onSelect(witness)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all whitespace-nowrap shadow-md flex items-center space-x-1.5 cursor-pointer ${
            isNear || isTalking
              ? 'bg-[#8b3a2b] text-[#faf6f0] border-2 border-[#d4af37] scale-105 animate-pulse'
              : 'bg-[#fdfbf7]/90 text-[#38261e] border border-[#d8c8b4] hover:bg-[#8b3a2b] hover:text-[#faf6f0]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
          <span className="font-bold">WITNESS 0{witness.index}</span>
          {isNear && <span className="bg-[#d4af37] text-[#38261e] text-[9px] px-1.5 py-0.2 rounded font-black">[E]</span>}
        </button>
      </Html>
    </group>
  );
};
