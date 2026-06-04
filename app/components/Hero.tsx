"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useAnimate } from "framer-motion";
import { SITE } from "@/lib/constants";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

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

      {/* ====== Phase 1: Name + Tagline + CTAs (0-1s, center) ====== */}
      <motion.div
        className="relative z-10 text-center px-6"
        animate={{
          // Phase 2: slide down to make room for Data (1s-2.5s)
          y: [0, 0, 180],
        }}
        transition={{
          duration: 3,
          times: [0, 0.33, 1],
          ease: "easeInOut",
        }}
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.0 }}
          className="text-3xl md:text-4xl font-semibold text-text-bright"
        >
          {SITE.name}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-text-secondary mt-3"
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
            className="px-8 py-3.5 bg-text-primary text-bg-deepest rounded-full text-sm md:text-base font-semibold hover:bg-text-bright transition-colors"
          >
            查看项目
          </button>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 border border-border-muted text-text-muted rounded-full text-sm md:text-base font-medium hover:border-text-secondary hover:text-text-primary transition-colors"
          >
            下载简历
          </a>
        </motion.div>
      </motion.div>

      {/* ====== Phase 2: 3D "Data" — side entrance, uniform rotation, fills screen ====== */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.01, delay: 1.0 }}
        style={{ perspective: "1200px" }}
      >
        <motion.h1
          initial={{
            rotateY: 85,
            scale: 1.8,
            opacity: 0,
          }}
          animate={{
            rotateY: 0,
            scale: 1,
            opacity: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: 3.5,
            times: [0, 0.08, 0.7, 1],
            ease: "linear",
            delay: 1.0,
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1200px",
          }}
          className="text-[clamp(5rem,18vw,18rem)] font-black text-white tracking-[-0.05em] leading-[0.8] select-none"
        >
          {/* Faux-3D extrusion via layered text-shadows */}
          <span
            style={{
              textShadow: [
                "0 1px 0 #ccc",
                "0 2px 0 #bbb",
                "0 3px 0 #aaa",
                "0 4px 0 #999",
                "0 5px 0 #888",
                "0 6px 0 #777",
                "0 7px 0 #666",
                "0 8px 0 #555",
                "0 10px 10px rgba(0,0,0,0.5)",
                "0 15px 20px rgba(0,0,0,0.3)",
                "0 25px 40px rgba(0,0,0,0.2)",
                "-2px 0 0 rgba(255,255,255,0.1)",
                "-4px 0 0 rgba(255,255,255,0.05)",
              ].join(", "),
            }}
          >
            Data
          </span>
        </motion.h1>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-text-secondary tracking-[0.3em]">向下滚动</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-5 border-r-2 border-b-2 border-text-secondary rotate-45 opacity-50"
        />
      </motion.div>
    </section>
  );
}
