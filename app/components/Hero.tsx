import Image from "next/image";
import { SITE } from "@/lib/constants";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return <section id="hero" className="hero" data-ambient>
    <div className="hero-aurora" aria-hidden="true" />
    <div className="hero-heading hero-enter"><span className="eyebrow"><span className="status-dot" /> DATA ENGINEERING · AI APPLICATIONS</span>
      <h1 className="sr-only">Make data. Make impact. 数据工程与 AI 应用作品集</h1>
    </div>
    <div className="hero-type" aria-hidden="true">{["MAKE DATA.","MAKE IMPACT."].map((text,row) => <div className={`hero-type-lane hero-type-lane-${row}`} key={text}><div className="hero-type-track">{[0,1].map(copy => <div className="hero-type-group" key={copy}><span>{text}</span><span>{text}</span></div>)}</div></div>)}</div>
    <div className="hero-art"><HeroVisual /><div className="avatar-wrap"><Image src="/images/avatar.webp" alt="戴眼镜、穿紫色毛衣的 3D 卡通角色" width={610} height={640} priority sizes="(max-width: 700px) 94vw, (max-width: 1100px) 500px, 620px" className="hero-avatar" /></div></div>
    <div className="hero-bottom">
      <div className="hero-bio hero-enter"><span className="eyebrow">FROM IDEAS TO WORKING TOOLS</span><p>让数据流动，<br /><em>让想法成为好用的工具。</em></p><div className="hero-disciplines"><span>DATA</span><span>AI</span><span>AUTOMATION</span></div></div>
      <div className="hero-cta hero-enter"><a href="#projects" className="button button-primary">探索实际成果 <span aria-hidden="true">↗</span></a><a href={SITE.resume} download="数据工程-简历.pdf" className="resume-link">下载简历 <span className="mono">PDF · 2026.10</span><span aria-hidden="true">↓</span></a></div>
    </div>
    <div className="hero-foot"><span className="mono">BASED IN CHINA / BUILDING WITH DATA</span><a href="#experience" className="scroll-link">向下探索 <span aria-hidden="true">↓</span></a><span className="mono">PORTFOLIO © 2026</span></div>
  </section>;
}
