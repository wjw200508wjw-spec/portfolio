"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { DASHBOARD_STATS, COLORS } from "@/lib/constants";

type EChartsType = any;

interface GitHubStats {
  publicRepos: number;
  totalCommits: number;
  totalStars: number;
}

export default function DataDashboard() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [echartsMod, setEchartsMod] = useState<EChartsType | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);

  // Fetch real-time GitHub stats from our API route
  useEffect(() => {
    fetch("/api/github-stats")
      .then((res) => res.json())
      .then((data: GitHubStats) => setGithubStats(data))
      .catch(() => setGithubStats({ publicRepos: 0, totalCommits: 0, totalStars: 0 }));
  }, []);

  // Use live GitHub data when available, fallback to static values
  const stats = {
    projects: DASHBOARD_STATS.projects,
    blogPosts: DASHBOARD_STATS.blogPosts,
    githubCommits: githubStats?.totalCommits ?? DASHBOARD_STATS.githubCommits,
    githubRepos: githubStats?.publicRepos ?? DASHBOARD_STATS.githubRepos,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !echartsMod) {
          import("echarts").then((mod) => setEchartsMod(mod));
        }
      },
      { rootMargin: "200px" }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [echartsMod]);

  useEffect(() => {
    if (!echartsMod || !chartRef.current) return;
    const chart = echartsMod.init(chartRef.current, undefined, {
      backgroundColor: "transparent",
    });
    chart.setOption({
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        textStyle: { color: COLORS.textSecondary },
      },
      series: [
        {
          name: "Activity",
          type: "pie",
          radius: ["55%", "80%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: COLORS.bg,
            borderWidth: 3,
          },
          label: {
            show: true,
            position: "outside",
            color: COLORS.textMuted,
            formatter: "{b}\n{c}",
          },
          emphasis: {
            label: { fontSize: 16, fontWeight: "bold" },
          },
          data: [
            { value: stats.projects, name: "项目" },
            { value: stats.blogPosts, name: "博客文章" },
            { value: stats.githubCommits, name: "GitHub 提交" },
            { value: stats.githubRepos, name: "GitHub 仓库" },
          ],
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [echartsMod, stats]);

  return (
    <section id="dashboard" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">数据面板</h2>
        <p className="section-subtitle">项目 &amp; 活动数据统计</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "项目", value: stats.projects },
          { label: "博客文章", value: stats.blogPosts },
          { label: "GitHub 提交", value: stats.githubCommits },
          { label: "GitHub 仓库", value: stats.githubRepos },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="bg-bg-surface border border-bg-elevated rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-text-primary">
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ECharts Pie */}
      <div
        ref={chartRef}
        className="w-full h-[400px] bg-bg-surface border border-bg-elevated rounded-xl"
      />
    </section>
  );
}
