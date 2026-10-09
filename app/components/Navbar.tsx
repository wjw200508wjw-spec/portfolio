"use client";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { MotionToggle } from "./MotionSystem";
import Icon from "./Icon";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-15% 0px -65% 0px" });
    NAV_ITEMS.forEach(item => { const section = document.querySelector(item.href); if (section) observer.observe(section); });
    const close = () => { if (window.innerWidth >= 1000) setOpen(false); };
    window.addEventListener("resize", close);
    return () => { observer.disconnect(); window.removeEventListener("resize", close); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  return <header className="site-header">
    <nav className="nav-inner" aria-label="主导航">
      <a href="#hero" className="brand" aria-label="Data & AI，回到首页"><span className="brand-symbol">d<span>a</span>ta.</span><span className="brand-caption">DATA & AI<br />PORTFOLIO</span></a>
      <div className="desktop-nav">{NAV_ITEMS.map(item => <a key={item.href} href={item.href} aria-current={active === item.href.slice(1) ? "location" : undefined}>{item.label}</a>)}</div>
      <div className="nav-actions"><MotionToggle /><a className="nav-contact" href="#contact">聊聊合作 <span aria-hidden="true">↗</span></a>
        <button ref={trigger} className="menu-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "关闭菜单" : "打开菜单"}><span>{open ? "关闭" : "菜单"}</span><Icon name={open ? "close" : "menu"}/></button>
      </div>
    </nav>
    <div ref={menu} id="mobile-menu" className="mobile-menu" hidden={!open}>{NAV_ITEMS.map((item,index) => <a key={item.href} href={item.href} aria-current={active === item.href.slice(1) ? "location" : undefined} style={{animationDelay:`${index*25}ms`}} onClick={() => setOpen(false)}><span className="mobile-menu-label"><span className="mono">0{index+1}</span>{item.label}</span><Icon name="arrow-up-right"/></a>)}<a href={SITE.resume} download="数据工程-简历.pdf" onClick={() => setOpen(false)}>下载新简历 <Icon name="download"/></a></div>
  </header>;
}
