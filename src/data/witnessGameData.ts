import { WitnessData } from '../types/game';

export const WITNESS_NPCS: WitnessData[] = [
  {
    id: 'witness-01',
    index: 1,
    name: 'Witness 01 — The Dramatic One',
    role: 'Expressive, theatrical friend with a flair for the dramatic.',
    modelUrl: '/models/characters/witness_01.glb',
    position: [8.5, 0, 0],
    rotation: -Math.PI / 2,
    dialogue: "I saw her! She vanished in a flurry of absolute elegance and laughter near the observation tower!",
    clue: "Mentioned seeing footsteps leading toward the coastal overlook."
  },
  {
    id: 'witness-02',
    index: 2,
    name: 'Witness 02 — The Softie',
    role: 'Gentle, sentimental friend who remembers every sweet detail.',
    modelUrl: '/models/characters/witness_02.glb',
    position: [6.0, 0, 6.0],
    rotation: -Math.PI * 0.75,
    dialogue: "She gave the warmest hug and told me this birthday was going to be an unforgettable adventure.",
    clue: "Noticed a bouquet of wildflowers left by the trail entrance."
  },
  {
    id: 'witness-03',
    index: 3,
    name: 'Witness 03 — The Chaos One',
    role: 'Chaotic, hilarious friend with boundless energy.',
    modelUrl: '/models/characters/witness_03.glb',
    position: [0, 0, 8.5],
    rotation: Math.PI,
    dialogue: "Listen, I might have challenged her to a race to the scenic lookout and lost immediately!",
    clue: "Confirms she was heading uphill toward the golden-hour viewpoint."
  },
  {
    id: 'witness-04',
    index: 4,
    name: 'Witness 04 — The Old Friend',
    role: 'Calm, thoughtful childhood friend with glasses and wisdom.',
    modelUrl: '/models/characters/witness_04.glb',
    position: [-6.0, 0, 6.0],
    rotation: Math.PI * 0.75,
    dialogue: "We've shared so many milestones together. Wherever she's hiding, she's definitely smiling.",
    clue: "Heard an audio cassette playing her favorite upbeat melody."
  },
  {
    id: 'witness-05',
    index: 5,
    name: 'Witness 05 — The Secret Keeper',
    role: 'Mysterious, loyal confidant who holds confidential clues.',
    modelUrl: '/models/characters/witness_05.glb',
    position: [-8.5, 0, 0],
    rotation: Math.PI / 2,
    dialogue: "I promised not to reveal the exact coordinates, but check the compass bearings on your map!",
    clue: "Hints that all evidence items converge at the final curatorial reveal."
  },
  {
    id: 'witness-06',
    index: 6,
    name: 'Witness 06 — The Sarcastic One',
    role: 'Witty friend whose jokes hide immense affection.',
    modelUrl: '/models/characters/witness_06.glb',
    position: [-6.0, 0, -6.0],
    rotation: Math.PI * 0.25,
    dialogue: "Oh sure, 'missing.' More like sneaking off to enjoy the birthday cake before everyone else!",
    clue: "Saw someone with a radiant smile carrying a vintage camera."
  },
  {
    id: 'witness-07',
    index: 7,
    name: 'Witness 07 — The Observer',
    role: 'Quiet, observant friend who notices the little things.',
    modelUrl: '/models/characters/witness_07.glb',
    position: [0, 0, -8.5],
    rotation: 0,
    dialogue: "I saw the golden light catch her eyes right as she climbed up toward the ridge. It was magical.",
    clue: "Confirms the time of sighting coincided with the golden hour solstice."
  },
  {
    id: 'witness-08',
    index: 8,
    name: 'Witness 08 — The Final Witness',
    role: 'The confidant who holds the key to the final destination.',
    modelUrl: '/models/characters/witness_08.glb',
    position: [6.0, 0, -6.0],
    rotation: -Math.PI * 0.25,
    dialogue: "Investigator, your journey is almost complete. Follow the path right to the scenic overlook!",
    clue: "The final revelation awaits at the master curatorial destination."
  }
];
