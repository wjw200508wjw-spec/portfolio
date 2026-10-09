import { EXPERIENCES } from "@/lib/constants";
export default function Experience() {
  return <section id="experience" className="section-container"><div className="section-heading" data-reveal><div><span className="eyebrow">02 / EXPERIENCE</span><h2 className="section-title">在真实业务里，<br /><em>让数据发挥作用。</em></h2></div><p>从医疗数据链路到航空维修业务，<br />积累数据治理与工具落地的实践经验。</p></div>
    <div className="experience-list">{EXPERIENCES.map((job,index) => <article className="experience-row" key={job.company} data-reveal><div className="experience-meta"><span className="mono">{job.period}</span><span className="tag">{job.industry}</span></div><div><div className="job-heading"><span className="job-index">0{index+1}</span><div><h3>{job.company}</h3><p>{job.role}</p></div></div><ul className="job-points">{job.highlights.map(point => <li key={point}>{point}</li>)}</ul></div></article>)}</div>
  </section>;
}
