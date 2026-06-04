"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, SITE } from "@/lib/constants";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    // Small delay so the menu close animation starts before scroll
    setTimeout(() => {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, []);

  const navItems = NAV_ITEMS.map((item) => (
    <button
      key={item.href}
      onClick={() => scrollTo(item.href)}
      className={`px-5 py-2.5 text-[0.9rem] rounded-full transition-colors ${
        activeSection === item.href.slice(1)
          ? "text-text-bright bg-bg-elevated"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {item.label}
    </button>
  ));

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
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-text-primary font-bold text-lg md:text-xl tracking-tight hover:text-text-bright transition-colors shrink-0"
            >
              {SITE.nameEn}
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1.5">
              {navItems}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
              className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[2px] bg-text-primary rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-[2px] bg-text-primary rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[2px] bg-text-primary rounded-full"
              />
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="md:hidden overflow-hidden glass border-t border-white/5"
              >
                <div className="px-4 py-3 flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className={`w-full text-left px-4 py-3 text-[0.95rem] rounded-xl transition-colors ${
                        activeSection === item.href.slice(1)
                          ? "text-text-bright bg-bg-elevated"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
