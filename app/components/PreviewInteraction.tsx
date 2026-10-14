"use client";
import { useEffect, useRef } from "react";
import { useMotionSettings } from "./MotionSystem";
import Icon from "./Icon";

export default function PreviewInteraction({children,title}:{children:React.ReactNode;title:string}) {
  const surface=useRef<HTMLDivElement>(null);
  const glow=useRef<HTMLSpanElement>(null);
  const frame=useRef(0);
  const {paused,reduced}=useMotionSettings();
  const reset=()=>{cancelAnimationFrame(frame.current);if(surface.current)surface.current.style.removeProperty("transform");if(glow.current)glow.current.style.opacity="0";};
  useEffect(()=>{
    const element=surface.current;
    const light=glow.current;
    cancelAnimationFrame(frame.current);element?.style.removeProperty("transform");
    if(light)light.style.opacity="0";
    const clear=()=>{cancelAnimationFrame(frame.current);element?.style.removeProperty("transform");if(light)light.style.opacity="0";};
    window.addEventListener("blur",clear);document.addEventListener("visibilitychange",clear);document.addEventListener("keydown",clear);
    return()=>{clear();window.removeEventListener("blur",clear);document.removeEventListener("visibilitychange",clear);document.removeEventListener("keydown",clear);};
  },[paused,reduced]);
  return <div className="preview-interactive" data-preview-still={paused||reduced} onPointerMove={event=>{
    if(paused||reduced||event.pointerType!=="mouse"||!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const lightX=event.clientX-rect.left-100,lightY=event.clientY-rect.top-100;
    const x=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5));
    const y=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));
    cancelAnimationFrame(frame.current);
    frame.current=requestAnimationFrame(()=>{if(surface.current)surface.current.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;if(glow.current){glow.current.style.transform=`translate(${lightX}px,${lightY}px)`;glow.current.style.opacity="1";}});
  }} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}>
    <div ref={surface} className="preview-motion-surface">{children}</div>
    <div className="preview-glow-clip" aria-hidden="true"><span ref={glow} className="preview-pointer-glow"/></div>
    <button type="button" className="preview-open-control" aria-label={`查看${title}详情`} onClick={event=>{
      const summary=event.currentTarget.closest("article")?.querySelector("details>summary") as HTMLElement|null;
      if(!summary)return;
      summary.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,detail:event.detail}));
      summary.focus({preventScroll:true});
      summary.scrollIntoView({block:"nearest",behavior:paused||reduced||event.detail===0?"instant":"smooth"});
    }}><span>查看项目详情 <Icon name="arrow-up-right"/></span></button>
  </div>;
}
