"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { SHOWCASE } from "@/lib/showcase";
import { PROJECTS } from "@/lib/constants";
import ProjectPreview from "./ProjectPreview";

export default function WorkShowcase() {
  const [selected,setSelected]=useState(0);
  const [imageIndex,setImageIndex]=useState(0);
  const dialog=useRef<HTMLDialogElement>(null);
  const openButton=useRef<HTMLButtonElement>(null);
  const work=SHOWCASE[selected];
  const project=PROJECTS.find(item=>item.id===work.id) ?? PROJECTS[0];
  return <div className="showcase" data-reveal>
    <div className="showcase-stage">
      <div className="showcase-toolbar"><span className="showcase-dots" aria-hidden="true"><i/><i/><i/></span><span className="mono">{work.label}</span><span className="mono">0{selected+1} / 03</span></div>
      <button ref={openButton} className="showcase-screen" onClick={()=>{setImageIndex(0);dialog.current?.showModal();}} aria-label={`查看${work.title}详情`}><ProjectPreview key={work.id} project={project} /><span className="showcase-zoom">查看界面与详情 <span aria-hidden="true">↗</span></span></button>
      <div className="showcase-caption"><span>点击预览，查看原始界面与详情</span><a href={`#project-${work.id}`} className="text-link">了解实现过程 ↗</a></div>
    </div>
    <div className="showcase-selector" aria-label="选择成果">
      {SHOWCASE.map((item,index)=><button key={item.id} className="showcase-choice" aria-pressed={selected===index} onClick={()=>setSelected(index)}><span className="mono">0{index+1} / {item.kind}</span><span className="showcase-choice-title">{item.title}<span aria-hidden="true">↗</span></span>{selected===index&&<span className="showcase-choice-info"><span>{item.description}</span><span className="tags">{item.tags.map(tag=><span key={tag} className="tag">{tag}</span>)}</span></span>}</button>)}
      <div className="showcase-progress" aria-hidden="true"><span style={{width:`${(selected+1)/3*100}%`}}/></div>
    </div>
    <dialog ref={dialog} className="work-dialog" aria-labelledby="work-dialog-title" onClose={()=>openButton.current?.focus()} onClick={event=>{if(event.target===dialog.current)dialog.current.close();}}>
      <div className="work-dialog-panel"><div className="work-dialog-head"><div><span className="eyebrow">ACTUAL INTERFACE</span><h3 id="work-dialog-title">{work.title}</h3></div><button className="dialog-close" onClick={()=>dialog.current?.close()} aria-label="关闭成果大图" autoFocus>关闭 ×</button></div>
        <p className="work-dialog-description">{work.description}</p><div className="work-dialog-meta"><div className="tags">{work.tags.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div><a className="text-link" href={`#project-${work.id}`} onClick={()=>dialog.current?.close()}>查看完整项目详情 ↗</a></div>
        {work.images.length>1&&<div className="work-image-tabs" aria-label="选择界面">{work.images.map((item,index)=><button key={item.src} onClick={()=>setImageIndex(index)} aria-pressed={imageIndex===index}>{item.label}</button>)}</div>}
        <Image src={work.images[imageIndex]?.src??work.image} alt={`${work.title} · ${work.images[imageIndex]?.label??"实际界面"}`} width={work.width} height={work.height} sizes="96vw" className="work-dialog-image" />
      </div>
    </dialog>
  </div>;
}
