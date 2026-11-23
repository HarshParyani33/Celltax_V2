import React from 'react';
import { WITNESS_NPCS } from '../../data/witnessGameData';

export const TestRoomEnvironment: React.FC = () => {
  return (
    <group name="testRoomEnvironment">
      {/* Soft atmospheric lighting */}
      <ambientLight intensity={0.7} />
      
      {/* Hemisphere light: soft blue sky, warm earth ground */}
      <hemisphereLight
        color="#cce0ff"
        groundColor="#e0b894"
        intensity={0.65}
      />

      {/* Warm directional sunlight casting soft real-time shadows */}
      <directionalLight
        position={[18, 28, 16]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#faf6f0', 25, 65]} />

      {/* Ground Grass Expanse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#88a870" roughness={0.9} />
      </mesh>

      {/* Main Stone Courtyard Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[14.5, 48]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.75} />
      </mesh>

      {/* Decorative Outer Stone Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[13.8, 14.6, 48]} />
        <meshStandardMaterial color="#c5a059" roughness={0.6} />
      </mesh>

      {/* Inner Decorative Dial Pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[6.8, 7.1, 48]} />
        <meshStandardMaterial color="#d4c3b0" roughness={0.8} />
      </mesh>

      {/* Central Compass Pedestal (Obstacle) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.0, 0.5, 32]} />
          <meshStandardMaterial color="#dfd2c0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 1.5, 0.2, 32]} />
          <meshStandardMaterial color="#c5a059" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Decorative Compass Star Point */}
        <mesh position={[0, 0.66, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.15, 8]} />
          <meshStandardMaterial color="#8b3a2b" roughness={0.6} />
        </mesh>
      </group>

      {/* Stylized Perimeter Wall Posts & Curbs */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 24;
        const radius = 14.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Low-poly stone pillar */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 1.2, 0.8]} />
              <meshStandardMaterial color="#bfaea0" roughness={0.85} />
            </mesh>
            {/* Pillar cap */}
            <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.95, 0.15, 0.95]} />
              <meshStandardMaterial color="#8c5e58" roughness={0.7} />
            </mesh>
            {/* Lantern on select posts */}
            {i % 3 === 0 && (
              <group position={[0, 1.5, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.3, 0.45, 0.3]} />
                  <meshStandardMaterial color="#38261e" roughness={0.5} />
                </mesh>
                <pointLight color="#f5d696" intensity={1.5} distance={6} decay={2} />
              </group>
            )}
          </group>
        );
      })}

      {/* 8 Witness Inspection Pedestals */}
      {WITNESS_NPCS.map((w) => (
        <group key={w.id} position={w.position}>
          {/* Circular stone stand */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.35, 0.16, 24]} />
            <meshStandardMaterial color="#f0e4d7" roughness={0.7} />
          </mesh>
          {/* Polished brass rim */}
          <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[1.05, 1.18, 24]} />
            <meshStandardMaterial color="#c5a059" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Station identification plate */}
          <mesh position={[0, 0.18, 1.15]} rotation={[-Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.8, 0.25, 0.05]} />
            <meshStandardMaterial color="#8b3a2b" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Decorative Adventure Props: Supply Crates & Barrels (Collidable) */}
      {/* Cluster 1 (North-West) */}
      <group position={[-3.5, 0, 3.5]}>
        <mesh position={[0, 0.45, 0]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color="#a67c52" roughness={0.8} />
        </mesh>
        <mesh position={[0.7, 0.35, 0.2]} rotation={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#8a623e" roughness={0.8} />
        </mesh>
      </group>

      {/* Cluster 2 (South-East) */}
      <group position={[4.0, 0, -3.0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, -0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshStandardMaterial color="#967049" roughness={0.8} />
        </mesh>
        <mesh position={[-0.6, 0.35, -0.2]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.7, 16]} />
          <meshStandardMaterial color="#5c3d2e" roughness={0.7} />
        </mesh>
      </group>

      {/* Low-Poly Pine Trees around the perimeter for PEAK adventure atmosphere */}
      {[
        [-16, -8], [-17, 3], [-14, 15], [3, 17], [16, 12], [17, -4], [13, -15], [-5, -17]
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          {/* Trunk */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 1.6, 8]} />
            <meshStandardMaterial color="#4a3121" roughness={0.9} />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[1.8, 2.2, 7]} />
            <meshStandardMaterial color="#4d7045" roughness={0.85} />
          </mesh>
          <mesh position={[0, 3.4, 0]} castShadow>
            <coneGeometry args={[1.4, 1.8, 7]} />
            <meshStandardMaterial color="#5a8252" roughness={0.85} />
          </mesh>
          <mesh position={[0, 4.4, 0]} castShadow>
            <coneGeometry args={[0.9, 1.4, 7]} />
            <meshStandardMaterial color="#68945f" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
