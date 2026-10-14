import type { CSSProperties } from "react";
import type { Project } from "@/lib/types";
import ProjectPreview from "./ProjectPreview";
import ArchitectureDiagram from "./ArchitectureDiagram";
import Image from "next/image";
import { SHOWCASE } from "@/lib/showcase";
import PreviewInteraction from "./PreviewInteraction";
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const work=SHOWCASE.find(item=>item.id===project.id);
  return <article id={`project-${project.id}`} className="project-card" style={{"--card-index": index} as CSSProperties}>
    <div className="project-card-top"><span className="project-number">{String(index+1).padStart(2,"0")}</span><div><span className="eyebrow">{project.context}</span><h3>{project.title}</h3></div><span className="tag project-category">{project.category}</span></div>
    <div className="project-card-main"><PreviewInteraction title={project.title}><ProjectPreview project={project} /></PreviewInteraction><div className="project-copy"><span className="mono project-period">{project.period}</span><h4>{project.subtitle}</h4><p>{project.overview}</p><div className="project-metric"><span aria-hidden="true">↗</span>{project.metric}</div><div className="tags">{project.tools.map(tool => <span className="tag" key={tool}>{tool}</span>)}</div><p className="project-role">我的角色 · {project.role}</p></div></div>
    <details className="project-details"><summary><span>{work?"查看实际界面与项目详情":"了解过程与成果"}</span><span className="details-icon" aria-hidden="true">+</span></summary><div className="details-content"><p>{project.description}</p>{work&&<div className="project-real-screens">{work.images.map(item=><figure key={item.src}><Image src={item.src} alt={`${work.title} · ${item.label}`} width={work.width} height={work.height} sizes="94vw" /><figcaption>{item.label} · 原始界面{project.id==="interactive-analysis"?" · 内置示例数据":""}</figcaption></figure>)}</div>}<ArchitectureDiagram steps={project.flowSteps} /><h4>实践成果</h4><ul>{project.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul></div></details>
  </article>;
}
