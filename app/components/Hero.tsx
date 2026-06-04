"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/constants";
import HeroCanvas from "./HeroCanvas";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(nameRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.3);
    tl.fromTo(taglineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.7);
    tl.fromTo(ctasRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 1.1);
    tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.5);
    return () => { tl.kill(); };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ opacity: particlesOpacity }} className="absolute inset-0">
        <HeroCanvas />
      </motion.div>

      {/* DATA title + name + ctas */}
      <motion.div ref={contentRef} className="relative z-10 text-center px-6" style={{ opacity: contentOpacity }}>
        {/* Graffiti DATA with eyes in the A gaps */}
        <h1
          className="text-[clamp(5rem,18vw,18rem)] leading-[0.85] select-none"
          style={{
            fontFamily: "'Fredoka', cursive",
            fontWeight: 700,
            color: "#ffffff",
            textShadow: "0 2px 0 #ddd, 0 4px 0 #ccc, 0 6px 12px rgba(0,0,0,0.3)",
          }}
        >
          DATA
        </h1>

        {/* Name */}
        <p ref={nameRef} className="text-3xl md:text-4xl font-semibold text-white mt-6">
          {SITE.name}
        </p>

        {/* Tagline */}
        <p ref={taglineRef} className="text-base md:text-lg text-white/70 mt-3">
          {SITE.tagline}
        </p>

        {/* CTAs */}
        <div ref={ctasRef} className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 bg-white text-black rounded-full text-sm md:text-base font-semibold hover:bg-gray-200 transition-colors">
            查看项目
          </button>
          <a href="/resume.pdf" download
            className="px-8 py-3.5 border border-white/30 text-white/80 rounded-full text-sm md:text-base font-medium hover:border-white/60 hover:text-white transition-colors">
            下载简历
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs text-white/50 tracking-[0.3em]">向下滚动</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-5 border-r-2 border-b-2 border-white/50 rotate-45" />
      </div>
    </section>
  );
}
