import { Project, Skill, BlogPost, AgentTool, NavItem } from "./types";

export const SITE = {
  name: "王佳伟",
  nameEn: "Wang Jiawei",
  title: "Data Engineer / AI Agent Developer",
  heroWord: "Data",
  tagline: "构建企业级数据平台与智能 Agent 系统",
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
  { label: "关于", href: "#about" },
  { label: "项目", href: "#projects" },
  { label: "AI实验室", href: "#ai-lab" },
  { label: "博客", href: "#blog" },
  { label: "数据面板", href: "#dashboard" },
  { label: "联系", href: "#contact" },
];

export const SKILLS: Skill[] = [
  { name: "Python", category: "language", level: 85 },
  { name: "SQL", category: "language", level: 90 },
  { name: "PostgreSQL", category: "database", level: 80 },
  { name: "Oracle", category: "database", level: 75 },
  { name: "MySQL", category: "database", level: 80 },
  { name: "SQL Server", category: "database", level: 70 },
  { name: "Kingbase", category: "database", level: 60 },
  { name: "Hive", category: "bigdata", level: 75 },
  { name: "Spark", category: "bigdata", level: 65 },
  { name: "Flink CDC", category: "bigdata", level: 80 },
  { name: "Kafka", category: "bigdata", level: 70 },
  { name: "DataX", category: "sync", level: 80 },
  { name: "Kettle", category: "sync", level: 65 },
  { name: "DolphinScheduler", category: "platform", level: 80 },
  { name: "Dinky", category: "platform", level: 70 },
  { name: "LangChain", category: "ai", level: 70 },
  { name: "LangGraph", category: "ai", level: 65 },
  { name: "OpenAI API", category: "ai", level: 75 },
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

// JS-side color constants for programmatic use (Three.js, inline styles, ECharts).
// Maps to CSS custom properties in globals.css:
//   COLORS.bg → --bg-deepest    COLORS.surface → --bg-surface
//   COLORS.elevated → --bg-elevated   COLORS.border → --border-muted
//   COLORS.accent → --accent
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

// ============================================================
// EXTENSIBILITY: Section Registry
// ============================================================
// To add a new section:
// 1. Add its id below
// 2. Create component in app/components/
// 3. Import & add to app/page.tsx
// 4. Add nav item to NAV_ITEMS above if needed

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
// EXTENSIBILITY GUIDE
// ============================================================
//
// ADD A PROJECT: Push to PROJECTS array. Follow Project interface.
// ADD A BLOG POST: Push to BLOG_POSTS array. Follow BlogPost interface.
// ADD A SKILL: Push to SKILLS array. Follow Skill interface.
// ADD AN AI TOOL: Push to AGENT_TOOLS array. Follow AgentTool interface.
// ADD A NAV ITEM: Push to NAV_ITEMS array.
// ADD A NEW SECTION:
//   1. Add id to SECTION_IDS
//   2. Create app/components/NewSection.tsx
//   3. Import in app/page.tsx, add <NewSection />
//   4. Add to NAV_ITEMS if needed
