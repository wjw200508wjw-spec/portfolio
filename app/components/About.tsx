import WorkShowcase from "./WorkShowcase";
export default function About() {
  return <section id="about" className="about section-container" data-ambient>
    <div className="section-kicker" data-reveal><span>01 / MADE & SHIPPED</span><span>让作品自己说话。</span></div>
    <div className="about-title" data-reveal><span className="chrome-orbit" aria-hidden="true" /><h2 className="display-title">REAL <em>WORK.</em></h2><span className="chrome-cube" aria-hidden="true"><i /><i /><i /></span></div>
    <WorkShowcase />
  </section>;
}
