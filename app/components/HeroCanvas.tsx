"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";

// ---- Particles ----
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
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ---- 3D Text ----
function DataTitle3D() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);
  const [font, setFont] = useState<any>(null);
  const startedRef = useRef(false);

  // Load font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_bold.typeface.json", (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  // Start rotation animation once font is loaded
  useEffect(() => {
    if (!font || !groupRef.current || startedRef.current) return;
    startedRef.current = true;

    groupRef.current.rotation.y = Math.PI * 0.44; // ~80°
    groupRef.current.scale.set(1.8, 1.8, 1.8);    // start large

    gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 4.0,
      ease: "none",
      delay: 1.0,
    });
    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 4.0,
      ease: "none",
      delay: 1.0,
    });
  }, [font]);

  // Scroll-driven rotation reverse + fade
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const s = scrollRef.current;
    // Blend toward scroll-driven rotation
    const targetRY = s * 0.8;
    groupRef.current.rotation.y += (targetRY - groupRef.current.rotation.y) * 0.04;

    // Fade children
    const targetOpacity = 1 - s * 1.3;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity += (Math.max(0, targetOpacity) - mat.opacity) * 0.05;
        }
      }
    });
  });

  // Create geometry from loaded font
  const geometry = useMemo(() => {
    if (!font) return null;
    return new TextGeometry("Data", {
      font,
      size: 2.8,
      depth: 0.6,       // Wide extrusion for visible 3D thickness
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
  }, [font]);

  if (!geometry) return null;

  // Center the geometry
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const centerX = -(box.max.x - box.min.x) / 2 - box.min.x;
  const centerY = -(box.max.y - box.min.y) / 2 - box.min.y;

  return (
    <group ref={groupRef} position={[centerX, centerY, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
}

// ---- Scene ----
function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 5, 8]} intensity={2.0} />
      <directionalLight position={[-5, 3, -3]} intensity={0.8} />
      <directionalLight position={[0, -2, 5]} intensity={0.4} />
      <pointLight position={[0, 0, 6]} intensity={0.5} color="#ffffff" />
      <Suspense fallback={null}>
        <DataTitle3D />
      </Suspense>
      <Particles count={500} />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 40 }}
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
