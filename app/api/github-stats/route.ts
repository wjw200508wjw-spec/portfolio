import { NextResponse } from "next/server";

const GITHUB_USER = "wjw200508wjw-spec";
const CACHE_SECONDS = 3600; // 1 hour

interface GitHubStats {
  publicRepos: number;
  totalCommits: number;
  totalStars: number;
}

export async function GET(): Promise<NextResponse<GitHubStats>> {
  try {
    // 1. Fetch user profile → public_repos
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: CACHE_SECONDS },
    });
    if (!userRes.ok) throw new Error(`User API returned ${userRes.status}`);
    const user = await userRes.json();

    // 2. Fetch all public repos
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: CACHE_SECONDS },
      }
    );
    if (!reposRes.ok) throw new Error(`Repos API returned ${reposRes.status}`);
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) {
      return NextResponse.json({
        publicRepos: user.public_repos || 0,
        totalCommits: 0,
        totalStars: 0,
      });
    }

    // 3. Sum stars
    const totalStars = repos.reduce(
      (sum: number, r: { stargazers_count?: number }) =>
        sum + (r.stargazers_count || 0),
      0
    );

    // 4. Count total commits across all repos (via Link header pagination)
    const commitCounts = await Promise.all(
      repos.map(
        async (repo: { name: string }): Promise<number> => {
          try {
            const commitsRes = await fetch(
              `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/commits?per_page=1`,
              { headers: { Accept: "application/vnd.github.v3+json" } }
            );
            const link = commitsRes.headers.get("Link");
            if (link) {
              const match = link.match(/[&?]page=(\d+)>; rel="last"/);
              if (match) return parseInt(match[1], 10);
            }
            // Fallback: count returned commits (0 or 1)
            const commits = await commitsRes.json();
            return Array.isArray(commits) ? commits.length : 0;
          } catch {
            return 0;
          }
        }
      )
    );
    const totalCommits = commitCounts.reduce((sum, c) => sum + c, 0);

    return NextResponse.json({
      publicRepos: user.public_repos || 0,
      totalCommits,
      totalStars,
    });
  } catch (error) {
    console.error("GitHub stats fetch failed:", error);
    // Return zeros on failure — dashboard will still render
    return NextResponse.json({
      publicRepos: 0,
      totalCommits: 0,
      totalStars: 0,
    });
  }
}
