"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionSettings } from "./MotionSystem";
import SelectionRail from "./SelectionRail";
export default function ProjectCollection({ entries }: { entries: { id: string; category: string; content: React.ReactNode }[] }) {
  const [category, setCategory] = useState("全部");
  const stack = useRef<HTMLDivElement>(null);
  const animateNext = useRef(false);
  const animation = useRef<Animation | null>(null);
  const { paused, reduced } = useMotionSettings();
  const categories = ["全部", ...new Set(entries.map(p => p.category))];
  const filtered = entries.filter(p => category === "全部" || p.category === category);
  useEffect(() => {
    const showLinked = () => {
      const id = window.location.hash.replace("#project-", "");
      const linked = entries.find(entry => entry.id === id);
      if (linked && category !== "全部" && linked.category !== category) {
        setCategory("全部");
        requestAnimationFrame(() => document.getElementById(`project-${id}`)?.scrollIntoView({behavior:"instant"}));
      }
    };
    window.addEventListener("hashchange", showLinked);
    return () => window.removeEventListener("hashchange", showLinked);
  }, [category, entries]);
  useEffect(() => {
    if (animateNext.current && !paused && !reduced && stack.current) {
      animation.current?.cancel();
      animation.current = stack.current.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:200,easing:"cubic-bezier(0.23,1,0.32,1)"});
    }
    animateNext.current = false;
    return () => animation.current?.cancel();
  }, [category, paused, reduced]);
  return <><SelectionRail className="project-filters" activeSelector='button[aria-pressed="true"]'>{categories.map(label => <button key={label} aria-pressed={category === label} onClick={event => { animateNext.current = event.detail !== 0; setCategory(label); }}>{label}<span>{label === "全部" ? entries.length : entries.filter(p => p.category === label).length}</span></button>)}<span className="filter-count" aria-live="polite">{filtered.length} 个作品</span></SelectionRail><div className="project-stack" ref={stack}>{filtered.map(entry => <div key={entry.id} className="project-slot">{entry.content}</div>)}</div></>;
}
