import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Character } from './Character';
import { AnimationState, WitnessData } from '../../types/game';
import { WITNESS_NPCS } from '../../data/witnessGameData';

interface PlayerControllerProps {
  onNearWitnessChange?: (witness: WitnessData | null) => void;
  onInteractWitness?: (witness: WitnessData) => void;
  isInteracting?: boolean;
}

// Collidable obstacles in the test room
const OBSTACLES = [
  // Central Compass Pedestal
  { x: 0, z: 0, radius: 2.1 },
  // Crate Cluster 1 (North-West)
  { x: -3.5, z: 3.5, radius: 1.4 },
  // Crate Cluster 2 (South-East)
  { x: 4.0, z: -3.0, radius: 1.4 },
  // 8 Witness NPC Pedestals
  ...WITNESS_NPCS.map((w) => ({ x: w.position[0], z: w.position[2], radius: 1.25 })),
];

const ROOM_RADIUS_LIMIT = 13.8;
const PLAYER_COLLISION_RADIUS = 0.5;

export const PlayerController: React.FC<PlayerControllerProps> = ({
  onNearWitnessChange,
  onInteractWitness,
  isInteracting = false,
}) => {
  const { camera, gl } = useThree();

  // Position, velocity and rotation of the player
  const playerPos = useRef(new THREE.Vector3(0, 0, 4));
  const playerRotY = useRef(Math.PI);
  const [animState, setAnimState] = useState<AnimationState>('idle');

  // Input state
  const keys = useRef<{ [key: string]: boolean }>({});
  const isDragging = useRef(false);
  const previousMousePos = useRef({ x: 0, y: 0 });

  // Camera spherical angles
  const cameraAngleTheta = useRef(0); // Horizontal rotation around player
  const cameraAnglePhi = useRef(0.45); // Vertical pitch angle (radians from horizon)
  const cameraDistance = useRef(6.5); // Distance from player

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;

      // Handle 'E' for interaction
      if (e.code === 'KeyE') {
        // Find nearest witness
        const nearest = findNearestWitness();
        if (nearest) {
          onInteractWitness?.(nearest);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteractWitness]);

  // Handle mouse camera orbit drag
  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - previousMousePos.current.x;
      const dy = e.clientY - previousMousePos.current.y;
      previousMousePos.current = { x: e.clientX, y: e.clientY };

      cameraAngleTheta.current -= dx * 0.007;
      cameraAnglePhi.current = Math.max(0.15, Math.min(1.2, cameraAnglePhi.current + dy * 0.005));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance.current = Math.max(3.5, Math.min(12, cameraDistance.current + e.deltaY * 0.005));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gl]);

  // Find nearest witness within range
  const findNearestWitness = useCallback((): WitnessData | null => {
    let nearest: WitnessData | null = null;
    let minDist = 2.8;

    for (const w of WITNESS_NPCS) {
      const dx = playerPos.current.x - w.position[0];
      const dz = playerPos.current.z - w.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        nearest = w;
      }
    }
    return nearest;
  }, []);

  // Frame update: Movement, collisions, camera tracking, and animation states
  useFrame((_, delta) => {
    // Determine movement direction from input
    let moveForward = 0;
    let moveRight = 0;

    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveForward += 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveForward -= 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveRight -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveRight += 1;

    const isRunning = keys.current['ShiftLeft'] || keys.current['ShiftRight'];
    const isMoving = moveForward !== 0 || moveRight !== 0;

    // Determine target animation state
    let targetAnim: AnimationState = 'idle';
    if (isInteracting) {
      targetAnim = 'interact';
    } else if (isMoving) {
      targetAnim = isRunning ? 'run' : 'walk';
    }
    setAnimState(targetAnim);

    if (isMoving && !isInteracting) {
      // Calculate movement vector relative to camera horizontal angle
      const speed = isRunning ? 7.2 : 3.8;
      const camTheta = cameraAngleTheta.current;

      // Camera forward and right directions on the horizontal XZ plane
      const camForwardX = Math.sin(camTheta);
      const camForwardZ = -Math.cos(camTheta);
      const camRightX = Math.cos(camTheta);
      const camRightZ = Math.sin(camTheta);

      const dirX = camForwardX * moveForward + camRightX * moveRight;
      const dirZ = camForwardZ * moveForward + camRightZ * moveRight;
      const len = Math.sqrt(dirX * dirX + dirZ * dirZ);

      if (len > 0.001) {
        const normDirX = dirX / len;
        const normDirZ = dirZ / len;

        // Proposed position delta
        let nextX = playerPos.current.x + normDirX * speed * delta;
        let nextZ = playerPos.current.z + normDirZ * speed * delta;

        // 1. Boundary circle collision (sliding along room perimeter)
        const distFromCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);
        if (distFromCenter > ROOM_RADIUS_LIMIT) {
          const factor = ROOM_RADIUS_LIMIT / distFromCenter;
          nextX *= factor;
          nextZ *= factor;
        }

        // 2. Obstacle circle collisions (sliding response)
        for (const obs of OBSTACLES) {
          const minDist = obs.radius + PLAYER_COLLISION_RADIUS;
          const ox = nextX - obs.x;
          const oz = nextZ - obs.z;
          const distSq = ox * ox + oz * oz;

          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            if (dist > 0.0001) {
              const pushX = (ox / dist) * (minDist - dist);
              const pushZ = (oz / dist) * (minDist - dist);
              nextX += pushX;
              nextZ += pushZ;
            }
          }
        }

        playerPos.current.x = nextX;
        playerPos.current.z = nextZ;

        // Smoothly rotate character towards movement direction
        const targetRotY = Math.atan2(normDirX, normDirZ);
        // Shortest angular distance lerp
        let diff = targetRotY - playerRotY.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        playerRotY.current += diff * Math.min(1, delta * 14);
      }
    }

    // Check nearest witness and update notification
    const nearWitness = findNearestWitness();
    onNearWitnessChange?.(nearWitness);

    // Smoothly update camera to orbit and track player
    const targetCamX =
      playerPos.current.x -
      Math.sin(cameraAngleTheta.current) * Math.cos(cameraAnglePhi.current) * cameraDistance.current;
    const targetCamY =
      playerPos.current.y + 1.2 + Math.sin(cameraAnglePhi.current) * cameraDistance.current;
    const targetCamZ =
      playerPos.current.z +
      Math.cos(cameraAngleTheta.current) * Math.cos(cameraAnglePhi.current) * cameraDistance.current;

    camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.1);
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.2, playerPos.current.z);
  });

  return (
    <group position={[playerPos.current.x, 0, playerPos.current.z]}>
      <Character
        modelPath="/models/characters/player_investigator.glb"
        position={[0, 0, 0]}
        rotation={[0, playerRotY.current, 0]}
        animationState={animState}
        isPlayer={true}
        name="Investigator"
      />
    </group>
  );
};
