"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, SITE } from "@/lib/constants";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);

      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="glass fixed top-0 left-0 right-0 z-50"
        >
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-text-primary font-semibold text-lg tracking-tight hover:text-text-bright transition-colors"
            >
              {SITE.nameEn}
            </button>

            <div className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? "text-text-bright bg-bg-elevated"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
