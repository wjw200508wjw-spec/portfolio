"use client";
import { useEffect, useState } from "react";
import { PROJECTS, SITE } from "@/lib/constants";
import type { GitHubStats } from "@/lib/types";
export default function DataDashboard() {
  const [stats,setStats] = useState<GitHubStats | null>(null);
  const [failed,setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-stats",{signal:controller.signal}).then(async res => {
      if (!res.ok) throw new Error("Stats unavailable");
      return res.json() as Promise<GitHubStats>;
    }).then(setStats).catch(error => { if (error.name !== "AbortError") setFailed(true); });
    return () => controller.abort();
  },[]);
  const number = (value: number | null | undefined) => value == null ? (failed || stats ? "—" : "…") : value.toLocaleString("zh-CN");
  return <section id="dashboard" className="activity-strip section-container"><div data-reveal><span className="eyebrow">KEEP BUILDING</span><h2>持续记录，持续迭代。</h2><a href={SITE.github} target="_blank" rel="noopener noreferrer" className="text-link">在 GitHub 上查看 ↗</a></div><div className="activity-stats" aria-live="polite"><div><strong>{PROJECTS.length}</strong><span>展示项目</span></div><div><strong>{number(stats?.publicRepos)}</strong><span>公开仓库</span></div><div><strong>{number(stats?.totalCommits)}</strong><span>默认分支提交</span></div><div><strong>{number(stats?.totalStars)}</strong><span>公开仓库 Stars</span></div></div><p className="activity-status">{failed ? "GitHub 数据暂时不可用，可前往 GitHub 查看。" : stats ? `${stats.partial ? "部分统计暂时不可用 · " : ""}GitHub 公开仓库数据 · 更新于 ${new Date(stats.fetchedAt).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai",hour12:false})}` : "正在读取 GitHub 公开仓库数据…"}</p></section>;
}
