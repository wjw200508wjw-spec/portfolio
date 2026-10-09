"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const MotionContext = createContext({ paused: false, reduced: true, toggle: () => {} });
export const useMotionSettings = () => useContext(MotionContext);

export default function MotionSystem({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const animations = new Set<Animation>();
    let keyboard = false;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Tab") { keyboard = true; root.dataset.keyboard = "true"; } };
    const onPointer = () => { keyboard = false; delete root.dataset.keyboard; };
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        if (element.dataset.revealed) { reveal.unobserve(element); return; }
        element.dataset.revealed = "true";
        if (!paused && !reduced && !keyboard) {
          const animation = element.animate(
            [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 600, delay: Number(element.dataset.delay || 0), easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
        reveal.unobserve(element);
      });
    }, { threshold: 0.08 });
    root.querySelectorAll("[data-reveal]").forEach(el => reveal.observe(el));
    const ambience = new IntersectionObserver(entries => {
      entries.forEach(entry => (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting));
    });
    root.querySelectorAll("[data-ambient]").forEach(el => ambience.observe(el));
    const visibility = () => { root.dataset.hidden = String(document.hidden); };
    const onToggle = (event: Event) => {
      const details = event.target as HTMLDetailsElement;
      if (!details.open || paused || reduced || keyboard) return;
      const content = details.querySelector(".details-content, .note-body") as HTMLElement | null;
      if (content) {
        const animation = content.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:200,easing:"cubic-bezier(0.23,1,0.32,1)"});
        animations.add(animation); animation.onfinish = () => animations.delete(animation);
      }
    };
    root.addEventListener("toggle", onToggle, true);
    visibility(); document.addEventListener("visibilitychange", visibility);
    document.addEventListener("keydown", onKey); document.addEventListener("pointerdown", onPointer);
    return () => {
      reveal.disconnect(); ambience.disconnect(); animations.forEach(a => a.cancel());
      root.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer);
    };
  }, [paused, reduced]);
  return <MotionContext.Provider value={{ paused, reduced, toggle: () => setPaused(v => !v) }}>
    <div ref={scope} data-motion-paused={paused || reduced}>{children}</div>
  </MotionContext.Provider>;
}

export function MotionToggle() {
  const { paused, toggle } = useMotionSettings();
  return <button className="motion-toggle" onClick={toggle} aria-pressed={paused} aria-label={paused ? "播放装饰动画" : "暂停装饰动画"}>
    <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span><span className="motion-label">{paused ? "播放动效" : "暂停动效"}</span>
  </button>;
}
