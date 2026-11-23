# Stylized Adventure Character Pack

A set of 9 original, low-poly, playful adventure-game character models for the browser game prototype. The visual direction is broadly inspired by colorful co-op adventure games such as PEAK, without copying PEAK character designs or using game-ripped assets.

## Included
- `player_investigator.glb` — playable investigator
- `witness_01.glb` through `witness_08.glb` — eight distinct witness silhouettes/colorways
- `manifest.json` — names, roles, file paths and model conventions

## Important model notes
- Format: binary glTF (`.glb`)
- Up axis: `+Y`; character faces `+Z`
- Approximate height: 2.15 scene units
- Models are **not skeletal-rigged**. Body parts are exported as separate named meshes (head, torso, arms, hands, legs, boots, hair, backpack, accessories) so Antigravity can animate them with simple Three.js transforms for idle, walk, run and interaction.
- These are stylized prototype models, not production-quality scanned/hand-authored characters.

## React Three Fiber loading
Install/use `@react-three/drei` and load each model with `useGLTF`. Since meshes are separate nodes, Antigravity can reference them by node name and animate arm/leg rotations. Keep a shared character controller and swap the GLB path for each witness.

Example:
```tsx
import { useGLTF } from '@react-three/drei';

function CharacterModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} />;
}
```

## Integration guidance for Antigravity
1. Copy `models/` into `public/models/characters/`.
2. Load the investigator as the player model and the eight witness models as NPCs.
3. Use the separate named meshes for procedural animation (idle breathing, arm swing, leg swing, head turns).
4. Add collision capsules in the game physics layer; the GLBs do not contain physics.
5. Replace placeholder characters later if you decide to commission or create custom rigged models.

## License / provenance
These models were generated procedurally for this project. They are not official PEAK or Roblox assets, and they do not reproduce their proprietary character models.
