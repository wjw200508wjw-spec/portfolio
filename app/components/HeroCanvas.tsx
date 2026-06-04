"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

const PARTICLE_SIZE = 0.04;
const CANVAS_W = 512;

// Render hero content to offscreen canvas, return pixel positions
function sampleTextPixels(): Float32Array | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const h = Math.round(CANVAS_W * 0.6);
  canvas.width = CANVAS_W;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Black bg
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, CANVAS_W, h);

  // Draw DATA
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${CANVAS_W * 0.22}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DATA", CANVAS_W / 2, h * 0.28);

  // Draw 王佳伟
  ctx.font = `${CANVAS_W * 0.06}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "#e0e0e0";
  ctx.fillText("王佳伟", CANVAS_W / 2, h * 0.52);

  // Draw tagline
  ctx.font = `${CANVAS_W * 0.035}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "#b0b0b0";
  ctx.fillText("构建企业级数据平台与智能 Agent 系统", CANVAS_W / 2, h * 0.62);

  // Draw buttons (simplified as text)
  ctx.font = `600 ${CANVAS_W * 0.04}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "#ffffff";
  const btn1x = CANVAS_W * 0.28;
  const btnY = h * 0.78;
  ctx.fillText("查看项目", btn1x, btnY);
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 2;
  ctx.strokeText("下载简历", CANVAS_W * 0.65, btnY);

  // Sample pixels
  const imageData = ctx.getImageData(0, 0, CANVAS_W, h);
  const pixels: number[] = [];
  const step = 2; // sample every 2nd pixel to control count

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < CANVAS_W; x += step) {
      const idx = (y * CANVAS_W + x) * 4;
      const alpha = imageData.data[idx + 3];
      if (alpha > 100) {
        // Convert to 3D coords: center, scale to fill view
        const px = (x / CANVAS_W - 0.5) * 12;
        const py = -(y / h - 0.5) * 7.2;
        const pz = (Math.random() - 0.5) * 0.3;
        pixels.push(px, py, pz);
      }
    }
  }

  return new Float32Array(pixels);
}

function ParticleText({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const scatterPositions = useRef<Float32Array | null>(null);
  const textPositions = useRef<Float32Array | null>(null);
  const currentPositions = useRef<Float32Array | null>(null);
  const scrollValue = useRef(0);
  const phase = useRef<"idle" | "assembling" | "assembled" | "dispersing">("idle");
  const timer = useRef(0);

  // Listen to scroll
  useMotionValueEvent(scrollProgress, "change", (v) => {
    scrollValue.current = v;
  });

  // Initialize
  useEffect(() => {
    const textPos = sampleTextPixels();
    if (!textPos || textPos.length === 0) return;

    const count = textPos.length / 3;
    textPositions.current = textPos;

    // Create scatter positions (random sphere)
    const scatter = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 10;
      scatter[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      scatter[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      scatter[i * 3 + 2] = Math.cos(phi) * r;
    }
    scatterPositions.current = scatter;

    // Start from scattered, then assemble
    currentPositions.current = new Float32Array(scatter);
    phase.current = "assembling";

    // Update geometry
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes.position;
      attr.array.set(scatter);
      attr.needsUpdate = true;
    }
  }, []);

  // Create geometry with max expected particles
  const geometry = useMemo(() => {
    const maxCount = 15000;
    const pos = new Float32Array(maxCount * 3);
    pos.fill(0);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !textPositions.current || !scatterPositions.current || !currentPositions.current) return;

    const textPos = textPositions.current;
    const scatterPos = scatterPositions.current;
    const curPos = currentPositions.current;
    const count = textPos.length / 3;
    const s = scrollValue.current;

    timer.current += delta;

    // Phase logic
    if (phase.current === "assembling") {
      // Assemble from 0.5s to 2.5s
      const t = Math.max(0, Math.min(1, (timer.current - 0.5) / 2.0));
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        curPos[i3] = scatterPos[i3] + (textPos[i3] - scatterPos[i3]) * t;
        curPos[i3 + 1] = scatterPos[i3 + 1] + (textPos[i3 + 1] - scatterPos[i3 + 1]) * t;
        curPos[i3 + 2] = scatterPos[i3 + 2] + (textPos[i3 + 2] - scatterPos[i3 + 2]) * t;
      }
      if (t >= 1) phase.current = "assembled";
    } else if (phase.current === "assembled" || phase.current === "dispersing") {
      // Scroll-driven dispersion
      const dispersion = Math.max(0, Math.min(1, s * 2.5));
      if (dispersion > 0) phase.current = "dispersing";

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        curPos[i3] = textPos[i3] + (scatterPos[i3] - textPos[i3]) * dispersion;
        curPos[i3 + 1] = textPos[i3 + 1] + (scatterPos[i3 + 1] - textPos[i3 + 1]) * dispersion;
        curPos[i3 + 2] = textPos[i3 + 2] + (scatterPos[i3 + 2] - textPos[i3 + 2]) * dispersion;
      }
    }

    // Update geometry
    const attr = pointsRef.current.geometry.attributes.position;
    attr.array.set(curPos.subarray(0, count * 3));
    attr.needsUpdate = true;
    pointsRef.current.geometry.setDrawRange(0, count);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={PARTICLE_SIZE}
        color="#d0d4dc"
        transparent
        opacity={0.85}
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
