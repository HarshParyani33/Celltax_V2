import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { CharacterProps } from '../../types/game';

interface RigPivots {
  head: THREE.Group;
  torso: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
}

// Predefined pivot coordinates based on 2.15 unit character anatomy
const PIVOT_COORDS = {
  head: [0, 1.25, 0] as const,
  torso: [0, 0.75, 0] as const,
  leftArm: [-0.42, 1.15, 0] as const,
  rightArm: [0.42, 1.15, 0] as const,
  leftLeg: [-0.14, 0.70, 0] as const,
  rightLeg: [0.14, 0.70, 0] as const,
};

export const Character: React.FC<CharacterProps> = ({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animationState = 'idle',
  name: _name,
  isPlayer: _isPlayer = false,
  isHighlighted = false,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const { scene } = useGLTF(modelPath);
  const containerRef = useRef<THREE.Group>(null);
  const animTimeRef = useRef(Math.random() * 100);

  // Setup the procedural rig with cloned scene and pivots
  const { rootObject, pivots } = useMemo(() => {
    // Clone scene deeply
    const cloned = scene.clone(true);

    const headGroup = new THREE.Group();
    headGroup.name = 'headPivot';
    headGroup.position.set(...PIVOT_COORDS.head);

    const torsoGroup = new THREE.Group();
    torsoGroup.name = 'torsoPivot';
    torsoGroup.position.set(...PIVOT_COORDS.torso);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.name = 'leftArmPivot';
    leftArmGroup.position.set(...PIVOT_COORDS.leftArm);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.name = 'rightArmPivot';
    rightArmGroup.position.set(...PIVOT_COORDS.rightArm);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.name = 'leftLegPivot';
    leftLegGroup.position.set(...PIVOT_COORDS.leftLeg);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.name = 'rightLegPivot';
    rightLegGroup.position.set(...PIVOT_COORDS.rightLeg);

    const root = new THREE.Group();
    root.name = 'characterRigRoot';
    root.add(torsoGroup, headGroup, leftArmGroup, rightArmGroup, leftLegGroup, rightLegGroup);

    // Collect all mesh nodes from cloned scene
    const meshes: THREE.Mesh[] = [];
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          // Clone material to allow independent highlight and soft stylized lighting
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else {
            mesh.material = mesh.material.clone();
          }
        }
        meshes.push(mesh);
      }
    });

    // Reparent meshes into their respective joint pivot groups
    meshes.forEach((mesh) => {
      const n = mesh.name;
      let targetGroup: THREE.Group;
      let pivot: readonly [number, number, number];

      if (/^(head|neck|hair|.*ear|.*eye|smile|.*glasses|mouth|hat|cap)/i.test(n)) {
        targetGroup = headGroup;
        pivot = PIVOT_COORDS.head;
      } else if (/^left_(upper_arm|arm|hand|forearm)/i.test(n)) {
        targetGroup = leftArmGroup;
        pivot = PIVOT_COORDS.leftArm;
      } else if (/^right_(upper_arm|arm|hand|forearm)/i.test(n)) {
        targetGroup = rightArmGroup;
        pivot = PIVOT_COORDS.rightArm;
      } else if (/^left_(leg|boot|foot|thigh|shin)/i.test(n)) {
        targetGroup = leftLegGroup;
        pivot = PIVOT_COORDS.leftLeg;
      } else if (/^right_(leg|boot|foot|thigh|shin)/i.test(n)) {
        targetGroup = rightLegGroup;
        pivot = PIVOT_COORDS.rightLeg;
      } else {
        targetGroup = torsoGroup;
        pivot = PIVOT_COORDS.torso;
      }

      // Offset mesh by negative pivot position so it stays in exact world place
      mesh.position.set(-pivot[0], -pivot[1], -pivot[2]);
      targetGroup.add(mesh);
    });

    const rigPivots: RigPivots = {
      head: headGroup,
      torso: torsoGroup,
      leftArm: leftArmGroup,
      rightArm: rightArmGroup,
      leftLeg: leftLegGroup,
      rightLeg: rightLegGroup,
    };

    return { rootObject: root, pivots: rigPivots };
  }, [scene]);

  // Handle highlighting visual effect
  useEffect(() => {
    rootObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat && mat.emissive) {
          if (isHighlighted) {
            mat.emissive.setHex(0x3a2510);
          } else {
            mat.emissive.setHex(0x000000);
          }
        }
      }
    });
  }, [isHighlighted, rootObject]);

  // Procedural Animation Loop
  useFrame((_, delta) => {
    animTimeRef.current += delta;
    const t = animTimeRef.current;

    const { head, torso, leftArm, rightArm, leftLeg, rightLeg } = pivots;

    if (animationState === 'idle') {
      // Idle: subtle breathing and slight head tilt
      const breath = Math.sin(t * 2.2);
      torso.position.y = THREE.MathUtils.lerp(torso.position.y, PIVOT_COORDS.torso[1] + breath * 0.015, 0.1);
      torso.scale.y = THREE.MathUtils.lerp(torso.scale.y, 1 + breath * 0.01, 0.1);
      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 0, 0.1);
      torso.rotation.z = THREE.MathUtils.lerp(torso.rotation.z, 0, 0.1);

      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, Math.sin(t * 0.8) * 0.08, 0.1);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, Math.sin(t * 1.4) * 0.04, 0.1);
      head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, Math.sin(t * 1.1) * 0.02, 0.1);

      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, breath * 0.03, 0.1);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.08, 0.1);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, -breath * 0.03, 0.1);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.08, 0.1);

      leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 0.1);
      rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 0.1);

    } else if (animationState === 'walk') {
      // Walking: alternating arm and leg movement with slight torso bounce
      const cycle = Math.sin(t * 8.5);
      const bounce = Math.abs(Math.sin(t * 8.5));

      leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, cycle * 0.65, 0.25);
      rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, -cycle * 0.65, 0.25);

      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, -cycle * 0.55, 0.25);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.1, 0.2);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, cycle * 0.55, 0.25);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.1, 0.2);

      torso.position.y = THREE.MathUtils.lerp(torso.position.y, PIVOT_COORDS.torso[1] + bounce * 0.06, 0.25);
      torso.rotation.z = THREE.MathUtils.lerp(torso.rotation.z, cycle * 0.035, 0.2);
      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 0.06, 0.1);

      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.05, 0.1);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, cycle * 0.03, 0.1);

    } else if (animationState === 'run') {
      // Running: faster, more exaggerated movement, forward lean and deeper bounce
      const cycle = Math.sin(t * 14);
      const bounce = Math.abs(Math.sin(t * 14));

      leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, cycle * 0.95, 0.35);
      rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, -cycle * 0.95, 0.35);

      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, -cycle * 0.85, 0.35);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.2, 0.2);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, cycle * 0.85, 0.35);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.2, 0.2);

      torso.position.y = THREE.MathUtils.lerp(torso.position.y, PIVOT_COORDS.torso[1] + bounce * 0.11, 0.3);
      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 0.22, 0.2);
      torso.rotation.z = THREE.MathUtils.lerp(torso.rotation.z, cycle * 0.05, 0.2);

      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.12, 0.2);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, 0, 0.2);

    } else if (animationState === 'interact') {
      // Interacting: character reaches forward with right hand, leans in, head turns
      const gesture = Math.sin(t * 3.5);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, -0.85 + gesture * 0.12, 0.15);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.28 + gesture * 0.08, 0.15);
      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0.15, 0.15);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.12, 0.15);

      torso.rotation.x = THREE.MathUtils.lerp(torso.rotation.x, 0.1, 0.15);
      torso.rotation.y = THREE.MathUtils.lerp(torso.rotation.y, 0.08, 0.15);
      torso.position.y = THREE.MathUtils.lerp(torso.position.y, PIVOT_COORDS.torso[1], 0.15);

      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0.12, 0.15);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, Math.sin(t * 2) * 0.1, 0.15);

      leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 0.15);
      rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 0.15);

    } else if (animationState === 'talk') {
      // Talking: expressive head nods, yaw, and gentle conversational gestures
      const nod = Math.sin(t * 3.8) * 0.08 + Math.cos(t * 2.2) * 0.05;
      const turn = Math.sin(t * 1.8) * 0.15;

      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, nod, 0.15);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, turn, 0.15);

      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, -0.35 + Math.sin(t * 3.2) * 0.18, 0.15);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.18, 0.15);

      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, -0.42 + Math.cos(t * 3.5) * 0.22, 0.15);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.22, 0.15);

      torso.position.y = THREE.MathUtils.lerp(torso.position.y, PIVOT_COORDS.torso[1] + Math.sin(t * 2) * 0.015, 0.15);
      torso.rotation.y = THREE.MathUtils.lerp(torso.rotation.y, Math.sin(t * 1.5) * 0.05, 0.15);

      leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, 0.15);
      rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, 0.15);
    }
  });

  const parsedRotation: [number, number, number] =
    typeof rotation === 'number' ? [0, rotation, 0] : rotation;
  const parsedScale: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : scale;

  return (
    <group
      ref={containerRef}
      position={position}
      rotation={parsedRotation}
      scale={parsedScale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onPointerOver?.();
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        onPointerOut?.();
      }}
    >
      <primitive object={rootObject} />

      {/* Stylized circular contact shadow beneath character */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.55, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.25} transparent />
      </mesh>
    </group>
  );
};

// Preload all 9 models so scene switches and spawns are instantaneous
useGLTF.preload('/models/characters/player_investigator.glb');
for (let i = 1; i <= 8; i++) {
  useGLTF.preload(`/models/characters/witness_0${i}.glb`);
}
