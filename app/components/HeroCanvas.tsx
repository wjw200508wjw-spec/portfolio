"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

const COUNT = 800;

function ParticleField({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);
  const currentPositions = useRef<Float32Array | null>(null);
  const scrollValue = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (v) => { scrollValue.current = v; });

  // Init positions
  const geometry = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1 + Math.random() * 8;
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      pos[i * 3 + 2] = Math.cos(phi) * r;
    }
    basePositions.current = new Float32Array(pos);
    currentPositions.current = new Float32Array(pos);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
    geo.setDrawRange(0, COUNT);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !basePositions.current || !currentPositions.current) return;
    const base = basePositions.current;
    const cur = currentPositions.current;
    const s = scrollValue.current;

    // Dispersion increases with scroll
    const dispersion = 1 + s * 4;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];
      // Expand outward
      cur[i3] += (bx * dispersion - cur[i3]) * 0.02;
      cur[i3 + 1] += (by * dispersion - cur[i3 + 1]) * 0.02;
      cur[i3 + 2] += (bz * dispersion - cur[i3 + 2]) * 0.02;
    }

    // Slow rotation
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;

    pointsRef.current.geometry.attributes.position.array.set(cur.subarray(0, COUNT * 3));
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.04} color="#c0c8e0" transparent opacity={0.6}
        blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function HeroCanvas({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }} style={{ background: "#000000" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}>
        <ParticleField scrollProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
