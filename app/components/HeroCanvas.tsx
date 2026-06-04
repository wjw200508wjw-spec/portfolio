"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function Particles({ count = 500 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.03;
    meshRef.current.rotation.x += delta * 0.01;
    const targetY = -scrollRef.current * 2;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#667799"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function DataTitle3D() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);

  // 4-second slow rotation from side to front
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.PI * 0.45; // ~80° start

    gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 4.0,
      ease: "power2.inOut",
      delay: 0.2,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    // Scroll-driven rotation away
    const targetRY = scrollRef.current * 0.7;
    groupRef.current.rotation.y += (targetRY - groupRef.current.rotation.y) * 0.03;

    // Fade out on scroll
    const targetOpacity = 1 - scrollRef.current * 1.2;
    groupRef.current.children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        if ("opacity" in mat) {
          (mat as THREE.MeshStandardMaterial).opacity = targetOpacity;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Text
        fontSize={2.5}
        letterSpacing={-0.05}
        color="#ffffff"
        position={[0, 0.2, 0]}
        anchorX="center"
        anchorY="middle"
        depthOffset={0.2}
      >
        Data
      </Text>
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.0} />
      <directionalLight position={[-3, 1, -2]} intensity={0.3} />
      <DataTitle3D />
      <Particles count={500} />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#000000" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
