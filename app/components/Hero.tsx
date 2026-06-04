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

  const titleRotateY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.6, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [0.6, 0]);

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
        className="relative z-10 text-center px-6"
      >
        {/* CSS 3D Title — rotates from side on entrance */}
        <motion.h1
          initial={{ rotateY: 75, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2,
          }}
          style={{
            rotateY: titleRotateY,
            opacity: titleOpacity,
            perspective: "800px",
            transformStyle: "preserve-3d" as const,
          }}
          className="text-[clamp(4rem,12vw,10rem)] font-extrabold text-text-primary tracking-[-0.03em] leading-none select-none"
        >
          Data
        </motion.h1>

        {/* Name */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-2xl font-medium text-text-muted mt-4"
        >
          {SITE.name}
        </motion.p>

        {/* Roles */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-lg text-text-secondary mt-2"
        >
          {SITE.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="text-sm text-text-secondary mt-3 max-w-md mx-auto"
        >
          {SITE.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3 bg-text-primary text-bg-deepest rounded-full text-sm font-semibold hover:bg-text-bright transition-colors"
          >
            View Projects
          </button>
          <a
            href="/resume.pdf"
            download
            className="px-7 py-3 border border-border-muted text-text-muted rounded-full text-sm font-medium hover:border-text-secondary hover:text-text-primary transition-colors"
          >
            Download Resume
          </a>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
          >
            Contact Me
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-text-secondary tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-5 border-r-2 border-b-2 border-text-secondary rotate-45 opacity-60"
        />
      </motion.div>
    </section>
  );
}
