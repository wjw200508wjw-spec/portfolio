import type { Project, Experience, SkillGroup, PracticeNote, NavItem } from "./types";

export const SITE = {
  "name": "王佳伟",
  "nameEn": "Wang Jiawei",
  "title": "Data Engineer & AI Developer",
  "tagline": "让数据流动，让业务更轻松。",
  "email": "2924539178@qq.com",
  "phone": "18692174538",
  "github": "https://github.com/wjw200508wjw-spec",
  "url": "https://www.vpymhk.cn",
  "resume": "/resume.pdf?v=20261009",
  "updated": "2026.10",
  "education": {
    "school": "西安石油大学",
    "degree": "本科",
    "major": "数据科学与大数据技术",
    "period": "2023 — 2027"
  },
  "aboutIntro": "我是王佳伟，数据科学与大数据技术专业本科生。围绕医疗与航空维修场景，参与数据集成、数据治理与湖仓方案建设，也用 Python 和 AI 辅助开发，把重复的业务工作变成好用的工具。"
};

export const EXPERIENCES: Experience[] = [
  {
    "company": "西安东航赛峰起落架系统维修有限公司",
    "role": "数据管理",
    "period": "2026.06 — 2026.10",
    "industry": "航空维修",
    "highlights": [
      "梳理 ERP、BPM、Excel 与非结构化文件的数据资产，整理核心字段、维护频率、业务用途、责任人和上下游依赖。",
      "从报表字段与业务规则反向定位源表、关联键和加工逻辑，设计数仓分层方案。",
      "主导湖仓 POC 的技术选型与方案设计，结合 SQL Server 数据源和本地运维条件，沉淀组件依赖、部署、恢复与排障文档。",
      "使用 AI 辅助开发 Python 报价工具，将单次报价时间由约 2 小时缩短至约半小时。",
      "开发工厂与改善项目可视化、Excel 交互分析网页，支持业务人员自主查看与展示数据。"
    ]
  },
  {
    "company": "神州医疗科技股份有限公司",
    "role": "数据治理",
    "period": "2026.02 — 2026.06",
    "industry": "医疗数据",
    "highlights": [
      "开发和维护 Oracle 至 PostgreSQL 的电子病历全量与增量抽取逻辑，调整患者、就诊与病历数据的关联范围。",
      "使用 DataX 完成字段映射、类型适配与同步配置，接入 DolphinScheduler 定时执行。",
      "排查中文乱码、抽取名单不完整和映射异常，开展修复、补跑与源目标结果核验。",
      "基于 Dinky 编写 FlinkSQL，参与 Flink CDC 实时同步链路配置与数据变更验证。",
      "调用 OCR 平台 API 识别手写病历，解析 JSON 结果，完成字段清洗、映射与结构化入库。"
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    "id": "quote-automation",
    "title": "AI 辅助报价自动化",
    "category": "业务自动化",
    "subtitle": "从两小时，到半小时。",
    "overview": "把多客户报价规则、价格匹配与照片整理，收进一套 Python 自动化流程。",
    "description": "结合航空维修业务规则，使用 AI 辅助开发将多客户报价规则转化为 Python 程序。完成数据筛选与价格匹配，输出多 Sheet 报价表，并关联报废件照片，让重复的数据准备工作更高效。",
    "tools": [
      "Python",
      "Excel",
      "AI 辅助开发"
    ],
    "outcomes": [
      "单次报价时间由约 2 小时缩短至约半小时。",
      "统一数据筛选、价格匹配与多 Sheet 文件生成流程。",
      "自动匹配报废件照片，减少人工文件整理。"
    ],
    "flowSteps": [
      {
        "label": "业务数据",
        "type": "transform"
      },
      {
        "label": "规则筛选",
        "type": "transform"
      },
      {
        "label": "价格匹配",
        "type": "transform"
      },
      {
        "label": "多 Sheet 报价",
        "type": "transform"
      },
      {
        "label": "照片匹配",
        "type": "transform"
      }
    ],
    "metric": "约 75% 时间节省",
    "period": "2026.06 — 2026.10",
    "role": "业务规则转化 / 工具开发",
    "context": "航空维修实践"
  },
  {
    "id": "lakehouse-poc",
    "title": "企业湖仓 POC 与数据治理",
    "category": "数据工程",
    "subtitle": "先理清业务，再搭建数据底座。",
    "overview": "梳理数据资产与业务链路，结合本地部署要求设计湖仓验证方案。",
    "description": "围绕 ERP、BPM、Excel 和非结构化文件，整理数据来源、核心字段、维护频率、业务用途与责任归属。从报表需求反向拆解源表、关联键与加工规则，并结合 SQL Server 数据源、本地部署及运维条件完成湖仓 POC 选型与方案设计。",
    "tools": [
      "SQL Server",
      "SQL",
      "Linux",
      "数据建模",
      "湖仓 POC"
    ],
    "outcomes": [
      "沉淀数据资产、字段口径与上下游依赖。",
      "设计面向业务报表的数仓分层方案。",
      "整理组件版本、连接器、JDBC 依赖和配置步骤。",
      "记录服务器重启后的恢复流程与排障方法。"
    ],
    "flowSteps": [
      {
        "label": "ERP / BPM / Excel",
        "type": "transform"
      },
      {
        "label": "资产与口径梳理",
        "type": "transform"
      },
      {
        "label": "数仓分层设计",
        "type": "transform"
      },
      {
        "label": "湖仓 POC",
        "type": "transform"
      },
      {
        "label": "部署与恢复文档",
        "type": "transform"
      }
    ],
    "metric": "业务 → 数据 → 平台",
    "period": "2026.06 — 2026.10",
    "role": "数据治理 / 主导 POC 方案",
    "context": "航空维修实践"
  },
  {
    "id": "medical-data-platform",
    "title": "医疗数据集成与治理",
    "category": "数据工程",
    "subtitle": "让异构数据，可靠地汇合。",
    "overview": "Oracle 到 PostgreSQL 的病历抽取、同步调度、质量排查与结构化入库。",
    "description": "在神州医疗数据治理工作中，开发和维护电子病历全量与增量抽取任务，按业务要求调整患者、就诊与病历关联范围。使用 DataX 完成字段映射和类型适配，接入 DolphinScheduler 调度；基于 Dinky 与 Flink CDC 参与实时同步配置和验证，处理中文乱码、名单不完整及字段映射异常。",
    "tools": [
      "Oracle",
      "PostgreSQL",
      "DataX",
      "DolphinScheduler",
      "Flink CDC",
      "Dinky"
    ],
    "outcomes": [
      "覆盖全量与增量抽取、定时调度、修复补跑和结果核验。",
      "定位并处理编码、字段映射与抽取范围问题。",
      "验证数据库日志增量采集与数据变更同步。",
      "使用 SQL 清洗字段类型、空值、异常值与业务字段。"
    ],
    "flowSteps": [
      {
        "label": "Oracle",
        "type": "transform"
      },
      {
        "label": "DataX / Flink CDC",
        "type": "transform"
      },
      {
        "label": "调度与质量核验",
        "type": "transform"
      },
      {
        "label": "PostgreSQL",
        "type": "transform"
      },
      {
        "label": "业务数据",
        "type": "transform"
      }
    ],
    "metric": "全量 + 增量链路",
    "period": "2026.02 — 2026.06",
    "role": "抽取开发 / 同步运维 / 数据核验",
    "context": "医疗数据实践"
  },
  {
    "id": "ocr-platform",
    "title": "多模态文档识别工作流",
    "category": "AI 应用",
    "subtitle": "从图片与文档，到结构化数据。",
    "overview": "通过 BISHENG、Qwen3-VL 与 Python，串起文档解析和识别结果处理。",
    "description": "作为项目主要负责人，基于 BISHENG 搭建文件上传、文本解析、模型识别、结果处理与结构化输出工作流。使用 Python 解析 .docx 并按固定长度切分 Chunks，调用 Qwen3-VL-8B 进行图片文字识别与信息抽取，再对多次模型返回内容进行拼接、字段提取和格式整理。",
    "tools": [
      "BISHENG",
      "Qwen3-VL-8B",
      "Python",
      "OCR",
      "JSON"
    ],
    "outcomes": [
      "完成上传、解析、识别到结构化输出的完整链路设计。",
      "通过文档分块降低长文本输入的上下文与稳定性问题。",
      "结合图片与文本分块进行多模态信息处理。",
      "为 OCR、非结构化文档处理和入库提供技术验证。"
    ],
    "flowSteps": [
      {
        "label": "文件上传",
        "type": "transform"
      },
      {
        "label": "Python 分块",
        "type": "transform"
      },
      {
        "label": "Qwen3-VL 识别",
        "type": "transform"
      },
      {
        "label": "结果拼接与清洗",
        "type": "transform"
      },
      {
        "label": "结构化输出",
        "type": "transform"
      }
    ],
    "metric": "多模态 → 结构化",
    "period": "2026.03 — 2026.04",
    "role": "主要负责人",
    "context": "项目实践"
  },
  {
    "id": "factory-visualization",
    "title": "工厂与改善项目可视化",
    "category": "业务自动化",
    "subtitle": "让项目进展，在空间里看得见。",
    "overview": "把工厂区域、改善任务、团队信息与项目文档关联起来。",
    "description": "结合 AI 辅助开发，构建工厂区域与改善项目展示工具，支持区域任务关联、项目详情查看、团队信息维护及 PDF 导入展示。围绕日常展示需要，持续优化页面布局、交互和文字自适应。",
    "tools": [
      "HTML",
      "JavaScript",
      "PDF",
      "AI 辅助开发"
    ],
    "outcomes": [
      "将区域与改善任务关联，便于按空间查看项目。",
      "支持项目详情、团队信息与 PDF 文档展示。",
      "持续调整页面布局与文字自适应。"
    ],
    "flowSteps": [
      {
        "label": "工厂区域",
        "type": "transform"
      },
      {
        "label": "任务关联",
        "type": "transform"
      },
      {
        "label": "项目详情",
        "type": "transform"
      },
      {
        "label": "团队 / PDF 展示",
        "type": "transform"
      }
    ],
    "metric": "空间 × 项目 × 团队",
    "period": "2026.06 — 2026.10",
    "role": "需求转化 / 页面开发",
    "context": "航空维修实践"
  },
  {
    "id": "interactive-analysis",
    "title": "Excel 交互式分析工具",
    "category": "业务自动化",
    "subtitle": "让业务人员，自己探索数据。",
    "overview": "从表格上传到多条件筛选、图表联动与明细查看。",
    "description": "根据业务需求，使用 AI 辅助开发 Excel 数据上传与图表分析网页。实现多条件筛选、横轴维度切换、图表联动和明细查看，将常用分析操作放到业务人员可以自主使用的页面中。",
    "tools": [
      "Excel",
      "HTML",
      "JavaScript",
      "数据可视化"
    ],
    "outcomes": [
      "支持上传 Excel 数据后自主筛选和展示。",
      "支持横轴维度切换与多个图表联动。",
      "通过明细查看连接汇总图表与原始记录。"
    ],
    "flowSteps": [
      {
        "label": "Excel 上传",
        "type": "transform"
      },
      {
        "label": "多条件筛选",
        "type": "transform"
      },
      {
        "label": "维度切换",
        "type": "transform"
      },
      {
        "label": "图表联动",
        "type": "transform"
      },
      {
        "label": "明细查看",
        "type": "transform"
      }
    ],
    "metric": "上传 → 筛选 → 洞察",
    "period": "2026.06 — 2026.10",
    "role": "业务需求分析 / 交互开发",
    "context": "航空维修实践"
  },
  {
    "id": "hermes-agent",
    "title": "Hermes-Agent 群聊协作",
    "category": "AI 应用",
    "subtitle": "探索多个 AI 角色的协同。",
    "overview": "延续原作品集中的 AI 员工群聊方向，探索角色分工与协作流程。",
    "description": "围绕不同职位的 AI 员工群聊开展个人探索，关注角色配置、按项目组织讨论、任务分工与消息同步。这里保留原作品集的探索方向，作为后续 AI Agent 与 RAG 实践的延伸。",
    "tools": [
      "LangGraph",
      "LangChain",
      "FastAPI",
      "WebSocket"
    ],
    "outcomes": [
      "探索产品、开发和测试等不同 Agent 角色的分工。",
      "关注群聊消息流转与任务状态同步。",
      "持续研究 AI Agent 编排与业务工具连接。"
    ],
    "flowSteps": [
      {
        "label": "角色配置",
        "type": "transform"
      },
      {
        "label": "项目群聊",
        "type": "transform"
      },
      {
        "label": "Agent 编排",
        "type": "transform"
      },
      {
        "label": "任务与消息同步",
        "type": "transform"
      }
    ],
    "metric": "个人探索",
    "period": "持续探索",
    "role": "个人项目",
    "context": "原作品集项目"
  }
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    "title": "SQL 与异构数据库",
    "label": "01 / DATA QUERY",
    "description": "多表关联、窗口函数、CTE、条件聚合；从抽取和转换到源目标核验。",
    "tools": [
      "SQL",
      "Oracle",
      "PostgreSQL",
      "SQL Server",
      "MySQL"
    ]
  },
  {
    "title": "集成与任务调度",
    "label": "02 / DATA PIPELINE",
    "description": "字段映射、类型适配、批量同步、调度运维与实时变更验证。",
    "tools": [
      "DataX",
      "DolphinScheduler",
      "Kettle",
      "Flink CDC",
      "Dinky"
    ]
  },
  {
    "title": "数据治理与建模",
    "label": "03 / DATA GOVERNANCE",
    "description": "资产盘点、数据字典、字段标准、业务口径、血缘与责任归属；按业务需求拆解分层模型。",
    "tools": [
      "数据资产",
      "数仓分层",
      "事实与维度",
      "数据粒度",
      "数据质量"
    ]
  },
  {
    "title": "湖仓与部署",
    "label": "04 / DATA PLATFORM",
    "description": "结合业务和本地环境进行 POC 选型，整理组件依赖、部署配置、重启恢复与排障步骤。",
    "tools": [
      "湖仓架构",
      "SQL Server",
      "Linux",
      "POC",
      "部署文档"
    ]
  },
  {
    "title": "AI 与业务工具",
    "label": "05 / BUILD WITH AI",
    "description": "使用 AI 辅助完成需求拆解、代码迭代与问题排查，以业务规则约束工具输出。",
    "tools": [
      "Python",
      "HTML / JavaScript",
      "ChatGPT",
      "Codex",
      "Claude Code"
    ]
  },
  {
    "title": "多模态与 Agent",
    "label": "06 / AI EXPLORATION",
    "description": "文档分块、图片识别、JSON 解析与结构化输出；持续关注 Agent 协作与 RAG。",
    "tools": [
      "BISHENG",
      "Qwen3-VL",
      "OCR",
      "LangGraph",
      "RAG"
    ]
  }
];

export const PRACTICE_NOTES: PracticeNote[] = [
  {
    "id": "quality",
    "title": "同步完成之后，还要核验数据",
    "category": "数据质量",
    "summary": "把“任务成功”和“业务数据正确”分开验证。",
    "paragraphs": [
      "电子病历抽取需要先明确患者、就诊与病历的关联范围，再核对抽取名单和目标记录。单看调度任务状态，无法判断关联范围是否符合业务要求。",
      "结合字段映射、类型转换、空值与异常值清洗，逐步缩小中文乱码、名单不完整和字段适配异常的排查范围。修复与补跑后，再核验源目标结果。"
    ]
  },
  {
    "id": "poc",
    "title": "POC 也需要可维护的部署说明",
    "category": "平台建设",
    "summary": "技术选型之外，依赖、配置和重启恢复同样重要。",
    "paragraphs": [
      "湖仓 POC 的方案需要同时考虑本地部署要求、现有 SQL Server 数据源和团队运维条件。从报表需求回溯源表、关联键及加工逻辑，可以让验证围绕真实业务展开。",
      "将组件版本、连接器、JDBC 驱动、配置项与操作步骤记录下来，再补齐服务器重启后的恢复流程，帮助后续部署、排障和方案交接。"
    ]
  },
  {
    "id": "ai-tools",
    "title": "让 AI 辅助开发落到业务规则上",
    "category": "业务自动化",
    "summary": "从输入数据与规则开始，以可核对的输出结束。",
    "paragraphs": [
      "报价工具的工作从多客户规则开始：先整理筛选条件与价格匹配逻辑，再实现多 Sheet 报价表生成与报废件照片匹配。AI 辅助开发用于需求拆解、代码生成与迭代，业务规则决定程序应该做什么。",
      "交互式分析网页则把 Excel 上传、筛选、维度切换和明细查看连成一个使用流程，让业务人员可以自主展示数据。工具的价值体现在减少重复操作和缩短处理时间。"
    ]
  }
];

export const NAV_ITEMS: NavItem[] = [
  {
    "label": "关于",
    "href": "#about"
  },
  {
    "label": "经历",
    "href": "#experience"
  },
  {
    "label": "作品",
    "href": "#projects"
  },
  {
    "label": "技能",
    "href": "#skills"
  },
  {
    "label": "笔记",
    "href": "#blog"
  },
  {
    "label": "联系",
    "href": "#contact"
  }
];
