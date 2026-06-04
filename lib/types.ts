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
