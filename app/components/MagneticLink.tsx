"use client";
import { useEffect, useRef } from "react";
import { useMotionSettings } from "./MotionSystem";

export default function MagneticLink({href,className,children}:{href:string;className:string;children:React.ReactNode}) {
  const mover=useRef<HTMLSpanElement>(null), frame=useRef(0);
  const {paused,reduced}=useMotionSettings();
  const reset=()=>{cancelAnimationFrame(frame.current);mover.current?.style.removeProperty("transform");};
  useEffect(()=>{
    const node=mover.current;
    const clear=()=>{cancelAnimationFrame(frame.current);node?.style.removeProperty("transform");};
    clear();window.addEventListener("blur",clear);document.addEventListener("visibilitychange",clear);document.addEventListener("keydown",clear);
    return()=>{clear();window.removeEventListener("blur",clear);document.removeEventListener("visibilitychange",clear);document.removeEventListener("keydown",clear);};
  },[paused,reduced]);
  return <span className="magnetic-shell" data-magnet-still={paused||reduced} onPointerMove={event=>{
    if(paused||reduced||document.hidden||event.pointerType!=="mouse"||!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    const rect=event.currentTarget.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const x=Math.max(-6,Math.min(6,(event.clientX-rect.left-rect.width/2)*.12));
    const y=Math.max(-4,Math.min(4,(event.clientY-rect.top-rect.height/2)*.2));
    cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>{if(mover.current)mover.current.style.transform=`translate(${x}px,${y}px)`;});
  }} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}><span ref={mover} className="magnetic-mover"><a href={href} className={className}>{children}</a></span></span>;
}
