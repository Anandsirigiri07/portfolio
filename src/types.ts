export interface Achievement {
  id: string;
  date: string;
  title: string;
  description: string;
  proofLink?: string;
  badge?: string;
  category: "Academics" | "Open Source" | "Hackathons" | "Competitions" | "Certifications" | "Leadership" | "Community";
  archived: boolean;
  displayOrder: number;
}

export interface Project {
  id: string;
  title: string;
  overview: string;
  problemStatement: string;
  solution: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
  learningOutcomes: string;
  date: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  proofLink?: string;
}

export interface SkillProgress {
  id: string;
  name: string;
  level: number; // 0 to 100
  phase: "C Programming" | "Java Basics" | "OOP" | "DSA" | "Web Dev" | "Advanced Tech";
  status: "Mastered" | "In Progress" | "Planned";
}

export interface TimelineMilestone {
  id: string;
  year: "Year 1" | "Year 2" | "Year 3" | "Year 4";
  title: string;
  status: "Completed" | "Current" | "Future";
  description: string;
  date: string;
  items: string[];
}

export interface StatsOverrides {
  githubRepos?: number;
  githubFollowers?: number;
  githubStars?: number;
  leetcodeSolved?: number;
  leetcodeRanking?: number;
  hack2skillRank?: number;
  hack2skillScore?: number;
  hack2skillPrompts?: number;
}

export interface PortfolioData {
  name: string;
  university: string;
  degree: string;
  branch: string;
  bio: string;
  email: string;
  phone: string;
  githubUsername: string;
  linkedinUrl: string;
  leetcodeUsername: string;
  hack2skillUsername?: string;
  statsOverrides?: StatsOverrides;
  achievements: Achievement[];
  projects: Project[];
  certifications: Certification[];
  skills: SkillProgress[];
  timeline: TimelineMilestone[];
}
