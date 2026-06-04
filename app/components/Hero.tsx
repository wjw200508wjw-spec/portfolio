"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/constants";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const titleRotateY = useTransform(scrollYProgress, [0, 0.5], [0, 40]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.8, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Three.js particle background */}
      <motion.div style={{ opacity: particlesOpacity }} className="absolute inset-0">
        <HeroCanvas />
      </motion.div>

      {/* Content overlay */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 text-center px-6 w-full max-w-[90vw]"
      >
        {/* 3D CSS Title — nanfu-style massive typography */}
        <motion.h1
          initial={{ rotateY: 80, opacity: 0, scale: 1.3 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1,
          }}
          style={{
            rotateY: titleRotateY,
            opacity: titleOpacity,
            scale: titleScale,
            perspective: "1000px",
            transformStyle: "preserve-3d" as const,
          }}
          className="text-[clamp(5rem,15vw,16rem)] font-black text-text-primary tracking-[-0.04em] leading-[0.85] select-none"
        >
          Data
        </motion.h1>

        {/* Name — subtle, below the massive title */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl font-medium text-text-muted mt-6 md:mt-8"
        >
          {SITE.name}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-text-secondary mt-3 max-w-xl mx-auto"
        >
          {SITE.tagline}
        </motion.p>

        {/* CTAs — Chinese */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 mt-10 md:mt-12"
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
