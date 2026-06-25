import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Html } from "@react-three/drei";

// --- Placeholder Avatar ---
function PlaceholderAvatar({ speaking }) {
  const group = useRef();
  const head = useRef();
  const rightArm = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.position.y = Math.sin(t * 1.2) * 0.04; // Breathing
    
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.6) * 0.1; // Sway
    }

    // Speaking gesture
    if (rightArm.current) {
      if (speaking) {
        rightArm.current.rotation.z = -1.1 + Math.sin(t * 4) * 0.2;
      } else {
        rightArm.current.rotation.z = -1.3;
      }
    }
  });

  return (
    <group ref={group} position={[0, -1.4, 0]}>
      {/* Head */}
      <group ref={head} position={[0, 2.55, 0]}>
        <mesh><sphereGeometry args={[0.32, 32, 32]} /><meshStandardMaterial color="#e0b89a" roughness={0.6} /></mesh>
        <mesh position={[0, 0.14, -0.02]}><sphereGeometry args={[0.33, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7]} /><meshStandardMaterial color="#1a1410" /></mesh>
        {/* Eyes */}
        <mesh position={[0.11, 0.03, 0.28]}><sphereGeometry args={[0.035, 16, 16]} /><meshStandardMaterial color="#1a1410" /></mesh>
        <mesh position={[-0.11, 0.03, 0.28]}><sphereGeometry args={[0.035, 16, 16]} /><meshStandardMaterial color="#1a1410" /></mesh>
      </group>
      {/* Body */}
      <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.42, 0.55, 1.1, 16]} /><meshStandardMaterial color="#f3f4f6" /></mesh>
      <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.5, 0.4, 0.4, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
      {/* Arms */}
      <group ref={rightArm} position={[0.52, 2.0, 0]}>
         <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.09, 0.1, 0.7, 16]} /><meshStandardMaterial color="#f3f4f6" /></mesh>
      </group>
      <group position={[-0.52, 2.0, 0]}>
         <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.09, 0.1, 0.7, 16]} /><meshStandardMaterial color="#f3f4f6" /></mesh>
      </group>
    </group>
  );
}

// --- Holo Rings ---
function HoloRing({ radius, color, speed, y = 0 }) {
  const ref = useRef();
  useFrame((state, delta) => { if (ref.current) ref.current.rotation.z += delta * speed; });
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[radius, 0.01, 8, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// --- Name Plate ---
function NamePlate({ visible }) {
  if (!visible) return null;
  return (
    <Html position={[0, 3.1, 0]} center distanceFactor={8}>
      <div className="glass-panel">
        <div className="name">OMKAR JADHAV</div>
        <div className="role">Full Stack Developer</div>
      </div>
    </Html>
  );
}

// --- Main Component ---
export default function Hero3D({ speaking, showNamePlate }) {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas camera={{ position: [0, 1.2, 5.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1} />
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
          <PlaceholderAvatar speaking={speaking} />
          <NamePlate visible={showNamePlate} />
        </Float>
        <HoloRing radius={1.8} color="#3aa0ff" speed={0.15} y={0.2} />
        <HoloRing radius={2.2} color="#9d4dff" speed={-0.1} y={-0.3} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      {/* Inline styles for HTML overlay */}
      <style jsx>{`
        .glass-panel {
          background: rgba(10, 16, 30, 0.7);
          border: 1px solid rgba(58, 160, 255, 0.5);
          border-radius: 8px;
          padding: 8px 16px;
          text-align: center;
          backdrop-filter: blur(6px);
          box-shadow: 0 0 15px rgba(58, 160, 255, 0.3);
        }
        .name { font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #7fc4ff; }
        .role { font-size: 10px; color: #aaa; margin-top: 2px; }
      `}</style>
    </div>
  );
}