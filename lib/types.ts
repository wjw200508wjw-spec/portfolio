export interface FlowStep { label: string; type: string }
export interface Project {
  id: string; title: string; category: string; subtitle: string;
  overview: string; description: string; tools: string[];
  outcomes: string[]; flowSteps: FlowStep[]; metric: string;
  period: string; role: string; context: string;
}
export interface Experience { company: string; role: string; period: string; industry: string; highlights: string[] }
export interface SkillGroup { title: string; label: string; description: string; tools: string[] }
export interface PracticeNote { id: string; title: string; category: string; summary: string; paragraphs: string[] }
export interface NavItem { label: string; href: string }
export interface GitHubStats { publicRepos: number; totalCommits: number | null; totalStars: number; fetchedAt: string; partial: boolean }
