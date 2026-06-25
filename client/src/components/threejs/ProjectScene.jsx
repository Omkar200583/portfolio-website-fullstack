import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, OrbitControls } from '@react-three/drei';

const AnimatedSphere = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={1.8}>
      <MeshDistortMaterial
        color="#00f3ff"
        attach="material"
        distort={0.4} // Slightly reduced distort for better performance
        speed={2}
        roughness={0.2}
        emissive="#00f3ff"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
};

export default function ProjectScene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}