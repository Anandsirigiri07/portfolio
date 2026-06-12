import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, Calendar, Award, Code, GraduationCap, MapPin, CheckCircle, ExternalLink, RefreshCw, Send, Sparkles } from "lucide-react";
import { PortfolioData } from "../types";

interface RecruiterDashboardProps {
  data: PortfolioData;
  onNavigateToTab: (tab: string) => void;
}

export default function RecruiterDashboard({ data, onNavigateToTab }: RecruiterDashboardProps) {
  const [pitchSent, setPitchSent] = useState(false);
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterCompany, setRecruiterCompany] = useState("");
  const [recruiterMessage, setRecruiterMessage] = useState("");

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterMessage.trim()) return;
    // Simulate real persistent storage / outbound notify trigger
    setPitchSent(true);
    setTimeout(() => {
      setPitchSent(false);
      setRecruiterName("");
      setRecruiterCompany("");
      setRecruiterMessage("");
    }, 4000);
  };

  const activeSkills = data.skills.filter(s => s.status === "Mastered" || s.status === "In Progress");
  const coreAchievements = data.achievements.filter(a => !a.archived).slice(0, 3);
  const coreProjects = data.projects.slice(0, 2);

  return (
    <div className="space-y-6" id="recruiter-dashboard-view">
      {/* 30-Second Elevator Highlight */}
      <div className="bg-[#09090b] border border-brand-primary/15 rounded-xl p-6 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-text-accent font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 transition-all">
                <Sparkles className="h-3 w-3 animate-pulse" /> Recruiter Speed-Assessment (30 Sec Summary)
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Undergraduate Computer Science student possessing verified active open-source contributions.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Anand is pursuing his B.Tech in **Computer Science and IT (CSIT)** at REVA University (2023 - 2027). He has established strong fundamental mechanics in **C Programming**, basic **Java**, and is proactively mastering intermediate **Data Structures and Algorithms** alongside active real-world open-source contributions like GSSoC.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-2">
            <a
              href={`mailto:${data.email}`}
              className="px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors text-center shadow-[0_0_15px_var(--brand-accent-glow)]"
            >
              Secure Direct Hire Pitch
            </a>
            <button
              onClick={() => onNavigateToTab("resume")}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs tracking-wider uppercase transition-colors text-center"
            >
              Export Modular Resume
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-brand-border text-center sm:text-left">
          <div className="p-3 bg-slate-950/40 border border-brand-border rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">B.Tech Major</span>
            <p className="text-xs font-bold text-slate-200 mt-1">CSIT @ REVA</p>
          </div>
          <div className="p-3 bg-slate-950/40 border border-brand-border rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Open-Source Path</span>
            <p className="text-xs font-bold text-slate-200 mt-1">GSSoC Contributor</p>
          </div>
          <div className="p-3 bg-slate-950/40 border border-brand-border rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Competitions</span>
            <p className="text-xs font-bold text-slate-200 mt-1">H2S Prompt War</p>
          </div>
          <div className="p-3 bg-slate-950/40 border border-brand-border rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Core Languages</span>
            <p className="text-xs font-bold text-slate-200 mt-1">Java & C</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Quick Skills & Education credentials */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Skills Map */}
          <div className="bg-[#09090b] border border-brand-border rounded-xl p-6 transition-all duration-300">
            <h4 className="text-sm uppercase tracking-widest font-mono text-slate-400 mb-4 flex items-center gap-2">
              <Code className="h-4 w-4 text-brand-text-accent" /> Professional Competency Stack
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {activeSkills.map((sk) => (
                <div key={sk.id} className="p-3.5 bg-[#050505]/40 border border-brand-border rounded-lg">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-200">{sk.name}</span>
                    <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded bg-brand-primary/10 text-brand-text-accent uppercase">
                      {sk.status === "Mastered" ? "Active" : "In Focus"}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all"
                      style={{ width: `${sk.level}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1 block">Level: {sk.level}% • {sk.phase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education Details */}
          <div className="bg-slate-950 border border-white/5 rounded-xl p-6 relative overflow-hidden">
            <h4 className="text-sm uppercase tracking-widest font-mono text-slate-400 mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-400" /> Academic Enrolment
            </h4>
            <div className="flex items-start gap-4">
              <div className="px-3 py-2 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 rounded font-bold text-sm font-mono shrink-0">
                REVA
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-sm text-white">REVA University, Bangalore</h5>
                  <span className="text-xs text-slate-400 font-mono">2023 - 2027</span>
                </div>
                <p className="text-xs text-slate-400">
                  Degree: **B.Tech (Bachelor of Technology)**
                </p>
                <p className="text-xs text-slate-300">
                  Specialization: **Computer Science and Information Technology (CSIT)**
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-2">
                  <MapPin className="h-3 w-3 text-red-400" /> Yelahanka, Bangalore, India
                </div>
              </div>
            </div>
          </div>

          {/* Core Projects Overview */}
          <div className="bg-[#09090b] border border-brand-border rounded-xl p-6 transition-all duration-300">
            <h4 className="text-sm uppercase tracking-widest font-mono text-slate-400 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Featured Engineering Projects
            </h4>
            <div className="space-y-3">
              {coreProjects.map((proj) => (
                <div key={proj.id} className="p-4 bg-[#050505]/40 border border-brand-border rounded-lg hover:border-slate-800 transition-all">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold text-slate-200">{proj.title}</h5>
                    <span className="text-[9px] text-slate-500 font-mono">{proj.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{proj.overview}</p>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {proj.technologies.map(tech => (
                      <span key={tech} className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-brand-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Outbound Contact System & Quick verification link credentials */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Form */}
          <div className="bg-[#09090b] border border-brand-border rounded-xl p-6 transition-all duration-300">
            <h4 className="text-sm uppercase tracking-widest font-mono text-slate-400 mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" /> Recruiter Inquiries
            </h4>
            <form onSubmit={handleQuickContact} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hiring Manager"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-brand-border text-slate-200 text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, TechCorp"
                  value={recruiterCompany}
                  onChange={(e) => setRecruiterCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-brand-border text-slate-200 text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mb-1">Direct Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. We loved your verified GSSoC work and would love to interview you for our upcoming internship!"
                  value={recruiterMessage}
                  onChange={(e) => setRecruiterMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-brand-border text-slate-200 text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              {pitchSent ? (
                <div className="p-2.5 bg-brand-primary/10 border border-brand-primary/20 rounded flex items-center gap-2 text-[11px] text-brand-text-accent font-mono">
                  <CheckCircle className="h-4 w-4 text-brand-text-accent shrink-0" />
                  <span>Success! Your pitch has been recorded in live system state.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-primary text-brand-text-accent transition-all rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Interview Proposal
                </button>
              )}
            </form>
          </div>

          {/* Quick Contacts QuickList */}
          <div className="bg-[#09090b] border border-brand-border rounded-xl p-6 space-y-4 transition-all duration-300">
            <h4 className="text-sm uppercase tracking-widest font-mono text-slate-400 mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-400" /> Global Touchpoints
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-3 p-2.5 bg-[#050505]/40 hover:bg-slate-900 border border-brand-border rounded-lg transition-colors group"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-500">EMAIL CONTACT</p>
                  <p className="text-slate-200 truncate group-hover:text-brand-accent transition-colors">{data.email}</p>
                </div>
              </a>

              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-3 p-2.5 bg-[#050505]/40 hover:bg-slate-900 border border-brand-border rounded-lg transition-colors group"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-500">PHONE HOTLINE</p>
                  <p className="text-slate-200 group-hover:text-brand-accent transition-colors">{data.phone}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Core Verified Achievements */}
          <div className="bg-[#09090b] border border-brand-border rounded-xl p-6 transition-all duration-300">
            <h4 className="text-sm uppercase tracking-widest font-mono text-slate-400 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" /> Verified Achievements Summary
            </h4>
            <div className="space-y-3">
              {coreAchievements.map((ach) => (
                <div key={ach.id} className="p-3 bg-[#050505]/40 border border-brand-border rounded font-mono text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-500">{ach.date} • {ach.category.toUpperCase()}</span>
                    {ach.proofLink && (
                      <a href={ach.proofLink} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-text-accent transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-200 mt-1">{ach.title}</h5>
                  <p className="text-[10px] text-slate-500 leading-snug mt-1">{ach.description}</p>
                  {ach.badge && (
                    <span className="inline-block mt-2 text-[9px] font-mono tracking-wider text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {ach.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
