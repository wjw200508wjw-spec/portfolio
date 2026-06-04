# 王佳伟 Personal Brand Portfolio — Design Spec

**Date:** 2026-06-04
**Status:** Approved
**Output:** E:/wjw-portfolio

## 1. Overview

A high-end personal brand portfolio website for 王佳伟 (Wang Jiawei), Data Engineer & AI Agent Developer. Single-page application with 11 sections, built as a complete runnable Next.js 15 project.

## 2. Design Decisions

| Decision | Choice |
|----------|--------|
| Visual direction | Minimal Premium — Linear + Apple style |
| Navigation | Hybrid: glass-morphism sticky top nav + right-side dot indicators, free scroll |
| Color palette | Dusty Slate (Morandi low-saturation cool grays) |
| Hero | 3D extruded "Data" title — side-entry rotation (75°→0°) → scroll-driven reverse rotation + dissolve |
| Typography | Inter (body) + system mono (code/pre) |

## 3. Color System

| Token | Hex | Usage |
|-------|-----|-------|
| bg-deepest | #141518 | Page background |
| bg-surface | #1a1b1e | Card backgrounds, nav |
| bg-elevated | #2c2d30 | Hover states, elevated cards |
| border-muted | #4a5568 | Borders, dividers |
| text-secondary | #718096 | Secondary text, captions |
| text-muted | #a0aec0 | Body text |
| text-primary | #cbd5e0 | Headings, primary text |
| text-bright | #e2e8f0 | Emphasis, active states |
| accent | #8b9a7e | Subtle accent (sage-tinted) |

## 4. Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **Animation:** Framer Motion (layout), GSAP (scroll-driven), Three.js + React Three Fiber (3D)
- **Charts:** ECharts (Data Dashboard)
- **Package Manager:** pnpm

## 5. Site Structure (11 Sections)

### 5.1 Hero (Full Screen)
- Three.js Canvas: particle fog field
- 3D TextGeometry "Data" — extrude depth 0.3, MeshStandardMaterial (roughness 0.4, metalness 0.1)
- Entrance: Y-rotation 75°→0° via GSAP spring (stiffness 100, damping 20, overshoot to -3°)
- Scroll exit: rotation reverses, opacity drops, vertex displacement for "dissolve" effect
- Name "王佳伟", roles "Data Engineer / AI Agent Developer"
- 3 CTAs: View Projects (filled), Download Resume (outline), Contact Me (text)
- Scroll-down indicator with animated chevron

### 5.2 About Me
- Personal intro paragraph (merged from PRD + PDF resume)
- Tech stack displayed as dynamic cards (Python, SQL, Hive, Spark, Flink CDC, Kafka, PostgreSQL, FastAPI, LangChain, LangGraph)
- Education: 西安石油大学, Data Science & Big Data, 2023-2027
- Work: 神州医疗科技股份有限公司, 2026.02-2026.06

### 5.3 Projects (×3)
Each project as an expandable card with:
- **Project 1:** 医疗数据平台建设 — Oracle→Flink CDC→Kafka→Hive→ADS pipeline, dynamic architecture diagram
- **Project 2:** OCR智能文档识别平台 — Image→OCR→JSON→Parser→Database flow diagram
- **Project 3:** Hermes Multi-Agent协同办公平台 — user management, project management, group collaboration, Agent collaboration modules, tech architecture diagram

### 5.4 AI Lab
Interactive demo cards:
- SQL Agent — natural language to SQL
- Resume Agent — JD matching analysis
- OCR Agent — image recognition + document parsing

### 5.5 Blog
Category-filtered article list:
- Data Engineering, Flink CDC, PostgreSQL, Python, AI Agent
- Example articles from PRD

### 5.6 Data Dashboard
ECharts-powered live stats:
- Project count, blog posts, GitHub commits, Agent usage count
- GitHub contribution chart
- Website visit counter

### 5.7 Contact
- GitHub, Email, LinkedIn, WeChat QR code
- Modern card design with subtle hover effects

## 6. Extensibility Design

The site is designed with a **data-driven architecture** — all content lives in `lib/constants.ts`. To add new content, you only edit one file. No component code changes needed.

### Adding a New Project
Add an entry to the `PROJECTS` array in `lib/constants.ts`:
```ts
{ id: "new-project", title: "...", subtitle: "...", ... }
```
It automatically appears in the Projects section. No other changes needed.

### Adding a New Blog Post
Add an entry to `BLOG_POSTS` array. Category filter auto-updates.

### Adding a New Skill
Add to `SKILLS` array with a `category`. The About section auto-groups.

### Adding a New Section
1. Create component in `app/components/NewSection.tsx`
2. Add an `id` for scroll targeting
3. Import and add to `app/page.tsx`
4. Add to `SECTIONS` array in `SideIndicator.tsx`
5. Add to `NAV_ITEMS` in `lib/constants.ts`

### Content Update Workflow
```
Edit lib/constants.ts → Save → Site auto-updates (HMR)
```

No CMS, no database. Git-tracked content. Easy to maintain and deploy.

## 7. Project Structure

```
wjw-portfolio/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main single-page (all sections composed)
│   ├── globals.css         # Tailwind + custom CSS variables
│   └── components/
│       ├── Hero.tsx               # 3D title + particles
│       ├── HeroCanvas.tsx         # Three.js React Three Fiber canvas
│       ├── Navbar.tsx             # Glass-morphism top nav
│       ├── SideIndicator.tsx       # Right-side scroll dots
│       ├── About.tsx              # About section
│       ├── TechCard.tsx           # Animated skill card
│       ├── ProjectCard.tsx        # Expandable project card
│       ├── ArchitectureDiagram.tsx # Animated data flow diagram
│       ├── AILab.tsx              # AI tools section
│       ├── AgentCard.tsx          # Individual AI agent demo card
│       ├── Blog.tsx               # Blog section
│       ├── DataDashboard.tsx      # ECharts dashboard
│       ├── Contact.tsx            # Contact section
│       └── Footer.tsx             # Footer
├── lib/
│   ├── constants.ts        # Site content, personal info, projects data
│   └── utils.ts            # Helper functions
├── public/
│   ├── resume.pdf          # Downloadable resume
│   └── images/             # Static images
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## 7. Key Implementation Notes

- All 11 sections as React Server Components where possible; client components only for interactivity/animation
- Three.js canvas isolated to Hero to avoid performance issues
- GSAP ScrollTrigger for scroll-driven animations
- Framer Motion for layout animations, hover effects, stagger lists
- ECharts lazy-loaded in Data Dashboard
- SEO: metadata in layout.tsx, semantic HTML, heading hierarchy
- Responsive: mobile-first Tailwind breakpoints
- Content: merge wjw.docx PRD structure with PDF resume details (work experience, education, specific skills)
- Download Resume CTA links to resume PDF in public/
