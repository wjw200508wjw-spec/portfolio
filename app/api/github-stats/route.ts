import { NextResponse } from "next/server";
import type { GitHubStats } from "@/lib/types";
const USER = "wjw200508wjw-spec";
const headers: Record<string,string> = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
async function github(path: string) {
  return fetch(`https://api.github.com/${path}`, { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
}
type Repo = { name: string; stargazers_count: number; size: number };
async function commits(repo: Repo): Promise<number | null> {
  try {
    const res = await github(`repos/${USER}/${encodeURIComponent(repo.name)}/commits?per_page=1`);
    if (res.status === 409 && repo.size === 0) return 0;
    if (!res.ok) return null;
    const link = res.headers.get("Link");
    const last = link?.match(/[?&]page=(\d+)>; rel="last"/);
    if (last) return Number(last[1]);
    const list: unknown = await res.json();
    return Array.isArray(list) ? list.length : null;
  } catch { return null; }
}
export async function GET() {
  try {
    const profileRes = await github(`users/${USER}`);
    if (!profileRes.ok) throw new Error("GitHub profile unavailable");
    const profile = await profileRes.json();
    const repos: Repo[] = [];
    const pages = Math.max(1, Math.ceil(profile.public_repos / 100));
    for (let page = 1; page <= pages; page++) {
      const res = await github(`users/${USER}/repos?per_page=100&type=owner&page=${page}`);
      if (!res.ok) throw new Error("GitHub repositories unavailable");
      const list: unknown = await res.json();
      if (!Array.isArray(list)) throw new Error("Invalid GitHub response");
      repos.push(...list);
    }
    const counts: (number | null)[] = [];
    for (let i=0;i<repos.length;i+=4) counts.push(...await Promise.all(repos.slice(i,i+4).map(commits)));
    const partial = counts.some(n => n === null);
    const stats: GitHubStats = { publicRepos: profile.public_repos, totalCommits: partial ? null : counts.reduce<number>((sum,n)=>sum+(n ?? 0),0), totalStars: repos.reduce((sum,r)=>sum+r.stargazers_count,0), fetchedAt: new Date().toISOString(), partial };
    return NextResponse.json(stats,{headers:{"Cache-Control":"public, max-age=60, s-maxage=3600"}});
  } catch {
    return NextResponse.json({error:"GitHub statistics temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
