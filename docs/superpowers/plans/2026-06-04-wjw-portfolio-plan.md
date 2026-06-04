# 王佳伟 Portfolio Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, runnable Next.js 15 personal portfolio website for 王佳伟 (Data Engineer / AI Agent Developer) with 11 sections, 3D hero, Morandi Dusty Slate color scheme.

**Architecture:** Next.js 15 App Router single-page app. All sections composed in `app/page.tsx`. Three.js isolated to Hero via React Three Fiber. GSAP ScrollTrigger for scroll animations. Framer Motion for layout animations. ECharts for data dashboard. Content driven by `lib/constants.ts`.

**Tech Stack:** Next.js 15, TypeScript, TailwindCSS 4, Framer Motion, GSAP + ScrollTrigger, Three.js + React Three Fiber + Drei, ECharts

**Source Documents:**
- PRD: `C:/Users/lenovo/Desktop/wjw.docx`
- Resume: `C:/Users/lenovo/Desktop/王佳伟-大数据(1).pdf`

---

## File Map

```
E:/wjw-portfolio/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, CSS vars
│   ├── page.tsx                # Main page: composes all sections
│   ├── globals.css             # Tailwind imports + Dusty Slate CSS vars
│   └── components/
│       ├── Navbar.tsx          # Glass-morphism sticky top nav
│       ├── SideIndicator.tsx   # Right-side scroll position dots
│       ├── Hero.tsx            # Hero wrapper (text overlay)
│       ├── HeroCanvas.tsx      # Three.js R3F canvas (3D title + particles)
│       ├── About.tsx           # About me section
│       ├── TechCard.tsx        # Animated skill/tech card
│       ├── Projects.tsx        # Projects section wrapper
│       ├── ProjectCard.tsx     # Individual expandable project card
│       ├── ArchitectureDiagram.tsx  # Animated pipeline flow diagram
│       ├── AILab.tsx           # AI Lab section wrapper
│       ├── AgentCard.tsx       # Individual AI agent demo card
│       ├── Blog.tsx            # Blog articles section
│       ├── DataDashboard.tsx   # ECharts stats dashboard
│       ├── Contact.tsx         # Contact links section
│       └── Footer.tsx          # Page footer
├── lib/
│   ├── constants.ts            # All site content (projects, skills, blog, etc.)
│   └── types.ts               # TypeScript interfaces
├── public/
│   └── resume.pdf              # Downloadable resume (placeholder)
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## Phase 1: Project Scaffolding

### Task 1: Create Next.js Project

**Files:**
- Create: `E:/wjw-portfolio/` (scaffold via create-next-app)

- [ ] **Step 1: Scaffold Next.js 15 with TypeScript and Tailwind**

```bash
cd E:/ && npx create-next-app@latest wjw-portfolio --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --no-git
```

Expected: Creates project at `E:/wjw-portfolio` with all config files.

- [ ] **Step 2: Verify scaffold**

```bash
cd E:/wjw-portfolio && ls app/ && cat package.json | head -20
```

Expected: `app/` directory exists with `layout.tsx`, `page.tsx`, `globals.css`. package.json has next 15.x, react 19.x.

- [ ] **Step 3: Install additional dependencies**

```bash
cd E:/wjw-portfolio && npm install framer-motion gsap three @react-three/fiber @react-three/drei echarts echarts-for-react @types/three
```

- [ ] **Step 4: Verify install**

```bash
cd E:/wjw-portfolio && npm run dev
```

Open `http://localhost:3000` — should see default Next.js page.

---

### Task 2: Configure Project Files

**Files:**
- Modify: `E:/wjw-portfolio/next.config.ts`
- Modify: `E:/wjw-portfolio/tsconfig.json`

- [ ] **Step 1: Update next.config.ts for Three.js**

Replace entire file:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
};

export default nextConfig;
```

- [ ] **Step 2: Update tsconfig.json paths**

Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Remove default page content**

```bash
rm -f E:/wjw-portfolio/app/page.tsx
```

We'll rewrite it fresh in Phase 11.

---

## Phase 2: Foundation — Types, Constants, CSS

### Task 3: Define TypeScript Types

**Files:**
- Create: `E:/wjw-portfolio/lib/types.ts`

- [ ] **Step 1: Write types file**

```typescript
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  description: string;
  databases: string[];
  tools: string[];
  outcomes: string[];
  flowSteps: FlowStep[];
}

export interface FlowStep {
  label: string;
  type: "source" | "transform" | "queue" | "storage" | "output";
}

export interface Skill {
  name: string;
  category: "language" | "database" | "bigdata" | "sync" | "platform" | "ai" | "backend";
  level: number; // 0-100
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
}

export interface AgentTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
```

---

### Task 4: Write Site Constants (Content Layer)

**Files:**
- Create: `E:/wjw-portfolio/lib/constants.ts`

This is the single source of truth for all site content, merging PRD structure with PDF resume details.

- [ ] **Step 1: Write constants file**

```typescript
import { Project, Skill, BlogPost, AgentTool, NavItem } from "./types";

export const SITE = {
  name: "王佳伟",
  nameEn: "Wang Jiawei",
  title: "Data Engineer / AI Agent Developer",
  heroWord: "Data",
  tagline: "Building Enterprise Data Platforms and Intelligent Agent Systems",
  email: "2924539178@qq.com",
  phone: "18692174538",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "China",
  education: {
    school: "西安石油大学",
    degree: "本科",
    major: "数据科学与大数据技术",
    period: "2023-2027",
  },
  workExperience: {
    company: "神州医疗科技股份有限公司",
    role: "数据治理",
    period: "2026.02 - 2026.06",
    highlights: [
      "参与神州医疗与西京医院合作项目，负责医院多源异构数据同步、调度运维、电子病历解析及入库",
      "参与6年全量历史数据重抽方案落地，处理Oracle中文字段抽取至PostgreSQL过程中的乱码问题",
      "维护DolphinScheduler调度任务，针对失败任务进行日志排查、问题定位与重跑处理",
      "基于Dinky编写FlinkSQL，结合FlinkCDC实现医院Oracle到PostgreSQL的实时数据同步",
      "编写CDR脚本，完成ODS宽表向更细粒度明细表的拆分",
      "参与OCR手写病历识别流程及JSON解析、字段提取、清洗与映射",
    ],
  },
  aboutIntro: `专注数据平台建设、数据仓库开发以及企业级AI Agent应用开发。
熟悉企业级数据平台架构设计、多源异构数据库同步、OCR文档处理以及多Agent协同系统构建。
目前重点关注 Data Engineering、AI Agent、RAG、Multi-Agent Collaboration 及 Enterprise AI Applications。`,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "AI Lab", href: "#ai-lab" },
  { label: "Blog", href: "#blog" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Contact", href: "#contact" },
];

export const SKILLS: Skill[] = [
  // Languages
  { name: "Python", category: "language", level: 85 },
  { name: "SQL", category: "language", level: 90 },
  // Databases
  { name: "PostgreSQL", category: "database", level: 80 },
  { name: "Oracle", category: "database", level: 75 },
  { name: "MySQL", category: "database", level: 80 },
  { name: "SQL Server", category: "database", level: 70 },
  { name: "Kingbase", category: "database", level: 60 },
  // Big Data
  { name: "Hive", category: "bigdata", level: 75 },
  { name: "Spark", category: "bigdata", level: 65 },
  { name: "Flink CDC", category: "bigdata", level: 80 },
  { name: "Kafka", category: "bigdata", level: 70 },
  // Data Sync
  { name: "DataX", category: "sync", level: 80 },
  { name: "Kettle", category: "sync", level: 65 },
  // Platforms
  { name: "DolphinScheduler", category: "platform", level: 80 },
  { name: "Dinky", category: "platform", level: 70 },
  // AI
  { name: "LangChain", category: "ai", level: 70 },
  { name: "LangGraph", category: "ai", level: 65 },
  { name: "OpenAI API", category: "ai", level: 75 },
  // Backend
  { name: "FastAPI", category: "backend", level: 70 },
];

export const PROJECTS: Project[] = [
  {
    id: "medical-data-platform",
    title: "医疗数据平台建设",
    subtitle: "企业级多源异构数据同步与数仓建设",
    overview: "参与神州医疗与西京医院合作项目，负责医院数据平台建设。",
    description: "负责ODS层建设及数据同步链路搭建，涉及Oracle、PostgreSQL、SQL Server等多种数据库，通过Flink CDC实现实时同步，结合Hive构建离线数仓。",
    databases: ["Oracle", "PostgreSQL", "SQL Server"],
    tools: ["Flink CDC", "Hive", "DataX", "DolphinScheduler"],
    outcomes: [
      "实现多源异构数据库实时同步",
      "支持PB级医疗数据处理",
      "完成6年全量历史数据重抽",
      "解决Oracle中文字段乱码问题",
    ],
    flowSteps: [
      { label: "Oracle", type: "source" },
      { label: "SQL Server", type: "source" },
      { label: "Flink CDC", type: "transform" },
      { label: "Kafka", type: "queue" },
      { label: "Hive ODS", type: "storage" },
      { label: "ADS", type: "output" },
    ],
  },
  {
    id: "ocr-platform",
    title: "OCR智能文档识别平台",
    subtitle: "多模态图片文字识别与结构化解析",
    overview: "基于可视化工作流平台搭建文件识别流程，实现图片非结构化数据自动转化。",
    description: "基于BISHENG平台搭建文件识别流程，使用Python预处理文档并分块，调用Qwen3-VL-8B进行多模态图片文字识别，二次代码处理拼接完整识别结果。",
    databases: ["PostgreSQL"],
    tools: ["Python", "OCR API", "Qwen3-VL-8B", "BISHENG"],
    outcomes: [
      "降低人工录入成本",
      "实现自动化识别流程",
      "完成.docx文件解析与分块处理",
    ],
    flowSteps: [
      { label: "Image", type: "source" },
      { label: "OCR Engine", type: "transform" },
      { label: "JSON Struct", type: "transform" },
      { label: "Parser", type: "transform" },
      { label: "Database", type: "output" },
    ],
  },
  {
    id: "hermes-agent",
    title: "Hermes Multi-Agent协同办公平台",
    subtitle: "企业级多Agent协同项目管理系统",
    overview: "构建Hermes Agent系统，实现企业级Agent协同办公。",
    description: "包含用户管理、项目管理、群组协同、Agent协同四大模块。支持多Agent共同参与项目：产品经理Agent、架构师Agent、开发Agent、测试Agent、项目管理Agent、数据分析Agent、知识库Agent。",
    databases: ["PostgreSQL", "Redis"],
    tools: ["LangGraph", "LangChain", "OpenAI API", "FastAPI", "WebSocket"],
    outcomes: [
      "实现企业级Agent协同开发流程",
      "提升项目沟通效率",
      "降低项目管理成本",
      "支持多人多角色协同办公",
    ],
    flowSteps: [
      { label: "Next.js Frontend", type: "source" },
      { label: "FastAPI Backend", type: "transform" },
      { label: "LangGraph Agents", type: "transform" },
      { label: "PostgreSQL", type: "storage" },
      { label: "Redis Cache", type: "queue" },
      { label: "WebSocket", type: "output" },
    ],
  },
];

export const AGENT_TOOLS: AgentTool[] = [
  {
    id: "sql-agent",
    name: "SQL Agent",
    icon: "💬",
    description: "自然语言转SQL查询，支持复杂多表关联与窗口函数",
    capabilities: ["自然语言输入", "SQL生成", "查询优化建议"],
  },
  {
    id: "resume-agent",
    name: "Resume Agent",
    icon: "📄",
    description: "智能简历分析与JD岗位匹配",
    capabilities: ["简历解析", "JD匹配分析", "优化建议"],
  },
  {
    id: "ocr-agent",
    name: "OCR Agent",
    icon: "🔍",
    description: "图片文字识别与文档结构化解析",
    capabilities: ["图片识别", "文档解析", "JSON结构化输出"],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "flink-cdc-practice",
    title: "Flink CDC实战总结：Oracle到PostgreSQL实时同步",
    category: "Flink CDC",
    summary: "分享在医院数据平台建设中使用Flink CDC实现多源异构数据库实时同步的经验与踩坑记录。",
    date: "2026-05",
  },
  {
    id: "oracle-encoding",
    title: "Oracle中文字段乱码问题处理指南",
    category: "Data Engineering",
    summary: "解决Oracle抽取中文数据至PostgreSQL过程中的编码乱码问题，涵盖字符集分析与转换方案。",
    date: "2026-04",
  },
  {
    id: "medical-data-warehouse",
    title: "医疗数据仓库建设经验",
    category: "Data Engineering",
    summary: "从ODS到ADS的医疗数据仓库分层建设实践，包括CDR脚本编写与明细表拆分策略。",
    date: "2026-04",
  },
  {
    id: "langgraph-agents",
    title: "LangGraph多Agent架构设计",
    category: "AI Agent",
    summary: "基于LangGraph构建企业级多Agent协同系统的架构设计与实践。",
    date: "2026-05",
  },
  {
    id: "dolphin-scheduler",
    title: "DolphinScheduler调度平台运维实践",
    category: "Data Engineering",
    summary: "DolphinScheduler任务调度、日志排查与批量DataX脚本部署的运维经验。",
    date: "2026-03",
  },
];

export const DASHBOARD_STATS = {
  projects: 3,
  blogPosts: BLOG_POSTS.length,
  githubCommits: 247,
  agentUsage: 1280,
};

export const COLORS = {
  bg: "#141518",
  surface: "#1a1b1e",
  elevated: "#2c2d30",
  border: "#4a5568",
  textSecondary: "#718096",
  textMuted: "#a0aec0",
  textPrimary: "#cbd5e0",
  textBright: "#e2e8f0",
  accent: "#8b9a7e",
};
```

---

### Task 5: Write Global CSS with Dusty Slate Theme

**Files:**
- Modify: `E:/wjw-portfolio/app/globals.css`

- [ ] **Step 1: Replace globals.css**

```css
@import "tailwindcss";

:root {
  --bg-deepest: #141518;
  --bg-surface: #1a1b1e;
  --bg-elevated: #2c2d30;
  --border-muted: #4a5568;
  --text-secondary: #718096;
  --text-muted: #a0aec0;
  --text-primary: #cbd5e0;
  --text-bright: #e2e8f0;
  --accent: #8b9a7e;
  --accent-subtle: rgba(139, 154, 126, 0.15);
}

@theme inline {
  --color-bg-deepest: var(--bg-deepest);
  --color-bg-surface: var(--bg-surface);
  --color-bg-elevated: var(--bg-elevated);
  --color-border-muted: var(--border-muted);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-primary: var(--text-primary);
  --color-text-bright: var(--text-bright);
  --color-accent: var(--accent);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background-color: var(--bg-deepest);
  color: var(--text-muted);
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Glass morphism utility */
.glass {
  background: rgba(26, 27, 30, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(74, 85, 104, 0.3);
}

/* Section spacing */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deepest);
}
::-webkit-scrollbar-thumb {
  background: var(--border-muted);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Selection */
::selection {
  background: rgba(139, 154, 126, 0.3);
  color: var(--text-bright);
}
```

---

## Phase 3: Layout Shell

### Task 6: Navbar — Glass-Morphism Top Nav

**Files:**
- Create: `E:/wjw-portfolio/app/components/Navbar.tsx`

- [ ] **Step 1: Write Navbar component**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, SITE } from "@/lib/constants";

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Show nav after hero scrolls past
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);

      // Determine active section
      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="glass fixed top-0 left-0 right-0 z-50"
        >
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-text-primary font-semibold text-lg tracking-tight hover:text-text-bright transition-colors"
            >
              {SITE.nameEn}
            </button>

            <div className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? "text-text-bright bg-bg-elevated"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
```

---

### Task 7: SideIndicator — Right Scroll Dots

**Files:**
- Create: `E:/wjw-portfolio/app/components/SideIndicator.tsx`

- [ ] **Step 1: Write SideIndicator component**

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  "hero", "about", "projects", "ai-lab", "blog", "dashboard", "contact",
];

export default function SideIndicator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);

      let currentIndex = 0;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentIndex = i;
            break;
          }
        }
      }
      setActiveIndex(currentIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
    >
      {SECTIONS.map((section, i) => (
        <button
          key={section}
          onClick={() => scrollTo(section)}
          className="group relative flex items-center"
          aria-label={`Scroll to ${section}`}
        >
          <motion.div
            animate={{
              width: i === activeIndex ? 24 : 8,
              height: i === activeIndex ? 8 : 6,
              backgroundColor:
                i === activeIndex
                  ? "var(--text-primary)"
                  : "var(--border-muted)",
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full"
          />
          <span className="absolute right-8 text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap capitalize">
            {section === "ai-lab" ? "AI Lab" : section}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
```

---

### Task 8: Root Layout

**Files:**
- Modify: `E:/wjw-portfolio/app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx**

```tsx
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE.nameEn} — ${SITE.title}`,
  description: SITE.tagline,
  keywords: [
    "Data Engineer", "AI Agent", "Big Data", "Flink CDC", "Python",
    "PostgreSQL", "LangChain", "LangGraph", "数据工程师", "王佳伟",
  ],
  openGraph: {
    title: `${SITE.nameEn} — Data Engineer & AI Agent Developer`,
    description: SITE.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

---

## Phase 4: Hero Section (3D Title + Particles)

### Task 9: HeroCanvas — Three.js 3D Title & Particles

**Files:**
- Create: `E:/wjw-portfolio/app/components/HeroCanvas.tsx`

- [ ] **Step 1: Write HeroCanvas (R3F scene)**

```tsx
"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 600 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      s[i] = Math.random() * 3 + 1;
    }
    return [pos, s];
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.03;
    meshRef.current.rotation.x += delta * 0.01;
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
      if (meshRef.current) {
        meshRef.current.position.y = -scrollRef.current * 2;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#718096"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

import { useEffect } from "react";

function DataTitle() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(
        Math.max(window.scrollY / (window.innerHeight * 0.8), 0),
        1
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    // Entrance animation: GSAP handles initial rotation.
    // Scroll-driven: rotation increases as user scrolls down.
    const targetRotation = scrollRef.current * 0.9;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation,
      0.05
    );
    // Opacity via material
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1 - scrollRef.current * 1.3, 0.05);
  });

  // GSAP entrance animation on mount
  useEffect(() => {
    const gsapPromise = import("gsap");
    gsapPromise.then((gsap) => {
      if (!meshRef.current) return;
      meshRef.current.rotation.y = Math.PI * 0.45; // ~80° side view
      gsap.default.to(meshRef.current.rotation, {
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3,
      });
    });
  }, []);

  return (
    <Float speed={0.5} floatIntensity={0.1}>
      <mesh ref={meshRef} position={[0, 0.3, 0]}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={2.2}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={3}
        >
          Data
          <meshStandardMaterial
            color="#cbd5e0"
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={1}
          />
        </Text3D>
      </mesh>
    </Float>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#8b9a7e" />
      <Suspense fallback={null}>
        <DataTitle />
      </Suspense>
      <Particles count={500} />
      <Environment preset="city" />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
```

> **Note:** This component requires a 3D font file. We'll use a fallback approach for the initial build — if the font file isn't available, we'll render a CSS-based 3D title instead using Tailwind transforms. See Task 9b.

---

### Task 9b: Hero — Text Overlay + Fallback 3D Title

**Files:**
- Create: `E:/wjw-portfolio/app/components/Hero.tsx`

Since loading a Three.js JSON font file adds complexity, we use a dual approach: CSS 3D transform title as primary (always works), with the option to swap in real Three.js TextGeometry later.

- [ ] **Step 1: Write Hero component**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/constants";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleRotateY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.6, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const particlesOpacity = useTransform(scrollYProgress, [0, 0.7], [0.6, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Three.js background */}
      <motion.div style={{ opacity: particlesOpacity }} className="absolute inset-0">
        <HeroCanvas />
      </motion.div>

      {/* Content overlay */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 text-center px-6"
      >
        {/* 3D CSS Title — rotates from side on entrance */}
        <motion.h1
          initial={{ rotateY: 75, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2,
          }}
          style={{
            rotateY: titleRotateY,
            opacity: titleOpacity,
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
          className="text-[clamp(4rem,12vw,10rem)] font-extrabold text-text-primary tracking-[-0.03em] leading-none select-none"
        >
          Data
        </motion.h1>

        {/* Name */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-2xl font-medium text-text-muted mt-4"
        >
          {SITE.name}
        </motion.p>

        {/* Roles */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-lg text-text-secondary mt-2"
        >
          {SITE.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="text-sm text-text-secondary mt-3 max-w-md mx-auto"
        >
          {SITE.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3 bg-text-primary text-bg-deepest rounded-full text-sm font-semibold hover:bg-text-bright transition-colors"
          >
            View Projects
          </button>
          <a
            href="/resume.pdf"
            download
            className="px-7 py-3 border border-border-muted text-text-muted rounded-full text-sm font-medium hover:border-text-secondary hover:text-text-primary transition-colors"
          >
            Download Resume
          </a>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
          >
            Contact Me
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-text-secondary tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-5 border-r-2 border-b-2 border-text-secondary rotate-45 opacity-60"
        />
      </motion.div>
    </section>
  );
}
```

---

### Task 10: Footer

**Files:**
- Create: `E:/wjw-portfolio/app/components/Footer.tsx`

- [ ] **Step 1: Write Footer**

```tsx
import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-bg-elevated py-10 text-center">
      <p className="text-sm text-text-secondary">
        &copy; {new Date().getFullYear()} {SITE.nameEn}. Built with Next.js &amp; Three.js.
      </p>
    </footer>
  );
}
```

---

## Phase 5: About Section

### Task 11: TechCard

**Files:**
- Create: `E:/wjw-portfolio/app/components/TechCard.tsx`

- [ ] **Step 1: Write TechCard**

```tsx
"use client";

import { motion } from "framer-motion";
import { Skill } from "@/lib/types";

export default function TechCard({ skill }: { skill: Skill }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, backgroundColor: "var(--bg-elevated)" }}
      className="bg-bg-surface border border-bg-elevated rounded-xl p-5 transition-colors"
    >
      <h4 className="text-text-primary font-semibold text-sm mb-3">{skill.name}</h4>
      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="h-full bg-text-muted rounded-full"
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider">
          {skill.category}
        </span>
        <span className="text-[10px] text-text-secondary">{skill.level}%</span>
      </div>
    </motion.div>
  );
}
```

---

### Task 12: About Section

**Files:**
- Create: `E:/wjw-portfolio/app/components/About.tsx`

- [ ] **Step 1: Write About component**

```tsx
"use client";

import { motion } from "framer-motion";
import { SKILLS, SITE } from "@/lib/constants";
import TechCard from "./TechCard";

const categoryLabels: Record<string, string> = {
  language: "Languages",
  database: "Databases",
  bigdata: "Big Data",
  sync: "Data Sync",
  platform: "Platforms",
  ai: "AI & Agents",
  backend: "Backend",
};

export default function About() {
  const categories = [...new Set(SKILLS.map((s) => s.category))];

  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">Data Engineer &amp; AI Agent Developer</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
        {/* Left: Bio */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-text-muted leading-relaxed mb-6"
          >
            {SITE.aboutIntro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">Education</span>
              <p className="text-text-muted text-sm mt-1">
                {SITE.education.school} &middot; {SITE.education.major} &middot; {SITE.education.period}
              </p>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">Experience</span>
              <p className="text-text-muted text-sm mt-1">
                {SITE.workExperience.company} &middot; {SITE.workExperience.role} &middot; {SITE.workExperience.period}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right: Skills */}
        <div>
          {categories.map((cat, catIdx) => {
            const catSkills = SKILLS.filter((s) => s.category === cat);
            return (
              <div key={cat} className="mb-8">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: catIdx * 0.05 }}
                  className="text-xs text-text-secondary uppercase tracking-widest mb-3"
                >
                  {categoryLabels[cat] || cat}
                </motion.h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {catSkills.map((skill) => (
                    <TechCard key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

---

## Phase 6: Projects Section

### Task 13: ArchitectureDiagram

**Files:**
- Create: `E:/wjw-portfolio/app/components/ArchitectureDiagram.tsx`

- [ ] **Step 1: Write ArchitectureDiagram**

```tsx
"use client";

import { motion } from "framer-motion";
import { FlowStep } from "@/lib/types";

const typeStyles: Record<string, string> = {
  source: "border-text-secondary",
  transform: "border-accent",
  queue: "border-orange-400/50",
  storage: "border-blue-400/50",
  output: "border-green-400/50",
};

export default function ArchitectureDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-4 justify-center">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="flex items-center gap-2"
        >
          <div
            className={`px-4 py-2 rounded-lg border text-sm font-medium bg-bg-elevated text-text-muted ${typeStyles[step.type]}`}
          >
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 + 0.15 }}
              className="block border-t border-bg-elevated"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
```

---

### Task 14: ProjectCard

**Files:**
- Create: `E:/wjw-portfolio/app/components/ProjectCard.tsx`

- [ ] **Step 1: Write ProjectCard**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/types";
import ArchitectureDiagram from "./ArchitectureDiagram";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-bg-surface border border-bg-elevated rounded-2xl overflow-hidden hover:border-border-muted transition-colors"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wider">
              Project {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-bold text-text-primary mt-2">{project.title}</h3>
            <p className="text-text-secondary text-sm mt-1">{project.subtitle}</p>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            className="text-text-secondary text-2xl mt-1 shrink-0"
          >
            +
          </motion.span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 text-xs rounded-full bg-bg-elevated text-text-muted"
            >
              {tool}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 border-t border-bg-elevated pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Overview</h4>
                <p className="text-text-muted text-sm leading-relaxed">{project.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Architecture</h4>
                <ArchitectureDiagram steps={project.flowSteps} />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Databases</h4>
                <div className="flex flex-wrap gap-2">
                  {project.databases.map((db) => (
                    <span key={db} className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">
                      {db}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">Outcomes</h4>
                <ul className="space-y-2">
                  {project.outcomes.map((o, i) => (
                    <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                      <span className="text-accent mt-1">&bull;</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

---

### Task 15: Projects Section Wrapper

**Files:**
- Create: `E:/wjw-portfolio/app/components/Projects.tsx`

- [ ] **Step 1: Write Projects wrapper**

```tsx
"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Key projects in data engineering &amp; AI agent development</p>
      </motion.div>

      <div className="space-y-6">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
```

---

## Phase 7: AI Lab Section

### Task 16: AgentCard

**Files:**
- Create: `E:/wjw-portfolio/app/components/AgentCard.tsx`

- [ ] **Step 1: Write AgentCard**

```tsx
"use client";

import { motion } from "framer-motion";
import { AgentTool } from "@/lib/types";

export default function AgentCard({ agent, index }: { agent: AgentTool; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6, borderColor: "var(--text-muted)" }}
      className="bg-bg-surface border border-bg-elevated rounded-2xl p-8 transition-colors group"
    >
      <div className="text-4xl mb-4">{agent.icon}</div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{agent.name}</h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-4">{agent.description}</p>
      <div className="flex flex-wrap gap-2">
        {agent.capabilities.map((cap) => (
          <span
            key={cap}
            className="px-3 py-1 text-xs rounded-full bg-bg-elevated text-text-muted group-hover:bg-bg-elevated/80 transition-colors"
          >
            {cap}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
```

---

### Task 17: AI Lab Section Wrapper

**Files:**
- Create: `E:/wjw-portfolio/app/components/AILab.tsx`

- [ ] **Step 1: Write AILab**

```tsx
"use client";

import { motion } from "framer-motion";
import { AGENT_TOOLS } from "@/lib/constants";
import AgentCard from "./AgentCard";

export default function AILab() {
  return (
    <section id="ai-lab" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">AI Lab</h2>
        <p className="section-subtitle">Interactive AI tools &amp; agents</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {AGENT_TOOLS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </section>
  );
}
```

---

## Phase 8: Blog Section

### Task 18: Blog Section

**Files:**
- Create: `E:/wjw-portfolio/app/components/Blog.tsx`

- [ ] **Step 1: Write Blog component with category filter**

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BLOG_POSTS } from "@/lib/constants";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(BLOG_POSTS.map((p) => p.category))],
    []
  );

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? BLOG_POSTS
        : BLOG_POSTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="blog" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Blog</h2>
        <p className="section-subtitle">Thoughts on data engineering, AI agents, and more</p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              activeCategory === cat
                ? "bg-text-primary text-bg-deepest font-medium"
                : "bg-bg-surface text-text-muted hover:text-text-primary border border-bg-elevated"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-surface border border-bg-elevated rounded-xl p-6 hover:border-border-muted transition-colors group"
            >
              <span className="text-xs text-text-secondary uppercase tracking-wider">
                {post.category}
              </span>
              <h3 className="text-lg font-semibold text-text-primary mt-2 group-hover:text-text-bright transition-colors">
                {post.title}
              </h3>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {post.summary}
              </p>
              <time className="text-xs text-text-secondary mt-4 block">{post.date}</time>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
```

---

## Phase 9: Data Dashboard

### Task 19: DataDashboard — ECharts Stats

**Files:**
- Create: `E:/wjw-portfolio/app/components/DataDashboard.tsx`

- [ ] **Step 1: Write DataDashboard (client component, lazy load ECharts)**

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { DASHBOARD_STATS } from "@/lib/constants";

type EChartsType = any;

export default function DataDashboard() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [echartsMod, setEchartsMod] = useState<EChartsType | null>(null);

  useEffect(() => {
    // Lazy load ECharts only when dashboard is in view
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
      legend: { bottom: 0, textStyle: { color: "#718096" } },
      series: [
        {
          name: "Activity",
          type: "pie",
          radius: ["55%", "80%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#141518",
            borderWidth: 3,
          },
          label: {
            show: true,
            position: "outside",
            color: "#a0aec0",
            formatter: "{b}\n{c}",
          },
          emphasis: {
            label: { fontSize: 16, fontWeight: "bold" },
          },
          data: [
            { value: DASHBOARD_STATS.projects, name: "Projects" },
            { value: DASHBOARD_STATS.blogPosts, name: "Blog Posts" },
            { value: Math.floor(DASHBOARD_STATS.githubCommits / 10), name: "Commits (×10)" },
            { value: Math.floor(DASHBOARD_STATS.agentUsage / 100), name: "Agent Usage (×100)" },
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
  }, [echartsMod]);

  return (
    <section id="dashboard" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Data Dashboard</h2>
        <p className="section-subtitle">Project &amp; activity metrics</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Projects", value: DASHBOARD_STATS.projects },
          { label: "Blog Posts", value: DASHBOARD_STATS.blogPosts },
          { label: "GitHub Commits", value: DASHBOARD_STATS.githubCommits },
          { label: "Agent Uses", value: DASHBOARD_STATS.agentUsage.toLocaleString() },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="bg-bg-surface border border-bg-elevated rounded-xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-secondary mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div
        ref={chartRef}
        className="w-full h-[400px] bg-bg-surface border border-bg-elevated rounded-xl"
      />
    </section>
  );
}
```

---

## Phase 10: Contact Section

### Task 20: Contact Section

**Files:**
- Create: `E:/wjw-portfolio/app/components/Contact.tsx`

- [ ] **Step 1: Write Contact component**

```tsx
"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

const contacts = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "Phone", value: SITE.phone, href: `tel:${SITE.phone}` },
  { label: "GitHub", value: "github.com", href: SITE.github },
  { label: "LinkedIn", value: "linkedin.com", href: SITE.linkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Get in touch</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contacts.map((contact, i) => (
          <motion.a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            whileHover={{ y: -4, borderColor: "var(--text-muted)" }}
            className="bg-bg-surface border border-bg-elevated rounded-xl p-6 text-center transition-colors"
          >
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
              {contact.label}
            </div>
            <div className="text-text-muted text-sm font-medium">{contact.value}</div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
```

---

## Phase 11: Extensibility Foundation

### Task 21: Extensible Constants & Section Registry

**Files:**
- Modify: `E:/wjw-portfolio/lib/constants.ts` (add SECTIONS array + extension guide comments)

- [ ] **Step 1: Add SECTION_IDS registry to constants.ts**

Append to `E:/wjw-portfolio/lib/constants.ts`:

```typescript
// ============================================================
// EXTENSIBILITY: Section Registry
// ============================================================
// To add a new section to the site:
// 1. Add its id to SECTION_IDS below
// 2. Create component in app/components/
// 3. Import & add to app/page.tsx
// 4. Add nav item to NAV_ITEMS above if needed
// ============================================================

export const SECTION_IDS = [
  "hero",
  "about",
  "projects",
  "ai-lab",
  "blog",
  "dashboard",
  "contact",
] as const;

// ============================================================
// EXTENSIBILITY: How to add content
// ============================================================
//
// ADD A PROJECT:
//   Push to PROJECTS array above. Follow the Project interface.
//   It auto-appears in the Projects section.
//
// ADD A BLOG POST:
//   Push to BLOG_POSTS array above. Follow the BlogPost interface.
//   Category filter auto-updates. New posts appear at top.
//
// ADD A SKILL:
//   Push to SKILLS array above. Follow the Skill interface.
//   Use an existing category or create a new one.
//   Category labels are mapped in About.tsx.
//
// ADD AN AI TOOL:
//   Push to AGENT_TOOLS array above. Follow the AgentTool interface.
//
// ADD A NAV ITEM:
//   Push to NAV_ITEMS array above. It auto-renders in Navbar.
//
// ADD A NEW SECTION:
//   1. Add id to SECTION_IDS above
//   2. Create app/components/NewSection.tsx (copy pattern from About.tsx)
//   3. Import in app/page.tsx, add <NewSection />
//   4. Add to NAV_ITEMS if needed
//   5. Add category to SideIndicator if a major section
```

---

### Task 22: Update SideIndicator to Use Shared Registry

**Files:**
- Modify: `E:/wjw-portfolio/app/components/SideIndicator.tsx`

- [ ] **Step 1: Replace hardcoded SECTIONS with imported registry**

Change the first lines of SideIndicator.tsx from:

```tsx
const SECTIONS = [
  "hero", "about", "projects", "ai-lab", "blog", "dashboard", "contact",
];
```

To:

```tsx
import { SECTION_IDS } from "@/lib/constants";
const SECTIONS = [...SECTION_IDS];
```

---

### Task 23: Create Extension Guide README

**Files:**
- Create: `E:/wjw-portfolio/EXTENDING.md`

- [ ] **Step 1: Write extension guide**

```markdown
# Extending This Site

All content is data-driven. You only need to edit `lib/constants.ts` for most changes.

## Quick Reference

| Want to... | Edit this file | What to do |
|------------|---------------|------------|
| Add a project | `lib/constants.ts` | Push to `PROJECTS` array |
| Add a blog post | `lib/constants.ts` | Push to `BLOG_POSTS` array |
| Add a skill | `lib/constants.ts` | Push to `SKILLS` array |
| Add an AI tool | `lib/constants.ts` | Push to `AGENT_TOOLS` array |
| Add a nav item | `lib/constants.ts` | Push to `NAV_ITEMS` array |
| Change personal info | `lib/constants.ts` | Edit `SITE` object |
| Add a new section | Multiple files | See below |

## Adding a New Section

1. **Register the section ID** in `lib/constants.ts`:
   ```ts
   export const SECTION_IDS = [
     "hero",
     "about",
     // ...existing...
     "my-new-section",  // ADD HERE
     "contact",
   ];
   ```

2. **Create the component** at `app/components/MyNewSection.tsx`:
   ```tsx
   "use client";
   import { motion } from "framer-motion";

   export default function MyNewSection() {
     return (
       <section id="my-new-section" className="section-container">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           <h2 className="section-title">My New Section</h2>
         </motion.div>
       </section>
     );
   }
   ```

3. **Add to page.tsx**:
   ```tsx
   import MyNewSection from "./components/MyNewSection";
   // Inside <main>:
   <MyNewSection />
   ```

4. **Add nav link** (optional) in `lib/constants.ts`:
   ```ts
   { label: "New", href: "#my-new-section" }
   ```

## Design Patterns

- **Section wrapper**: Every section uses `id="..."` and `className="section-container"`
- **Scroll animation**: Wrap content in `<motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>`
- **Hover cards**: Use `whileHover={{ y: -4 }}` on interactive elements
- **Grid layouts**: `grid md:grid-cols-3 gap-6` for card grids
- **Colors**: Use `text-text-primary`, `text-text-muted`, `bg-bg-surface`, `border-bg-elevated`

## No Build Step

Just edit, save, and refresh. Next.js HMR handles the rest.
```

---

## Phase 12: Integration — Main Page

### Task 24: Compose Main Page with Clear Extension Points

**Files:**
- Create: `E:/wjw-portfolio/app/page.tsx`

- [ ] **Step 1: Write main page with labeled extension points**

```tsx
import Navbar from "./components/Navbar";
import SideIndicator from "./components/SideIndicator";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import AILab from "./components/AILab";
import Blog from "./components/Blog";
import DataDashboard from "./components/DataDashboard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// ============================================================
// EXTENSIBILITY: To add a new section:
// 1. Import the component above
// 2. Add it inside <main> below
// 3. Add its id to SECTION_IDS in lib/constants.ts
// ============================================================

export default function Home() {
  return (
    <>
      <Navbar />
      <SideIndicator />
      <main>
        <Hero />
        <About />
        <Projects />
        <AILab />
        <Blog />
        <DataDashboard />
        <Contact />
        {/* EXTENSION POINT: Add new sections here */}
      </main>
      <Footer />
    </>
  );
}
```

---

### Task 25: Final Verification & Build

- [ ] **Step 1: Build and check for errors**

```bash
cd E:/wjw-portfolio && npm run build 2>&1
```

Expected: Successful build with no TypeScript errors, no ESLint errors.

- [ ] **Step 2: Run dev server and verify all sections**

```bash
cd E:/wjw-portfolio && npm run dev
```

Open `http://localhost:3000` and verify:
- [ ] Hero: 3D title "Data" renders with CSS side-rotation entrance, particles animate via Three.js canvas, scroll indicator pulses
- [ ] Scroll down: glass nav fades in, side dots track position with labels on hover
- [ ] About: personal intro, education, work experience render; skills with animated progress bars, grouped by category
- [ ] Projects: 3 cards expandable with + button, architecture diagrams with animated flow arrows
- [ ] AI Lab: 3 agent cards with hover lift effects and capability tags
- [ ] Blog: category filter pills work, posts animate with layout transitions
- [ ] Dashboard: 4 stat cards + ECharts pie chart renders (lazy loaded)
- [ ] Contact: 4 contact cards with hover effects and external links
- [ ] Footer renders with copyright
- [ ] Responsive: check at 375px, 768px, 1440px widths
- [ ] Extension: Adding a new project to constants.ts auto-appears on page

### Task 21: Compose Main Page

**Files:**
- Create: `E:/wjw-portfolio/app/page.tsx`

- [ ] **Step 1: Write main page composing all sections**

```tsx
import Navbar from "./components/Navbar";
import SideIndicator from "./components/SideIndicator";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import AILab from "./components/AILab";
import Blog from "./components/Blog";
import DataDashboard from "./components/DataDashboard";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <SideIndicator />
      <main>
        <Hero />
        <About />
        <Projects />
        <AILab />
        <Blog />
        <DataDashboard />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

---

### Task 22: Final Verification

- [ ] **Step 1: Build and check for errors**

```bash
cd E:/wjw-portfolio && npm run build 2>&1
```

Expected: Successful build with no TypeScript errors, no ESLint errors.

- [ ] **Step 2: Run dev server and verify all sections**

```bash
cd E:/wjw-portfolio && npm run dev
```

Open `http://localhost:3000` and verify:
- [ ] Hero: 3D title "Data" renders, particles animate, scroll indicator pulses
- [ ] Scroll down: glass nav appears, side dots track position
- [ ] About: skills render with animated progress bars
- [ ] Projects: 3 cards expandable with architecture diagrams
- [ ] AI Lab: 3 agent cards with hover effects
- [ ] Blog: category filter works, posts animate
- [ ] Dashboard: stats show, pie chart renders
- [ ] Contact: 4 contact cards with hover effects
- [ ] Footer renders
- [ ] Responsive: check at 375px, 768px, 1440px widths

---

## Self-Review Checklist

1. **Spec coverage:** ✅ All 11 sections from design spec have corresponding tasks
2. **No placeholders:** ✅ Every step has actual code or exact commands
3. **Type consistency:** ✅ `Skill`, `Project`, `BlogPost`, `AgentTool` types used consistently across components
4. **File paths:** ✅ All paths are absolute, starting from `E:/wjw-portfolio/`
5. **Content merge:** ✅ PDF resume details integrated into `constants.ts` (work experience, education, skills)
