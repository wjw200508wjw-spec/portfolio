"use client";
import { useEffect, useRef } from "react";
import { useMotionSettings } from "./MotionSystem";

export default function SelectionRail({children,className,activeSelector}:{children:React.ReactNode;className:string;activeSelector:string}) {
  const rail=useRef<HTMLDivElement>(null);
  const marker=useRef<HTMLSpanElement>(null);
  const {paused,reduced}=useMotionSettings();
  useEffect(()=>{
    const root=rail.current, indicator=marker.current;
    if(!root||!indicator)return;
    let frame=0;
    const update=()=>{
      const selected=root.querySelector<HTMLElement>(activeSelector);
      if(!selected){indicator.style.opacity="0";return;}
      const bounds=root.getBoundingClientRect(), item=selected.getBoundingClientRect();
      if(!bounds.width||!item.width){indicator.style.opacity="0";return;}
      const left=item.left-bounds.left, top=item.top-bounds.top;
      indicator.style.height=`${item.height}px`;
      indicator.style.clipPath=`inset(0 ${Math.max(0,bounds.width-left-item.width)}px 0 ${left}px round 24px)`;
      indicator.style.transform=`translateY(${top}px)`;
      indicator.style.opacity="1";
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};
    const attributes=new MutationObserver(schedule);
    attributes.observe(root,{subtree:true,attributes:true,attributeFilter:["aria-current","aria-pressed"]});
    const resize=new ResizeObserver(schedule);
    resize.observe(root);
    root.querySelectorAll("a,button").forEach(el=>resize.observe(el));
    update();
    return()=>{cancelAnimationFrame(frame);attributes.disconnect();resize.disconnect();};
  },[activeSelector]);
  return <div ref={rail} className={`${className} selection-rail`} data-rail-still={paused||reduced}><span ref={marker} className="selection-indicator" aria-hidden="true"/>{children}</div>;
}
