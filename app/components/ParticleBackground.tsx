"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Starfield({ count = 350 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Scatter in a large sphere for space depth
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 12;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      positions[i * 3 + 2] = Math.cos(phi) * radius;

      // Varied star colors: white, blue-white, faint purple
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.85) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 0.95;
      } else {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0.9;
      }

      // Varied sizes: most tiny (distant stars), some larger
      sizes[i] = Math.random() < 0.85
        ? Math.random() * 0.015 + 0.003
        : Math.random() * 0.05 + 0.02;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  const materialRef = useRef<THREE.PointsMaterial>(null);
  const twinkleRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Slow drift like floating through space
    meshRef.current.rotation.y += delta * 0.025;
    meshRef.current.rotation.x += delta * 0.012;
    meshRef.current.rotation.z += delta * 0.006;

    // Subtle twinkle pulsation
    if (materialRef.current) {
      twinkleRef.current += delta * 0.8;
      materialRef.current.opacity = 0.55 + Math.sin(twinkleRef.current) * 0.1;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.04}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Starfield count={350} />
      </Canvas>
    </div>
  );
}
