import { SITE } from "@/lib/constants";
export default function About() {
  return <section id="about" className="about section-container" data-ambient>
    <div className="section-kicker" data-reveal><span>01 / ABOUT ME</span><span>数据为桥，业务为目的。</span></div>
    <div className="about-title" data-reveal><span className="chrome-orbit" aria-hidden="true" /><h2 className="display-title">ABOUT <em>ME.</em></h2><span className="chrome-cube" aria-hidden="true"><i /><i /><i /></span></div>
    <div className="about-content"><p className="about-lead" data-reveal>{SITE.aboutIntro}</p><div className="about-aside" data-reveal data-delay="60"><span className="eyebrow">LEARNING. BUILDING. ITERATING.</span><p>数据工程是我的底座，<br />AI 辅助开发是我的工具箱。</p><a href="#experience" className="text-link">看看我的实践经历 <span aria-hidden="true">↗</span></a></div></div>
    <div className="about-facts"><div data-reveal><span className="fact-number">02<span>个行业</span></span><p>医疗数据 / 航空维修</p></div><div data-reveal data-delay="60"><span className="fact-number">07<span>项作品</span></span><p>数据工程 / AI / 业务工具</p></div><div data-reveal data-delay="120"><span className="fact-number">75<span>% 左右</span></span><p>报价处理时间减少</p><small>约 2 小时 → 约半小时</small></div><div data-reveal data-delay="180"><span className="eyebrow">EDUCATION</span><h3>{SITE.education.school}</h3><p>{SITE.education.major}</p><small>本科 / {SITE.education.period}</small></div></div>
  </section>;
}
