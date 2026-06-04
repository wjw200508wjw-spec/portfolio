"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 500;
const MAX_RADIUS = 16;

function GlowSprite() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.02, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.08, "rgba(230,240,255,0.55)");
    gradient.addColorStop(0.2, "rgba(160,200,240,0.18)");
    gradient.addColorStop(0.4, "rgba(80,130,200,0.04)");
    gradient.addColorStop(0.7, "rgba(20,50,100,0.005)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function DriftField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const glowTexture = GlowSprite();

  // Per particle: x, y, z, vx, vy, vz, life, maxLife, baseSize
  const particleData = useRef(new Float32Array(PARTICLE_COUNT * 9));

  useMemo(() => {
    const d = particleData.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      initParticle(d, i, Math.random());
    }
  }, []);

  function initParticle(d: Float32Array, i: number, lifeOffset: number) {
    const idx = i * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const dirX = Math.sin(phi) * Math.cos(theta);
    const dirY = Math.sin(phi) * Math.sin(theta);
    const dirZ = Math.cos(phi);

    // Start anywhere along the radius
    const startR = 0.3 + Math.random() * MAX_RADIUS;
    d[idx] = dirX * startR;
    d[idx + 1] = dirY * startR;
    d[idx + 2] = dirZ * startR;

    // Very slow outward drift — feels like receding into space
    const speed = 0.04 + Math.random() * 0.25;
    d[idx + 3] = dirX * speed;
    d[idx + 4] = dirY * speed;
    d[idx + 5] = dirZ * speed;

    d[idx + 6] = lifeOffset * (18 + Math.random() * 25); // random life phase
    d[idx + 7] = 18 + Math.random() * 25;               // max life
    d[idx + 8] = 0.015 + Math.random() * 0.07;          // base size
  }

  const positionsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const colorsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const sizesRef = useRef(new Float32Array(PARTICLE_COUNT));

  useFrame((_, delta) => {
    const d = particleData.current;
    const pos = positionsRef.current;
    const col = colorsRef.current;
    const siz = sizesRef.current;

    // Clamp delta to avoid jumps on tab switch
    const dt = Math.min(delta, 0.1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 9;
      let x = d[idx];
      let y = d[idx + 1];
      let z = d[idx + 2];
      const vx = d[idx + 3];
      const vy = d[idx + 4];
      const vz = d[idx + 5];
      let life = d[idx + 6] + dt;
      const maxLife = d[idx + 7];
      const baseSize = d[idx + 8];

      // Slow outward movement
      x += vx * dt;
      y += vy * dt;
      z += vz * dt;
      let dist = Math.sqrt(x * x + y * y + z * z);

      // When particle drifts too far, respawn near center
      if (dist > MAX_RADIUS || life > maxLife) {
        const theta2 = Math.random() * Math.PI * 2;
        const phi2 = Math.acos(2 * Math.random() - 1);
        const ndx = Math.sin(phi2) * Math.cos(theta2);
        const ndy = Math.sin(phi2) * Math.sin(theta2);
        const ndz = Math.cos(phi2);
        const nSpeed = 0.04 + Math.random() * 0.25;

        const spawnR = 0.1 + Math.random() * 0.6;
        x = ndx * spawnR;
        y = ndy * spawnR;
        z = ndz * spawnR;
        d[idx + 3] = ndx * nSpeed;
        d[idx + 4] = ndy * nSpeed;
        d[idx + 5] = ndz * nSpeed;
        d[idx + 7] = 18 + Math.random() * 25;
        d[idx + 8] = 0.015 + Math.random() * 0.07;
        life = 0;
        dist = spawnR;
      }

      d[idx] = x;
      d[idx + 1] = y;
      d[idx + 2] = z;
      d[idx + 6] = life;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Distance-based size: larger when close, tiny when far
      const distRatio = dist / MAX_RADIUS;
      const nearBoost = 1 + (1 - distRatio) * 3.0; // up to 4x bigger near center
      const lifeRatio = life / maxLife;
      const fadeIn = Math.min(life / 1.5, 1);
      const fadeOut = 1 - Math.max(0, (lifeRatio - 0.6) * 2.5);
      const alpha = fadeIn * fadeOut;

      siz[i] = baseSize * nearBoost * alpha;

      // Warm white near, cool blue far
      col[i * 3] = 0.85 + 0.15 * (1 - distRatio);
      col[i * 3 + 1] = 0.85 + 0.15 * (1 - distRatio * 0.5);
      col[i * 3 + 2] = 0.75 + 0.25 * distRatio;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.5 + Math.sin(performance.now() * 0.0003) * 0.06;
    }
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positionsRef.current, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colorsRef.current, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizesRef.current, 1));
    return g;
  }, []);

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        ref={materialRef}
        map={glowTexture}
        size={0.22}
        vertexColors
        transparent
        opacity={0.5}
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
        camera={{ position: [0, 0, 0], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#000000" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <DriftField />
      </Canvas>
    </div>
  );
}
