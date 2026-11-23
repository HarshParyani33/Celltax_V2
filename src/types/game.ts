export type AnimationState = 'idle' | 'walk' | 'run' | 'interact' | 'talk';

export interface WitnessData {
  id: string;
  index: number;
  name: string;
  role: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: number; // Y rotation in radians
  dialogue: string;
  clue: string;
}

export interface CollisionObstacle {
  id: string;
  type: 'cylinder' | 'box';
  position: [number, number, number];
  radius?: number;
  size?: [number, number, number];
}

export interface CharacterProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number] | number;
  scale?: number | [number, number, number];
  animationState?: AnimationState;
  name?: string;
  role?: string;
  isPlayer?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}
