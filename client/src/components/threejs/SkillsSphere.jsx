import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

const SkillOrb = ({ position, color }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
    </Float>
  );
};

export default function SkillsScene() {
  const skills = [
    [0, 0, 0, '#00f3ff'],       // Center (Core)
    [1.5, 0.5, 0, '#bc13fe'],   // Right
    [-1.5, -0.5, 0.5, '#ff003c'],// Left
    [0, 1.5, -1, '#ffff00'],    // Top
    [0.5, -1.5, 1, '#00ff00'],  // Bottom
  ];

  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {skills.map((skill, i) => (
          <SkillOrb key={i} position={[skill[0], skill[1], skill[2]]} color={skill[3]} />
        ))}

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}