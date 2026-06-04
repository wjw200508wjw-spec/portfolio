"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

// ---- Sample text pixels from offscreen canvas ----
function sampleText(): { textPos: Float32Array; scatterPos: Float32Array } | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 260;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 400, 260);

  // DATA (big)
  ctx.fillStyle = "#fff";
  ctx.font = "bold 80px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DATA", 200, 90);

  // 王佳伟
  ctx.font = "600 24px Arial, sans-serif";
  ctx.fillText("王佳伟", 200, 165);

  // Tagline
  ctx.font = "16px Arial, sans-serif";
  ctx.fillStyle = "#ddd";
  ctx.fillText("构建企业级数据平台与智能 Agent 系统", 200, 195);

  // Sample every N pixels
  const step = 5;
  const img = ctx.getImageData(0, 0, 400, 260);
  const pts: number[] = [];

  for (let y = 0; y < 260; y += step) {
    for (let x = 0; x < 400; x += step) {
      if (img.data[(y * 400 + x) * 4 + 3] > 100) {
        // Map canvas (0..400, 0..260) → world (-6..6, -3.9..3.9) centered
        pts.push((x / 400 - 0.5) * 12, -(y / 260 - 0.5) * 7.8, (Math.random() - 0.5) * 0.3);
      }
    }
  }

  const count = pts.length / 3;
  if (count === 0) return null;

  const textPos = new Float32Array(pts);
  const scatterPos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 10;
    scatterPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    scatterPos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    scatterPos[i * 3 + 2] = Math.cos(phi) * r;
  }

  console.log("Particles:", count);
  return { textPos, scatterPos };
}

// ---- Particle system ----
function ParticleText({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const dataRef = useRef<{ textPos: Float32Array; scatterPos: Float32Array } | null>(null);
  const curRef = useRef<Float32Array | null>(null);
  const scrollV = useRef(0);
  const time = useRef(0);
  const assembled = useRef(false);
  const [ready, setReady] = useState(false);

  useMotionValueEvent(scrollProgress, "change", (v) => { scrollV.current = v; });

  useEffect(() => {
    const d = sampleText();
    if (!d) return;
    dataRef.current = d;
    curRef.current = new Float32Array(d.scatterPos);
    setReady(true);
  }, []);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    const data = dataRef.current;
    const cur = curRef.current;
    if (!pts || !data || !cur) return;

    const { textPos, scatterPos } = data;
    const count = textPos.length / 3;
    time.current += delta;

    // Assemble 0.3→2.0s
    if (!assembled.current) {
      const t = Math.max(0, Math.min(1, (time.current - 0.3) / 1.7));
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        cur[i3] = scatterPos[i3] + (textPos[i3] - scatterPos[i3]) * t;
        cur[i3 + 1] = scatterPos[i3 + 1] + (textPos[i3 + 1] - scatterPos[i3 + 1]) * t;
        cur[i3 + 2] = scatterPos[i3 + 2] + (textPos[i3 + 2] - scatterPos[i3 + 2]) * t;
      }
      if (t >= 1) assembled.current = true;
    } else {
      // Scroll dispersion
      const d = Math.max(0, Math.min(1, scrollV.current * 2.5));
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        cur[i3] = textPos[i3] + (scatterPos[i3] - textPos[i3]) * d;
        cur[i3 + 1] = textPos[i3 + 1] + (scatterPos[i3 + 1] - textPos[i3 + 1]) * d;
        cur[i3 + 2] = textPos[i3 + 2] + (scatterPos[i3 + 2] - textPos[i3 + 2]) * d;
      }
    }

    // Rotate slowly (keeps particles floating in bg after dispersing)
    pts.rotation.y += delta * 0.015;
    pts.rotation.x += delta * 0.008;

    pts.geometry.attributes.position.array.set(cur.subarray(0, count * 3));
    pts.geometry.attributes.position.needsUpdate = true;
    pts.geometry.setDrawRange(0, count);
  });

  if (!ready || !dataRef.current) return null;

  const count = dataRef.current.textPos.length / 3;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(dataRef.current.scatterPos), 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#f0f0f8"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroCanvas({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#000000" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <ParticleText scrollProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
