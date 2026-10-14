import { SKILL_GROUPS } from "@/lib/constants";
export default function Skills() {
  return <section id="skills" className="section-container skills-section"><div className="section-heading" data-reveal><div><span className="eyebrow">03 / TOOLBOX</span><h2 className="section-title">连接数据与业务的<br /><em>工具箱。</em></h2></div><p>从 SQL 到工作流，从业务口径到可视化。<br />以实践场景组织能力，持续学习和迭代。</p></div><div className="skill-grid">{SKILL_GROUPS.map((group,index) => <article key={group.title} className="skill-card" data-reveal="card" data-delay={(index%3)*50}><span className="eyebrow">{group.label}</span><h3>{group.title}</h3><p>{group.description}</p><div className="tags">{group.tools.map(tool => <span className="tag" key={tool}>{tool}</span>)}</div></article>)}</div></section>;
}
