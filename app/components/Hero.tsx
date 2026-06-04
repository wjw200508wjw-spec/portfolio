"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ opacity: particlesOpacity }} className="absolute inset-0">
        <HeroCanvas scrollYProgress={scrollYProgress} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0 }}
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
