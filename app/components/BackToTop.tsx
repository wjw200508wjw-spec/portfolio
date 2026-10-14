"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useMotionSettings } from "./MotionSystem";

export default function BackToTop() {
  const [shown,setShown]=useState(false);
  const {paused,reduced}=useMotionSettings();
  useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;setShown(window.scrollY>window.innerHeight);};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);};
  },[]);
  return <button type="button" className="back-to-top" data-shown={shown} aria-label="回到顶部" aria-hidden={!shown} disabled={!shown} tabIndex={shown?0:-1} onClick={event=>window.scrollTo({top:0,behavior:reduced||paused||event.detail===0?"instant":"smooth"})}><Icon name="arrow-up"/></button>;
}
