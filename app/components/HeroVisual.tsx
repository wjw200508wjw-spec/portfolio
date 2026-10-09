"use client";
import dynamic from "next/dynamic";
const Scene = dynamic(() => import("./FloatingScene"), { ssr: false, loading: () => <div className="scene-fallback" aria-hidden="true"><i /><i /><i /></div> });
export default function HeroVisual() { return <div className="floating-scene" aria-hidden="true"><Scene /></div>; }
