import Image from "next/image";
import { SITE } from "@/lib/constants";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return <section id="hero" className="hero" data-ambient>
    <div className="hero-aurora" aria-hidden="true" />
    <div className="hero-heading hero-enter"><span className="eyebrow"><span className="status-dot" /> DATA ENGINEERING · AI APPLICATIONS</span>
      <h1><span>MAKE DATA</span><span className="outlined-word">MAKE <i>IMPACT.</i></span></h1>
    </div>
    <div className="hero-art"><HeroVisual /><div className="avatar-wrap"><Image src="/images/avatar.webp" alt="王佳伟的 3D 卡通形象" width={610} height={640} priority sizes="(max-width: 700px) 78vw, 430px" className="hero-avatar" /></div></div>
    <div className="hero-bottom">
      <div className="hero-bio hero-enter"><span className="eyebrow">HELLO, I’M</span><h2>{SITE.name}<span> / {SITE.nameEn}</span></h2><p>把分散的数据连接起来，<br />把复杂的业务变成好用的工具。</p></div>
      <div className="hero-cta hero-enter"><a href="#projects" className="button button-primary">探索我的作品 <span aria-hidden="true">↗</span></a><a href={SITE.resume} download="王佳伟-数据.pdf" className="resume-link">下载简历 <span className="mono">PDF · 2026.10</span><span aria-hidden="true">↓</span></a></div>
    </div>
    <div className="hero-foot"><span className="mono">BASED IN CHINA / BUILDING WITH DATA</span><a href="#about" className="scroll-link">向下探索 <span aria-hidden="true">↓</span></a><span className="mono">PORTFOLIO © 2026</span></div>
  </section>;
}
