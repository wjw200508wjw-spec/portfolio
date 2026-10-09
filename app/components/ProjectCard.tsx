import type { CSSProperties } from "react";
import type { Project } from "@/lib/types";
import ProjectPreview from "./ProjectPreview";
import ArchitectureDiagram from "./ArchitectureDiagram";
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article id={`project-${project.id}`} className="project-card" style={{"--card-index": index} as CSSProperties}>
    <div className="project-card-top"><span className="project-number">{String(index+1).padStart(2,"0")}</span><div><span className="eyebrow">{project.context}</span><h3>{project.title}</h3></div><span className="tag project-category">{project.category}</span></div>
    <div className="project-card-main"><ProjectPreview project={project} /><div className="project-copy"><span className="mono project-period">{project.period}</span><h4>{project.subtitle}</h4><p>{project.overview}</p><div className="project-metric"><span aria-hidden="true">↗</span>{project.metric}</div><div className="tags">{project.tools.map(tool => <span className="tag" key={tool}>{tool}</span>)}</div><p className="project-role">我的角色 · {project.role}</p></div></div>
    <details className="project-details"><summary><span>了解过程与成果</span><span className="details-icon" aria-hidden="true">+</span></summary><div className="details-content"><p>{project.description}</p><ArchitectureDiagram steps={project.flowSteps} /><h4>实践成果</h4><ul>{project.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul></div></details>
  </article>;
}
