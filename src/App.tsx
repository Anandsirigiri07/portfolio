import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Layers,
  Settings,
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
  ExternalLink,
  GraduationCap,
  Briefcase,
  FileCheck,
  ShieldCheck,
  Compass,
  ArrowRight,
  Monitor,
  Lock
} from "lucide-react";
import { Achievement, Project, Certification, SkillProgress, TimelineMilestone, PortfolioData } from "./types";
import { INITIAL_PORTFOLIO_DATA } from "./data";

// Import custom sections
import LiveStats from "./components/LiveStats";
import RecruiterDashboard from "./components/RecruiterDashboard";
import TimelineSection from "./components/TimelineSection";
import AchievementManager from "./components/AchievementManager";
import ProjectList from "./components/ProjectList";
import ResumeBuilder from "./components/ResumeBuilder";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Load state from localStorage if available, else fallback to initial data
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const cached = localStorage.getItem("sirigiri_portfolio_data");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse cached portfolio data", e);
      }
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  // Profile picture base64 state
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem("sirigiri_profile_image") || null;
  });

  // Active visual theme state
  const [theme, setTheme] = useState<"cybernetic" | "obsidian" | "glacier" | "emerald" | "amethyst">(() => {
    return (localStorage.getItem("sirigiri_active_theme") as any) || "cybernetic";
  });

  const handleUpdateTheme = (newTheme: "cybernetic" | "obsidian" | "glacier" | "emerald" | "amethyst") => {
    setTheme(newTheme);
    localStorage.setItem("sirigiri_active_theme", newTheme);
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "journey" | "projects" | "achievements" | "resume" | "admin">("dashboard");

  // Admin authentication states
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem("sirigiri_admin_token") || null;
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPasswordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        sessionStorage.setItem("sirigiri_admin_token", data.token);
        setAdminPasswordInput("");
      } else {
        setLoginError(data.error || "Incorrect developer password.");
      }
    } catch (err: any) {
      setLoginError("Connection failed: " + err.message);
    }
  };

  // Save portfolio state to localStorage on update
  useEffect(() => {
    localStorage.setItem("sirigiri_portfolio_data", JSON.stringify(portfolioData));
  }, [portfolioData]);

  // Handle general update
  const handleUpdateData = (fields: Partial<PortfolioData>) => {
    setPortfolioData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // Handle profile image update
  const handleUploadProfileImage = (b64: string) => {
    setProfileImage(b64);
    localStorage.setItem("sirigiri_profile_image", b64);
  };

  // Administrative functions for achievements
  const handleAddAchievement = (ach: Omit<Achievement, "id" | "displayOrder" | "archived">) => {
    const newId = `ach-${Date.now()}`;
    const nextOrder = portfolioData.achievements.length > 0
      ? Math.max(...portfolioData.achievements.map((a) => a.displayOrder)) + 1
      : 1;

    const newAch: Achievement = {
      ...ach,
      id: newId,
      displayOrder: nextOrder,
      archived: false,
    };

    setPortfolioData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAch],
    }));
  };

  const handleUpdateAchievement = (id: string, updated: Partial<Achievement>) => {
    setPortfolioData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const handleDeleteAchievement = (id: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  const handleReorderAchievement = (id: string, direction: "up" | "down") => {
    const list = [...portfolioData.achievements].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      // Swap with previous
      const temp = list[index].displayOrder;
      list[index].displayOrder = list[index - 1].displayOrder;
      list[index - 1].displayOrder = temp;
    } else if (direction === "down" && index < list.length - 1) {
      // Swap with next
      const temp = list[index].displayOrder;
      list[index].displayOrder = list[index + 1].displayOrder;
      list[index + 1].displayOrder = temp;
    }

    setPortfolioData((prev) => ({
      ...prev,
      achievements: list,
    }));
  };

  // Administrative functions for certifications
  const handleAddCertification = (cert: Omit<Certification, "id">) => {
    const newCert: Certification = {
      ...cert,
      id: `cert-${Date.now()}`,
    };
    setPortfolioData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  };

  const handleDeleteCertification = (id: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // Administrative functions for projects
  const handleAddProject = (proj: Omit<Project, "id">) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
    };
    setPortfolioData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const handleDeleteProject = (id: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Administrative functions for skills
  const handleUpdateSkill = (id: string, progress: number, status: SkillProgress["status"]) => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level: progress, status } : s)),
    }));
  };

  return (
    <div className={`theme-${theme} min-h-screen bg-brand-bg-page text-slate-200 flex flex-col justify-between font-sans border-t-4 border-brand-primary selection:bg-brand-primary/20 selection:text-brand-accent transition-all duration-300`}>
      {/* Cinematic Main Console Header */}
      <header className="h-auto md:h-24 border-b border-brand-border flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-0 bg-brand-bg-header gap-4" id="career-os-header">
        <div className="flex items-center gap-4 text-center md:text-left">
          {/* Base64 Avatar or Elegant Initials Fallback */}
          <div className="h-12 w-12 rounded-xl bg-[#09090b] border border-brand-border overflow-hidden shrink-0 shadow-[0_0_15px_var(--brand-accent-glow)] flex items-center justify-center transition-all duration-300">
            {profileImage ? (
              <img src={profileImage} alt={portfolioData.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-brand-accent font-bold font-mono text-sm">SAK</span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent uppercase transition-all duration-300">
              {portfolioData.name}
            </h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-slate-500 font-mono mt-0.5">
              CAREER OPERATING SYSTEM v1.2 • CSIT @ REVA UNIVERSITY • 4-YEAR JOURNAL
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Anand is Currently learning structure loops & OOP
            </span>
          </div>

          {/* Quick Theme Selection Widget */}
          <div className="flex bg-slate-950/80 border border-brand-border rounded-lg p-1 items-center gap-1.5" id="theme-selector-strip">
            {[
              { id: "cybernetic", label: "Cyan", color: "bg-cyan-500" },
              { id: "obsidian", label: "Amber", color: "bg-amber-500" },
              { id: "glacier", label: "Blue", color: "bg-blue-500" },
              { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
              { id: "amethyst", label: "Amethyst", color: "bg-violet-500" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleUpdateTheme(t.id as any)}
                className={`w-3.5 h-3.5 rounded-full ${t.color} relative cursor-pointer group flex items-center justify-center transition-transform hover:scale-110`}
                title={`${t.label} Theme`}
                id={`theme-btn-${t.id}`}
              >
                {theme === t.id && (
                  <span className="absolute w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-[8px] tracking-wider text-slate-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-border z-50">
                  {t.label.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveTab("admin")}
            className="p-2.5 rounded bg-[#09090b] hover:bg-slate-900 text-slate-400 hover:text-brand-accent transition-colors border border-brand-border flex items-center gap-2 text-[11px] font-mono cursor-pointer"
            id="control-center-trigger-btn"
          >
            <Settings className="h-3.5 w-3.5" /> COMMAND CENTER
          </button>
        </div>
      </header>

      {/* Main Console Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-9.5rem)] bg-brand-bg-page" id="career-os-grid">
        {/* Sidebar Panel containing user profile card and real-time statistics */}
        <section className="lg:col-span-3 bg-brand-bg-header/40 border-r border-brand-border p-6 space-y-6 flex flex-col justify-between" id="sidebar-panel">
          <div className="space-y-6">
            {/* Rapid Info Card */}
            <div className="p-4 bg-brand-bg-card border border-brand-border rounded-2xl relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 space-y-3">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-brand-text-accent px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded transition-all">
                    Undergraduate Student
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">{portfolioData.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{portfolioData.degree} in Computer Science & IT (CSIT)</p>
                </div>

                <div className="text-[11px] space-y-1.5 font-sans text-slate-400 border-t border-brand-border pt-3">
                  <div className="flex gap-2 items-center">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                    <span>REVA University</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span>Bangalore, Karnataka, IN</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">{portfolioData.email}</span>
                  </div>
                </div>

                {/* Technical Coordinates social touchpoints */}
                <div className="flex gap-2 pt-2 border-t border-brand-border">
                  <a
                    href={`https://github.com/${portfolioData.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded bg-[#09090b] hover:bg-slate-900 border border-brand-border flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={portfolioData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded bg-[#09090b] hover:bg-slate-900 border border-brand-border flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://leetcode.com/u/${portfolioData.leetcodeUsername}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded bg-[#09090b] hover:bg-slate-900 border border-brand-border flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer font-mono text-[10px]"
                    title="LeetCode Profile"
                  >
                    LC
                  </a>
                </div>
              </div>
            </div>

            {/* Simulated Live status weights */}
            <div className="p-4 bg-brand-bg-card border border-brand-border rounded-2xl transition-all duration-300">
              <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-widest block mb-3 font-mono">
                Academic Program Weight Map
              </span>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-400">
                    <span>Year 1 Completion</span>
                    <span>100%</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1 text-slate-400">
                    <span>Year 2 Placement Foundations</span>
                    <span>25%</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary w-1/4 transition-all"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2 bg-[#09090b] rounded border border-brand-border font-mono text-[9px] text-slate-500 leading-snug">
                Academic status: Year 2 Prep underway.
              </div>
            </div>
          </div>

          {/* Prompt War branding indicator */}
          <div className="pt-4 border-t border-brand-border text-[10px] text-slate-500 italic mt-auto leading-relaxed">
            "Sirigiri Anand Kumar's digital career operating system ensures absolute verifiability & persistent resume tracking across B.Tech."
          </div>
        </section>

        {/* Dashboard Canvas Core with responsive subviews and tab navigators */}
        <section className="lg:col-span-9 flex flex-col" id="dashboard-canvas-core">
          {/* Sub Navigation controls */}
          <nav className="h-12 border-b border-brand-border bg-brand-bg-header flex items-center justify-between px-6 overflow-x-auto whitespace-nowrap scrollbar-none font-mono" id="sub-navigator-bar">
            <div className="flex gap-4">
              {[
                { id: "dashboard", label: "Assessment Dashboard", icon: Compass },
                { id: "journey", label: "Timeline Roadmap", icon: Calendar },
                { id: "projects", label: "Interactive Projects", icon: BookOpen },
                { id: "achievements", label: "Verified achievements", icon: Award },
                { id: "resume", label: "Cv Generator Core", icon: FileCheck },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 h-12 text-xs font-bold uppercase transition-colors relative cursor-pointer ${
                      isSelected ? "text-brand-accent font-extrabold" : "text-slate-400 hover:text-slate-200"
                    }`}
                    id={`nav-tab-${tab.id}`}
                  >
                    <IconComp className="h-4 w-4 shrink-0" />
                    <span>{tab.label}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="nav-glow-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-accent to-brand-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Dynamic Content Panel area */}
          <div className="flex-1 p-6 overflow-y-auto bg-brand-bg-page/40" id="dynamic-content-scroller">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full space-y-8"
              >
                {activeTab === "dashboard" && (
                  <div className="space-y-8">
                    {/* Recruiter Assessment header summary */}
                    <RecruiterDashboard data={portfolioData} onNavigateToTab={(tab: any) => setActiveTab(tab)} />

                    {/* Integrated GitHub & LeetCode APIs live stats metrics */}
                    <LiveStats
                      githubUsername={portfolioData.githubUsername}
                      leetcodeUsername={portfolioData.leetcodeUsername}
                      hack2skillUsername={portfolioData.hack2skillUsername}
                      statsOverrides={portfolioData.statsOverrides}
                    />
                  </div>
                )}

                {activeTab === "journey" && (
                  <TimelineSection timeline={portfolioData.timeline} skills={portfolioData.skills} />
                )}

                {activeTab === "projects" && (
                  <ProjectList
                    projects={portfolioData.projects}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                  />
                )}

                {activeTab === "achievements" && (
                  <AchievementManager
                    achievements={portfolioData.achievements}
                    onAdd={handleAddAchievement}
                    onUpdate={handleUpdateAchievement}
                    onDelete={handleDeleteAchievement}
                    onReorder={handleReorderAchievement}
                  />
                )}

                {activeTab === "resume" && (
                  <ResumeBuilder data={portfolioData} />
                )}

                {activeTab === "admin" && (
                  !adminToken ? (
                    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono">
                      <div className="max-w-md w-full space-y-6 p-8 bg-[#09090b]/80 border border-brand-border rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="text-center">
                          <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 border border-brand-border flex items-center justify-center text-brand-accent mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            <Lock className="h-5 w-5" />
                          </div>
                          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Developer Auth Required</h2>
                          <p className="mt-2 text-[10px] text-slate-500 font-sans leading-normal">
                            Enter your developer password to unlock administrative access to the Career OS Command Center.
                          </p>
                        </div>
                        <form className="space-y-4" onSubmit={handleAdminLogin}>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase block mb-1">Developer Password</label>
                            <input
                              type="password"
                              required
                              value={adminPasswordInput}
                              onChange={(e) => setAdminPasswordInput(e.target.value)}
                              placeholder="••••••••••••"
                              className="appearance-none relative block w-full px-3 py-2 border border-brand-border placeholder-slate-650 text-slate-200 rounded bg-slate-900 focus:outline-none focus:border-brand-accent text-xs"
                              autoFocus
                            />
                          </div>

                          {loginError && (
                            <div className="text-[10px] text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded text-center leading-normal">
                              {loginError}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-[10px] font-bold rounded text-black bg-slate-100 hover:bg-white focus:outline-none uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Validate Credentials
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <AdminPanel
                      data={portfolioData}
                      adminToken={adminToken}
                      onUpdateData={handleUpdateData}
                      onAddCertification={handleAddCertification}
                      onDeleteCertification={handleDeleteCertification}
                      onUpdateSkill={handleUpdateSkill}
                      profileImage={profileImage}
                      onUploadProfileImage={handleUploadProfileImage}
                    />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Career OS Slate Footer */}
      <footer className="h-12 bg-[#050505] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between px-6 text-[9px] font-mono tracking-widest text-slate-500 gap-1 text-center sm:text-left py-2 sm:py-0">
        <div>DESIGNED FOR LONGEV-INTEGRITY (2025 - 2029 Academic span)</div>
        <div>LOC: REVA UNIVERSITY, BANGALORE IND • 13.1118° N, 77.6349° E</div>
        <div>PORTFOLIO-OS v1.20</div>
      </footer>

    </div>
  );
}
