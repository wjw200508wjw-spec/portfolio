"use client";
import { useEffect, useRef } from "react";
import { useMotionSettings } from "./MotionSystem";
import HeroVisual from "./HeroVisual";

export default function HeroPointerScene({children}:{children:React.ReactNode}) {
  const art=useRef<HTMLDivElement>(null), portrait=useRef<HTMLDivElement>(null), scenery=useRef<HTMLDivElement>(null);
  const {paused,reduced}=useMotionSettings();
  useEffect(()=>{
    const section=art.current?.closest("section"), face=portrait.current, decor=scenery.current;
    if(!section||!face||!decor)return;
    let frame=0;
    const query=matchMedia("(hover:hover) and (pointer:fine)");
    const reset=()=>{cancelAnimationFrame(frame);face.style.removeProperty("transform");decor.style.removeProperty("transform");};
    const move=(event:PointerEvent)=>{
      if(paused||reduced||!query.matches||event.pointerType!=="mouse"||document.hidden)return;
      const rect=section.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const x=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5));
      const y=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{face.style.transform=`translate(${x*28}px,${y*16}px)`;decor.style.transform=`translate(${-x*20}px,${-y*12}px)`;});
    };
    reset();section.addEventListener("pointermove",move as EventListener,{passive:true});section.addEventListener("pointerleave",reset);
    window.addEventListener("blur",reset);document.addEventListener("visibilitychange",reset);document.addEventListener("keydown",reset);query.addEventListener("change",reset);
    return()=>{reset();section.removeEventListener("pointermove",move as EventListener);section.removeEventListener("pointerleave",reset);window.removeEventListener("blur",reset);document.removeEventListener("visibilitychange",reset);document.removeEventListener("keydown",reset);query.removeEventListener("change",reset);};
  },[paused,reduced]);
  return <div ref={art} className="hero-art" data-scene-still={paused||reduced}><div ref={scenery} className="hero-scene-motion"><HeroVisual/></div><div ref={portrait} className="hero-portrait-motion">{children}</div></div>;
}
