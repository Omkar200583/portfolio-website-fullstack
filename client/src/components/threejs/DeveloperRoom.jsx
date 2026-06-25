import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';

// Simple Abstract Desk Component
const Desk = () => {
  return (
    <group>
      <Box args={[4, 0.2, 2]} position={[0, 1, 0]} color="#333">
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </Box>
      <Box args={[0.2, 2, 0.2]} position={[-1.8, 0, -0.8]} color="#555" />
      <Box args={[0.2, 2, 0.2]} position={[1.8, 0, -0.8]} color="#555" />
      {/* Laptop placeholder */}
      <Box args={[1.5, 1, 0.1]} position={[0, 1.8, -0.5]} rotation={[-0.2, 0, 0]}>
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} />
      </Box>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Desk />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const DeveloperRoom = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default DeveloperRoom;