"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

function GlowTexture() {
  // Create a radial gradient glow sprite as a canvas texture
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.05, "rgba(220,230,255,0.9)");
    gradient.addColorStop(0.15, "rgba(180,200,255,0.5)");
    gradient.addColorStop(0.4, "rgba(100,140,220,0.12)");
    gradient.addColorStop(0.7, "rgba(40,60,120,0.02)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function Starfield({ count = 300 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const twinkleRef = useRef(0);
  const glowTexture = GlowTexture();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Scatter in a large ellipsoid for deep space feel
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 4 + Math.random() * 16;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius * 1.3;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      positions[i * 3 + 2] = Math.cos(phi) * radius;

      // Star colors: blue-white, warm white, faint purple
      const r = Math.random();
      if (r < 0.5) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
      } else if (r < 0.8) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0.7;
      } else {
        colors[i * 3] = 0.75; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.95;
      }

      // Most tiny, scattered bright dots; occasional larger glow
      sizes[i] = Math.random() < 0.9
        ? Math.random() * 0.06 + 0.015
        : Math.random() * 0.18 + 0.06;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Very slow drift
    meshRef.current.rotation.y += delta * 0.018;
    meshRef.current.rotation.x += delta * 0.008;
    meshRef.current.rotation.z += delta * 0.004;

    // Subtle collective twinkle
    if (materialRef.current) {
      twinkleRef.current += delta * 0.5;
      materialRef.current.opacity = 0.65 + Math.sin(twinkleRef.current) * 0.12;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        map={glowTexture}
        size={0.25}
        vertexColors
        transparent
        opacity={0.65}
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
        <Starfield count={300} />
      </Canvas>
    </div>
  );
}
