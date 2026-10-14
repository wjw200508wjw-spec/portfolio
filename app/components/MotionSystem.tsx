"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

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
    const disclosures = new Map<HTMLDetailsElement,{animation:Animation;desired:boolean}>();
    let keyboard = false;
    const onKey = (event: KeyboardEvent) => { if (["Tab","Enter"," ","Escape","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"].includes(event.key)) { keyboard = true; root.dataset.keyboard = "true"; } };
    const onPointer = () => { keyboard = false; delete root.dataset.keyboard; };
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        if (element.dataset.revealed) { reveal.unobserve(element); return; }
        element.dataset.revealed = "true";
        if (!paused && !reduced && !keyboard) {
          const lines=element.dataset.reveal==="title" ? element.querySelectorAll<HTMLElement>(".title-line>span") : [];
          const targets=lines.length?Array.from(lines):[element];
          targets.forEach((target,index)=>{
            const frames=lines.length
              ? [{transform:"translateY(105%)",opacity:0},{transform:"translateY(0)",opacity:1}]
              : element.dataset.reveal==="fade"
                ? [{opacity:0},{opacity:1}]
                : element.dataset.reveal==="card"
                  ? [{opacity:0,transform:"translateY(8px) scale(.98)"},{opacity:1,transform:"translateY(0) scale(1)"}]
                : [{opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}];
            const animation=target.animate(frames,{duration:lines.length?500:element.dataset.reveal==="card"?300:400,delay:Number(element.dataset.delay||0)+index*50,easing:"cubic-bezier(0.23,1,0.32,1)",fill:"backwards"});
            animations.add(animation);animation.onfinish=()=>animations.delete(animation);
          });
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
      if (!details.open || paused || keyboard || disclosures.has(details)) return;
      const content = details.querySelector(".details-content, .note-body") as HTMLElement | null;
      if (content) {
        const animation = content.animate(reduced?[{opacity:.7},{opacity:1}]:[{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:reduced?125:200,easing:"cubic-bezier(0.23,1,0.32,1)"});
        animations.add(animation); animation.onfinish = () => animations.delete(animation);
      }
    };
    const resetDisclosure=(details:HTMLDetailsElement,desired:boolean)=>{
      details.open=desired;details.style.removeProperty("height");details.style.removeProperty("overflow");
      delete details.dataset.closing;delete details.dataset.animating;
    };
    const onDisclosureClick=(event:MouseEvent)=>{
      const summary=(event.target as Element).closest("summary");
      const details=summary?.parentElement as HTMLDetailsElement|null;
      if(!details||!details.matches(".project-details,.note"))return;
      const previous=disclosures.get(details);
      if(paused||reduced||keyboard||event.detail===0){
        if(previous){previous.animation.cancel();resetDisclosure(details,previous.desired);disclosures.delete(details);}
        return;
      }
      event.preventDefault();
      const desired=!(previous?.desired??details.open);
      const from=details.getBoundingClientRect().height;
      previous?.animation.cancel();
      details.style.removeProperty("height");details.style.removeProperty("overflow");
      details.open=true;
      const full=details.getBoundingClientRect().height;
      let to=full;
      if(!desired){details.open=false;to=details.getBoundingClientRect().height;details.open=true;}
      details.dataset.animating="true";details.dataset.closing=String(!desired);
      details.style.height=`${from}px`;details.style.overflow="clip";
      const animation=details.animate([{height:`${from}px`},{height:`${to}px`}],{duration:200,easing:"cubic-bezier(0.23,1,0.32,1)",fill:"forwards"});
      const transition={animation,desired};disclosures.set(details,transition);
      animation.finished.then(()=>{
        if(disclosures.get(details)!==transition)return;
        resetDisclosure(details,desired);animation.cancel();disclosures.delete(details);
      }).catch(()=>{});
    };
    root.addEventListener("toggle", onToggle, true);
    root.addEventListener("click",onDisclosureClick);
    visibility(); document.addEventListener("visibilitychange", visibility);
    document.addEventListener("keydown", onKey); document.addEventListener("pointerdown", onPointer);
    return () => {
      reveal.disconnect(); ambience.disconnect(); animations.forEach(a => a.cancel());
      root.removeEventListener("toggle", onToggle, true);
      root.removeEventListener("click",onDisclosureClick);
      disclosures.forEach(({animation,desired},details)=>{animation.cancel();resetDisclosure(details,desired);});disclosures.clear();
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
    <Icon name={paused ? "play" : "pause"}/><span className="motion-label">{paused ? "播放动效" : "暂停动效"}</span>
  </button>;
}
