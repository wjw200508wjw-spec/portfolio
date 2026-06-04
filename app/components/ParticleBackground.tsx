"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 600;
const MAX_RADIUS = 14;
const SPAWN_RATE = 0.6; // particles per second regenerated

function GlowSprite() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.03, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.1, "rgba(220,235,255,0.5)");
    gradient.addColorStop(0.25, "rgba(150,190,240,0.15)");
    gradient.addColorStop(0.5, "rgba(60,100,160,0.03)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function ExpandingField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const glowTexture = GlowSprite();

  // Each particle: [x, y, z, vx, vy, vz, life, maxLife, baseSize]
  const particleData = useRef(new Float32Array(PARTICLE_COUNT * 9));
  const spawnTimer = useRef(0);

  // Initialize all particles
  useMemo(() => {
    const d = particleData.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      resetParticle(d, i, true);
    }
  }, []);

  function resetParticle(d: Float32Array, i: number, randomLife: boolean) {
    const idx = i * 9;
    // Random direction on unit sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const dirX = Math.sin(phi) * Math.cos(theta);
    const dirY = Math.sin(phi) * Math.sin(theta);
    const dirZ = Math.cos(phi);

    // Start near center
    const startRadius = 0.1 + Math.random() * 0.5;
    d[idx] = dirX * startRadius;
    d[idx + 1] = dirY * startRadius;
    d[idx + 2] = dirZ * startRadius;

    // Velocity: outward, varied speeds
    const speed = 0.3 + Math.random() * 2.0;
    d[idx + 3] = dirX * speed;
    d[idx + 4] = dirY * speed;
    d[idx + 5] = dirZ * speed;

    // Life tracking
    d[idx + 6] = randomLife ? Math.random() * 10 : 0;
    d[idx + 7] = 8 + Math.random() * 12; // max life
    d[idx + 8] = 0.01 + Math.random() * 0.06; // base size
  }

  const positionsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const colorsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const sizesRef = useRef(new Float32Array(PARTICLE_COUNT));

  useFrame((_, delta) => {
    const d = particleData.current;
    const pos = positionsRef.current;
    const col = colorsRef.current;
    const siz = sizesRef.current;

    spawnTimer.current += delta;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 9;
      let x = d[idx];
      let y = d[idx + 1];
      let z = d[idx + 2];
      const vx = d[idx + 3];
      const vy = d[idx + 4];
      const vz = d[idx + 5];
      let life = d[idx + 6] + delta;
      const maxLife = d[idx + 7];
      const baseSize = d[idx + 8];

      // Move outward
      x += vx * delta;
      y += vy * delta;
      z += vz * delta;

      let dist = Math.sqrt(x * x + y * y + z * z);

      // Reset if too far or too old
      if (dist > MAX_RADIUS || life > maxLife) {
        // Spawn new particle at center
        const theta2 = Math.random() * Math.PI * 2;
        const phi2 = Math.acos(2 * Math.random() - 1);
        const ndx = Math.sin(phi2) * Math.cos(theta2);
        const ndy = Math.sin(phi2) * Math.sin(theta2);
        const ndz = Math.cos(phi2);
        const nSpeed = 0.3 + Math.random() * 2.0;

        x = ndx * (0.05 + Math.random() * 0.3);
        y = ndy * (0.05 + Math.random() * 0.3);
        z = ndz * (0.05 + Math.random() * 0.3);
        d[idx + 3] = ndx * nSpeed;
        d[idx + 4] = ndy * nSpeed;
        d[idx + 5] = ndz * nSpeed;
        d[idx + 7] = 8 + Math.random() * 12;
        d[idx + 8] = 0.01 + Math.random() * 0.06;
        life = 0;
        dist = 0.1;
      }

      d[idx] = x;
      d[idx + 1] = y;
      d[idx + 2] = z;
      d[idx + 6] = life;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Life-based fade: bright at birth, fade with age
      const lifeRatio = Math.min(life / maxLife, 1);
      const fadeIn = Math.min(life / 0.8, 1); // quick fade in
      const fadeOut = 1 - Math.max(0, (lifeRatio - 0.5) * 2); // fade out in second half
      const alpha = fadeIn * fadeOut;

      // Color: warm near center, cool far away
      const distRatio = Math.min(dist / MAX_RADIUS, 1);
      col[i * 3] = 0.7 + 0.3 * (1 - distRatio);       // R
      col[i * 3 + 1] = 0.75 + 0.25 * (1 - distRatio);  // G
      col[i * 3 + 2] = 0.85 + 0.15 * distRatio;        // B (more blue far)

      siz[i] = baseSize * alpha;
    }

    // Update buffers
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      geo.attributes.size.needsUpdate = true;
    }

    // Subtle global twinkle
    if (materialRef.current) {
      materialRef.current.opacity = 0.55 + Math.sin(performance.now() * 0.0005) * 0.08;
    }
  });

  // Create initial buffers
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
        size={0.25}
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
        camera={{ position: [0, 0, 0], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#000000" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ExpandingField />
      </Canvas>
    </div>
  );
}
