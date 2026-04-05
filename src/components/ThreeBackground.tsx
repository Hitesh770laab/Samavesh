"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";

function Particles({ count = 1000 }) {
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 50;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#6366f1" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[10, 5, -10]}>
          <MeshDistortMaterial color="#8b5cf6" speed={3} distort={0.4} />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={3}>
        <mesh position={[-12, -5, -15]}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#3b82f6" wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[15, -10, -5]}>
          <torusGeometry args={[3, 0.5, 16, 100]} />
          <meshStandardMaterial color="#ec4899" transparent opacity={0.3} />
        </mesh>
      </Float>
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <Particles count={2000} />
        <FloatingShapes />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
