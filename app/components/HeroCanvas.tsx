"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";

const PARTICLE_SIZE = 0.06;
const CANVAS_W = 512;
const SAMPLE_STEP = 3;

function sampleTextPixels(): Float32Array | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const h = Math.round(CANVAS_W * 0.6);
  canvas.width = CANVAS_W;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, CANVAS_W, h);

  // DATA title
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${CANVAS_W * 0.22}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DATA", CANVAS_W / 2, h * 0.28);

  // 王佳伟
  ctx.font = `${CANVAS_W * 0.06}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "#e0e0e0";
  ctx.fillText("王佳伟", CANVAS_W / 2, h * 0.52);

  // Tagline
  ctx.font = `${CANVAS_W * 0.035}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "#b0b0b0";
  ctx.fillText("构建企业级数据平台与智能 Agent 系统", CANVAS_W / 2, h * 0.62);

  // CTAs
  ctx.font = `600 ${CANVAS_W * 0.04}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("查看项目", CANVAS_W * 0.28, h * 0.78);
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 2;
  ctx.strokeText("下载简历", CANVAS_W * 0.65, h * 0.78);

  // Sample
  const imageData = ctx.getImageData(0, 0, CANVAS_W, h);
  const pixels: number[] = [];
  for (let y = 0; y < h; y += SAMPLE_STEP) {
    for (let x = 0; x < CANVAS_W; x += SAMPLE_STEP) {
      const idx = (y * CANVAS_W + x) * 4;
      if (imageData.data[idx + 3] > 100) {
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
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const particleCount = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    scrollValue.current = v;
  });

  // Sample and init after mount
  useEffect(() => {
    const textPos = sampleTextPixels();
    if (!textPos || textPos.length < 3) return;

    const count = Math.floor(textPos.length / 3);
    particleCount.current = count;
    textPositions.current = textPos;

    // Scatter positions (random sphere)
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
    currentPositions.current = new Float32Array(scatter);
    phase.current = "assembling";

    // Create geometry with exact size
    const geo = new THREE.BufferGeometry();
    const posArray = new Float32Array(scatter);
    geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geo.setDrawRange(0, count);
    setGeometry(geo);
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !textPositions.current || !scatterPositions.current || !currentPositions.current) return;

    const textPos = textPositions.current;
    const scatterPos = scatterPositions.current;
    const curPos = currentPositions.current;
    const count = particleCount.current;
    const s = scrollValue.current;

    timer.current += delta;

    if (phase.current === "assembling") {
      const t = Math.max(0, Math.min(1, (timer.current - 0.2) / 1.5));
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        curPos[i3] = scatterPos[i3] + (textPos[i3] - scatterPos[i3]) * t;
        curPos[i3 + 1] = scatterPos[i3 + 1] + (textPos[i3 + 1] - scatterPos[i3 + 1]) * t;
        curPos[i3 + 2] = scatterPos[i3 + 2] + (textPos[i3 + 2] - scatterPos[i3 + 2]) * t;
      }
      if (t >= 1) phase.current = "assembled";
    } else if (phase.current === "assembled" || phase.current === "dispersing") {
      const dispersion = Math.max(0, Math.min(1, s * 2.5));
      if (dispersion > 0) phase.current = "dispersing";
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        curPos[i3] = textPos[i3] + (scatterPos[i3] - textPos[i3]) * dispersion;
        curPos[i3 + 1] = textPos[i3 + 1] + (scatterPos[i3 + 1] - textPos[i3 + 1]) * dispersion;
        curPos[i3 + 2] = textPos[i3 + 2] + (scatterPos[i3 + 2] - textPos[i3 + 2]) * dispersion;
      }
    }

    const attr = pointsRef.current.geometry.attributes.position;
    attr.array.set(curPos.subarray(0, count * 3));
    attr.needsUpdate = true;
    pointsRef.current.geometry.setDrawRange(0, count);
  });

  if (!geometry) return null;

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
