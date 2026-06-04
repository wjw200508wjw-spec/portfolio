"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SECTION_IDS } from "@/lib/constants";

export default function SideIndicator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);

      let currentIndex = 0;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentIndex = i;
            break;
          }
        }
      }
      setActiveIndex(currentIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
    >
      {SECTION_IDS.map((section, i) => (
        <button
          key={section}
          onClick={() => scrollTo(section)}
          className="group relative flex items-center"
          aria-label={`Scroll to ${section}`}
        >
          <motion.div
            animate={{
              width: i === activeIndex ? 24 : 8,
              height: i === activeIndex ? 8 : 6,
              backgroundColor:
                i === activeIndex
                  ? "var(--text-primary)"
                  : "var(--border-muted)",
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full"
          />
          <span className="absolute right-8 text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap capitalize">
            {section === "ai-lab" ? "AI Lab" : section}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
