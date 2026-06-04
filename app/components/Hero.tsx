"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/constants";
import HeroCanvas from "./HeroCanvas";

// 3D extruded text: X-shifted layers create visible extrusion width when rotated on Y.
// At rotateY=80°, the X offset becomes depth — the layers spread into Z space,
// making the side wall of the text clearly visible.
function Data3D() {
  const layers = [
    { x: -10, color: "rgba(70,75,90,0.15)" },
    { x: -8, color: "rgba(90,95,110,0.2)" },
    { x: -7, color: "rgba(110,115,135,0.28)" },
    { x: -6, color: "rgba(130,138,155,0.35)" },
    { x: -5, color: "rgba(155,160,180,0.45)" },
    { x: -4, color: "rgba(175,180,200,0.55)" },
    { x: -3, color: "rgba(195,200,215,0.65)" },
    { x: -2, color: "rgba(220,225,240,0.78)" },
    { x: -1, color: "rgba(240,243,248,0.9)" },
    { x: 0, color: "#ffffff" },
  ];

  return (
    <span className="relative inline-block text-[clamp(5rem,18vw,18rem)] font-black leading-[0.8] select-none">
      {layers.map((layer, i) => (
        <span
          key={i}
          aria-hidden={i < layers.length - 1}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          style={{
            color: layer.color,
            transform: `translateX(${layer.x}px)`,
          }}
        >
          Data
        </span>
      ))}
      <span className="invisible">Data</span>
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Three.js particles */}
      <motion.div style={{ opacity: particlesOpacity }} className="absolute inset-0">
        <HeroCanvas />
      </motion.div>

      {/* ====== Phase 1: Name + Tagline + CTAs (0-1s center, then slide down) ====== */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ y: 0 }}
        animate={{ y: [0, 0, 320] }}
        transition={{ duration: 4.5, times: [0, 0.22, 1], ease: "easeInOut" }}
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.0 }}
          className="text-3xl md:text-4xl font-semibold text-white"
        >
          {SITE.name}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-white/70 mt-3"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3.5 bg-white text-black rounded-full text-sm md:text-base font-semibold hover:bg-gray-200 transition-colors"
          >
            查看项目
          </button>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 border border-white/30 text-white/80 rounded-full text-sm md:text-base font-medium hover:border-white/60 hover:text-white transition-colors"
          >
            下载简历
          </a>
        </motion.div>
      </motion.div>

      {/* ====== Phase 2: 3D "Data" — multi-layer X-shifted extrusion ====== */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1500px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.01, delay: 1.0 }}
      >
        <motion.div
          initial={{ rotateY: 80, scale: 2.0 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{
            duration: 4.0,
            ease: "linear",
            delay: 1.0,
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Data3D />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-white/50 tracking-[0.3em]">向下滚动</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-5 border-r-2 border-b-2 border-white/50 rotate-45"
        />
      </motion.div>
    </section>
  );
}
