"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 400;

function GlowSprite() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Very soft, subtle glow
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(200,210,230,0.7)");
    gradient.addColorStop(0.15, "rgba(140,160,200,0.35)");
    gradient.addColorStop(0.4, "rgba(80,100,150,0.08)");
    gradient.addColorStop(0.7, "rgba(30,50,80,0.01)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

interface ParticleState {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  baseSize: number;
  wanderTimer: number;
}

function SpaceDrift() {
  const pointsRef = useRef<THREE.Points>(null);
  const glowTexture = GlowSprite();
  const particlesRef = useRef<ParticleState[]>([]);
  const initializedRef = useRef(false);

  const positionsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const sizesRef = useRef(new Float32Array(PARTICLE_COUNT));
  const colorsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));

  // Init once
  if (!initializedRef.current) {
    const p: ParticleState[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 10;

      p.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.sin(phi) * Math.sin(theta) * r * 0.8,
        z: Math.cos(phi) * r,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        vz: (Math.random() - 0.5) * 0.15,
        baseSize: 0.01 + Math.random() * 0.05,
        wanderTimer: Math.random() * 10,
      });
    }
    particlesRef.current = p;
    initializedRef.current = true;
  }

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positionsRef.current, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizesRef.current, 1));
    g.setAttribute("color", new THREE.BufferAttribute(colorsRef.current, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const particles = particlesRef.current;
    const pos = positionsRef.current;
    const siz = sizesRef.current;
    const col = colorsRef.current;
    const maxRadius = 10;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Slowly change direction over time — organic wandering
      p.wanderTimer -= dt;
      if (p.wanderTimer <= 0) {
        // Gentle random perturbation to velocity
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.03;
        p.vz += (Math.random() - 0.5) * 0.04;
        // Clamp speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
        const maxSpd = 0.2;
        if (spd > maxSpd) {
          const s = maxSpd / spd;
          p.vx *= s; p.vy *= s; p.vz *= s;
        }
        p.wanderTimer = 2 + Math.random() * 5;
      }

      // Move
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      // Soft boundary: gently push back if too far
      const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
      if (dist > maxRadius) {
        const nx = p.x / dist;
        const ny = p.y / dist;
        const nz = p.z / dist;
        p.vx -= nx * 0.03 * dt;
        p.vy -= ny * 0.03 * dt;
        p.vz -= nz * 0.03 * dt;
      }

      // Write to buffers
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;

      // Size: slightly larger when near center
      const distRatio = dist / maxRadius;
      siz[i] = p.baseSize * (1.2 + (1 - distRatio) * 0.6);

      // Subtle warm-cool variation
      col[i * 3] = 0.7 + 0.3 * (1 - distRatio);
      col[i * 3 + 1] = 0.72 + 0.28 * (1 - distRatio);
      col[i * 3 + 2] = 0.75 + 0.25 * distRatio;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        map={glowTexture}
        size={0.15}
        vertexColors
        transparent
        opacity={0.4}
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
        <SpaceDrift />
      </Canvas>
    </div>
  );
}
