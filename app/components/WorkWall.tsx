import { PROJECTS } from "@/lib/constants";
import ProjectPreview from "./ProjectPreview";
export default function WorkWall() {
  const first = PROJECTS.slice(0,4), second = PROJECTS.slice(3,7);
  return <section className="work-wall" aria-label="作品概览" data-ambient><div className="wall-heading"><span className="eyebrow">A FEW THINGS I’VE BUILT</span><a href="#projects" className="text-link">查看全部作品 ↗</a></div>{[first,second].map((row,rowIndex) => <div className={`wall-lane wall-lane-${rowIndex}`} key={rowIndex}><div className="wall-track">{[0,1].map(copy => <div className="wall-group" key={copy} aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>{row.map(project => <a href={`#project-${project.id}`} className="wall-card" key={project.id} tabIndex={copy === 1 ? -1 : undefined} aria-label={`查看${project.title}`}><ProjectPreview project={project} compact /><span>{project.title}<i aria-hidden="true">↗</i></span></a>)}</div>)}</div></div>)}</section>;
}
