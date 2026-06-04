import { Project, Skill, BlogPost, AgentTool, NavItem } from "./types";

export const SITE = {
  name: "王佳伟",
  nameEn: "Wang Jiawei",
  title: "Data Engineer / AI Agent Developer",
  heroWord: "Data",
  tagline: "构建企业级数据平台与智能 Agent 系统",
  email: "2924539178@qq.com",
  phone: "18692174538",
  github: "https://github.com/wjw200508wjw-spec",
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
  aboutIntro: `专注数据平台建设、数据仓库开发。
熟悉企业级数据平台架构设计、多源异构数据库同步、OCR文档处理以及多Agent协同系统构建。
目前重点关注 Data Engineering、AI Agent 及 RAG。`,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "关于", href: "#about" },
  { label: "项目", href: "#projects" },

  { label: "技能图谱", href: "#blog" },
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
  { name: "Spark", category: "bigdata", level: 50 },
  { name: "Flink CDC", category: "bigdata", level: 70 },
  { name: "Kafka", category: "bigdata", level: 40 },
  { name: "DataX", category: "sync", level: 80 },
  { name: "Kettle", category: "sync", level: 65 },
  { name: "DolphinScheduler", category: "platform", level: 80 },
  { name: "Dinky", category: "platform", level: 70 },
];

export const PROJECTS: Project[] = [
  {
    id: "medical-data-platform",
    title: "医疗数据平台建设",
    subtitle: "企业级多源异构数据同步与数仓建设",
    overview: "参与神州医疗与西京医院合作项目，负责医院多源异构数据同步、调度运维、电子病历解析及入库全链路建设。",
    description: "负责ODS层建设及数据同步链路搭建，涉及Oracle、PostgreSQL、MySQL等多种数据库。基于Dinky编写FlinkSQL，结合Flink CDC实现实时同步；编写CDR脚本完成ODS宽表向细粒度明细表拆分；编写并部署DataX同步脚本至DolphinScheduler实现批量任务自动化调度；参与6年全量历史数据重抽及Oracle中文字段乱码处理。",
    databases: ["Oracle", "PostgreSQL", "MySQL"],
    tools: ["Flink CDC", "Hive", "DataX", "DolphinScheduler", "Dinky"],
    outcomes: [
      "实现多源异构数据库实时同步与T+1增量抽取",
      "完成6年全量历史数据重抽方案落地",
      "解决Oracle中文字段抽取至PostgreSQL乱码问题",
      "CDR脚本实现ODS宽表向明细表拆分，支持多科室使用",
      "覆盖全量/增量抽取、目标端清洗、分表及非结构化处理全链路",
    ],
    flowSteps: [
      { label: "Oracle/MySQL", type: "source" },
      { label: "Flink CDC", type: "transform" },
      { label: "Kafka", type: "queue" },
      { label: "Hive ODS", type: "storage" },
      { label: "CDR 明细拆分", type: "transform" },
      { label: "ADS 应用层", type: "output" },
    ],
  },
  {
    id: "ocr-platform",
    title: "OCR智能文档识别平台",
    subtitle: "多模态图片文字识别与结构化解析",
    overview: "基于可视化工作流平台BISHENG搭建文件识别全链路，完成文件上传、文本提取、识别结果处理与结构化输出，实现非结构化病历图像的自动转化与入库。",
    description: "基于BISHENG平台搭建文件识别流程，使用Python编写预处理代码对.docx文件进行解析并按固定长度切分为chunks以提升模型处理稳定性；调用Qwen3-VL-8B进行图片文字识别，结合文件内容与分块文本完成多模态信息抽取；参与OCR返回结果的JSON解析，对识别结果进行字段提取、清洗与映射，最终完成结构化数据入库。",
    databases: ["PostgreSQL"],
    tools: ["Python", "Qwen3-VL-8B", "BISHENG", "OCR API"],
    outcomes: [
      "完成文件上传→文本提取→识别→结构化输出全链路设计",
      "Python预处理.docx分块提升长文本场景模型稳定性",
      "多模态信息抽取+二次代码拼接完整识别结果",
      "JSON解析字段提取、清洗与映射，支撑数据库入库",
    ],
    flowSteps: [
      { label: "文件上传", type: "source" },
      { label: "Python预处理", type: "transform" },
      { label: "Qwen3-VL 识别", type: "transform" },
      { label: "JSON解析", type: "transform" },
      { label: "结构化入库", type: "output" },
    ],
  },
  {
    id: "hermes-agent",
    title: "Hermes-Agent群聊功能完善",
    subtitle: "多AI员工群聊协同与分工讨论平台",
    overview: "用户可创建多个AI员工，并赋予他们不同职位，根据不同项目需求进行拉群，使AI员工可像真实员工一样在群里分工讨论。",
    description: "支持用户创建多个AI Agent并赋予产品经理、架构师、开发工程师、测试工程师、数据分析师等不同职位角色。根据项目需求自动拉群，AI员工在群内基于各自职位进行分工讨论、任务分配与协作推进。集成LangGraph多Agent编排、WebSocket实时通信、Redis消息缓存，实现群聊消息流转与任务状态同步。",
    databases: ["PostgreSQL", "Redis"],
    tools: ["LangGraph", "LangChain", "OpenAI API", "FastAPI", "WebSocket"],
    outcomes: [
      "支持创建多个AI员工并赋予差异化职位角色",
      "根据项目需求自动拉群，AI员工群内分工讨论",
      "模拟真实团队协作流程，提升项目管理效率",
      "WebSocket实时通信，群聊消息毫秒级同步",
    ],
    flowSteps: [
      { label: "用户创建AI员工", type: "source" },
      { label: "项目拉群", type: "transform" },
      { label: "LangGraph 编排", type: "transform" },
      { label: "群聊消息流转", type: "queue" },
      { label: "PostgreSQL", type: "storage" },
      { label: "WebSocket 实时推送", type: "output" },
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
  githubCommits: 2,
  githubRepos: 1,
};

// JS-side color constants for programmatic use (Three.js, inline styles, ECharts).
// Maps to CSS custom properties in globals.css:
//   COLORS.bg → --bg-deepest    COLORS.surface → --bg-surface
//   COLORS.elevated → --bg-elevated   COLORS.border → --border-muted
//   COLORS.accent → --accent
export const COLORS = {
  bg: "#000000",
  surface: "#0a0a0a",
  elevated: "#141414",
  border: "#262830",
  textSecondary: "#6b6e78",
  textMuted: "#9a9ea8",
  textPrimary: "#c8cbd4",
  textBright: "#e8eaf0",
  accent: "#7a8b6e",
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
