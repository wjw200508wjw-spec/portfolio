import { PROJECTS } from "@/lib/constants";
import ProjectCard from "./ProjectCard";
import ProjectCollection from "./ProjectCollection";
export default function Projects() {
  return <section id="projects" className="section-container projects-section"><div className="section-kicker" data-reveal><span>02 / SELECTED WORK</span><span>从问题出发，把方案落地。</span></div><h2 className="display-title projects-title" data-reveal>SELECTED<br /><em>WORK.</em><span className="title-count">(07)</span></h2><p className="projects-intro" data-reveal>数据平台、AI 工作流与业务工具。<br />每个作品，都从一个具体的问题开始。</p><ProjectCollection entries={PROJECTS.map((project,index) => ({id:project.id,category:project.category,content:<ProjectCard key={project.id} project={project} index={index} />}))} /></section>;
}
