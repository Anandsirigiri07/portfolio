import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings, Save, Upload, Plus, Trash, GraduationCap, Code, ShieldAlert, BadgeCheck, FileUp, Sparkles } from "lucide-react";
import { PortfolioData, Certification, SkillProgress, TimelineMilestone } from "../types";

interface AdminPanelProps {
  data: PortfolioData;
  adminToken: string | null;
  onUpdateData: (updated: Partial<PortfolioData>) => void;
  onAddCertification: (cert: Omit<Certification, "id">) => void;
  onDeleteCertification: (id: string) => void;
  onUpdateSkill: (id: string, progress: number, status: SkillProgress["status"]) => void;
  profileImage: string | null;
  onUploadProfileImage: (b64: string) => void;
}

export default function AdminPanel({
  data,
  adminToken,
  onUpdateData,
  onAddCertification,
  onDeleteCertification,
  onUpdateSkill,
  profileImage,
  onUploadProfileImage,
}: AdminPanelProps) {
  // Local form states
  const [name, setName] = useState(data.name);
  const [university, setUniversity] = useState(data.university);
  const [degree, setDegree] = useState(data.degree);
  const [branch, setBranch] = useState(data.branch);
  const [bio, setBio] = useState(data.bio);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [githubUsername, setGithubUsername] = useState(data.githubUsername);
  const [linkedinUrl, setLinkedinUrl] = useState(data.linkedinUrl);
  const [leetcodeUsername, setLeetcodeUsername] = useState(data.leetcodeUsername);
  const [hack2skillUsername, setHack2skillUsername] = useState(data.hack2skillUsername || "");

  // Overrides states
  const [ghReposOverride, setGhReposOverride] = useState(data.statsOverrides?.githubRepos?.toString() || "");
  const [ghFollowersOverride, setGhFollowersOverride] = useState(data.statsOverrides?.githubFollowers?.toString() || "");
  const [ghStarsOverride, setGhStarsOverride] = useState(data.statsOverrides?.githubStars?.toString() || "");
  const [lcSolvedOverride, setLcSolvedOverride] = useState(data.statsOverrides?.leetcodeSolved?.toString() || "");
  const [lcRankingOverride, setLcRankingOverride] = useState(data.statsOverrides?.leetcodeRanking?.toString() || "");
  const [h2sScoreOverride, setH2sScoreOverride] = useState(data.statsOverrides?.hack2skillScore?.toString() || "");
  const [h2sRankOverride, setH2sRankOverride] = useState(data.statsOverrides?.hack2skillRank?.toString() || "");
  const [h2sPromptsOverride, setH2sPromptsOverride] = useState(data.statsOverrides?.hack2skillPrompts?.toString() || "");

  // Timeline state
  const [localTimeline, setLocalTimeline] = useState<TimelineMilestone[]>(data.timeline);

  // New certification Form state
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certProof, setCertProof] = useState("");

  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      name,
      university,
      degree,
      branch,
      bio,
      email,
      phone,
      githubUsername,
      linkedinUrl,
      leetcodeUsername,
      hack2skillUsername,
    });
    setSavingStatus("General profile updated successfully!");
    setTimeout(() => setSavingStatus(null), 3500);
  };

  const handleSaveOverrides = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      statsOverrides: {
        githubRepos: ghReposOverride ? Number(ghReposOverride) : undefined,
        githubFollowers: ghFollowersOverride ? Number(ghFollowersOverride) : undefined,
        githubStars: ghStarsOverride ? Number(ghStarsOverride) : undefined,
        leetcodeSolved: lcSolvedOverride ? Number(lcSolvedOverride) : undefined,
        leetcodeRanking: lcRankingOverride ? Number(lcRankingOverride) : undefined,
        hack2skillScore: h2sScoreOverride ? Number(h2sScoreOverride) : undefined,
        hack2skillRank: h2sRankOverride ? Number(h2sRankOverride) : undefined,
        hack2skillPrompts: h2sPromptsOverride ? Number(h2sPromptsOverride) : undefined,
      }
    });
    setSavingStatus("Live statistics overrides saved successfully!");
    setTimeout(() => setSavingStatus(null), 3500);
  };

  const handleSaveTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      timeline: localTimeline
    });
    setSavingStatus("Graduation roadmap timeline saved successfully!");
    setTimeout(() => setSavingStatus(null), 3500);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;

    onAddCertification({
      name: certName,
      issuer: certIssuer,
      date: certDate || "June 2024",
      proofLink: certProof || undefined,
    });

    setCertName("");
    setCertIssuer("");
    setCertDate("");
    setCertProof("");

    setSavingStatus("Certification credentials successfully appended!");
    setTimeout(() => setSavingStatus(null), 3000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an avatar smaller than 2MB to ensure robust browser storage performance.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onUploadProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 font-sans" id="portfolio-admin-panel">
      <div>
        <h4 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          Career OS Control Center
        </h4>
        <p className="text-xs text-slate-500 font-mono mt-1">
          Directly control global variables, skills sliders, resume payloads, and verified certification logs.
        </p>
      </div>

      {savingStatus && (
        <div className="p-3 bg-cyan-950/50 border border-cyan-800 text-cyan-300 text-xs rounded-xl flex items-center gap-2 font-mono" id="admin-notify-alert">
          <BadgeCheck className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
          <span>{savingStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: general student meta parameters */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6">
            <h5 className="text-sm uppercase font-mono tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-400" /> Student Profile Parameters
            </h5>

            <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">University / Institute</label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Degree Title</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Major Specialization Branch</label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Professional Introduction Biography</label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">GitHub Acc Name</label>
                  <input
                    type="text"
                    required
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">LinkedIn Profile Url</label>
                  <input
                    type="url"
                    required
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">LeetCode Acc Name</label>
                  <input
                    type="text"
                    required
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Hack2Skill Acc Name</label>
                  <input
                    type="text"
                    required
                    value={hack2skillUsername}
                    onChange={(e) => setHack2skillUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-white text-black font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  id="admin-save-btn"
                >
                  <Save className="h-4.5 w-4.5" /> SAVE GENERAL METRICS
                </button>
              </div>
            </form>
          </div>

          {/* Real-Time Stats Overrides */}
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6">
            <h5 className="text-sm uppercase font-mono tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-cyan-400" /> Real-Time Stats Overrides
            </h5>
            <p className="text-xs text-slate-500 font-sans mb-4">
              Specify custom credentials to display on the dashboard (overriding API failures or mock numbers).
            </p>

            <form onSubmit={handleSaveOverrides} className="space-y-4 text-xs font-mono">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-2 font-bold">GitHub Overrides</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Public Repos</label>
                    <input
                      type="number"
                      value={ghReposOverride}
                      placeholder="e.g. 14"
                      onChange={(e) => setGhReposOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Followers</label>
                    <input
                      type="number"
                      value={ghFollowersOverride}
                      placeholder="e.g. 5"
                      onChange={(e) => setGhFollowersOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Stars Earned</label>
                    <input
                      type="number"
                      value={ghStarsOverride}
                      placeholder="e.g. 1"
                      onChange={(e) => setGhStarsOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-2 font-bold">LeetCode Overrides</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Solved Problems</label>
                    <input
                      type="number"
                      value={lcSolvedOverride}
                      placeholder="e.g. 42"
                      onChange={(e) => setLcSolvedOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Global Ranking</label>
                    <input
                      type="number"
                      value={lcRankingOverride}
                      placeholder="e.g. 450000"
                      onChange={(e) => setLcRankingOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pb-3">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-2 font-bold">Hack2Skill Overrides</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Total Score</label>
                    <input
                      type="number"
                      value={h2sScoreOverride}
                      placeholder="e.g. 850"
                      onChange={(e) => setH2sScoreOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Platform Rank</label>
                    <input
                      type="number"
                      value={h2sRankOverride}
                      placeholder="e.g. 120"
                      onChange={(e) => setH2sRankOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Contributed Prompts</label>
                    <input
                      type="number"
                      value={h2sPromptsOverride}
                      placeholder="e.g. 15"
                      onChange={(e) => setH2sPromptsOverride(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-white text-black font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="h-4.5 w-4.5" /> SAVE STATS OVERRIDES
                </button>
              </div>
            </form>
          </div>

          {/* Graduation Roadmap Timeline Editor */}
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6">
            <h5 className="text-sm uppercase font-mono tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-400" /> Graduation Roadmap Editor
            </h5>
            <p className="text-xs text-slate-500 font-sans mb-4">
              Edit the milestones, status, dates, and bullet targets for each of your 4 academic years.
            </p>

            <form onSubmit={handleSaveTimeline} className="space-y-6 text-xs font-mono">
              {localTimeline.map((item, idx) => (
                <div key={item.id} className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-cyan-400">{item.year} Parameters</span>
                    <select
                      value={item.status}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setLocalTimeline(prev => prev.map((m, i) => i === idx ? { ...m, status: val } : m));
                      }}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Completed">COMPLETED</option>
                      <option value="Current">CURRENT</option>
                      <option value="Future">FUTURE</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase block mb-1">Milestone Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalTimeline(prev => prev.map((m, i) => i === idx ? { ...m, title: val } : m));
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase block mb-1">Academic Year Span</label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalTimeline(prev => prev.map((m, i) => i === idx ? { ...m, date: val } : m));
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Milestone Description Summary</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocalTimeline(prev => prev.map((m, i) => i === idx ? { ...m, description: val } : m));
                      }}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Active Targets (One bullet per line)</label>
                    <textarea
                      rows={3}
                      value={item.items.join("\n")}
                      onChange={(e) => {
                        const lines = e.target.value.split("\n");
                        setLocalTimeline(prev => prev.map((m, i) => i === idx ? { ...m, items: lines } : m));
                      }}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-[11px]"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-white text-black font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="h-4.5 w-4.5" /> SAVE TIMELINE ROADMAP
                </button>
              </div>
            </form>
          </div>

          {/* Skill Sliders Configuration */}
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 space-y-4">
            <h5 className="text-sm uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
              <Code className="h-4 w-4 text-cyan-400" /> Professional Competency Sliders
            </h5>
            <p className="text-xs text-slate-500 font-mono">
              Calibrate learning weights over core curriculum checkpoints.
            </p>

            <div className="space-y-4" id="skills-admin-list">
              {data.skills.map((sk) => (
                <div key={sk.id} className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-250">{sk.name}</span>
                    <span className="text-slate-500">{sk.phase}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sk.level}
                      onChange={(e) => onUpdateSkill(sk.id, Number(e.target.value), sk.status)}
                      className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <span className="text-xs font-mono font-bold text-cyan-400 w-8 text-right">{sk.level}%</span>
                  </div>

                  <div className="flex gap-2">
                    {["Mastered", "In Progress", "Planned"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onUpdateSkill(sk.id, sk.level, st as SkillProgress["status"])}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer ${
                          sk.status === st
                            ? "bg-slate-100 text-slate-950 font-bold"
                            : "bg-slate-900 text-slate-450 border border-slate-850 hover:bg-slate-800"
                        }`}
                      >
                        {st.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Profile Photo System & Certifications creator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Photo system */}
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 space-y-4">
            <h5 className="text-sm uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
              <Upload className="h-4 w-4 text-cyan-400" /> Profile Avatar System
            </h5>
            <p className="text-xs text-slate-500 font-sans">
              Upload a snapshot. It is fully responsive and auto-generates your professional hero images, recruiter cards, and resume visuals perfectly.
            </p>

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-28 w-28 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center relative group">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-slate-600 font-extrabold text-3xl font-mono">SAK</span>
                )}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-mono text-cyan-400 font-bold">
                  OVERLAY PHOTO
                </div>
              </div>

              <div className="w-full text-center">
                <input
                  type="file"
                  id="profile-img-upload-input"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="profile-img-upload-input"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-mono text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <FileUp className="h-3.5 w-3.5" /> SELECT PHOTO FILE
                </label>
                <span className="block text-[9px] text-slate-500 mt-1 font-mono">Max scale 2MB (PNG/JPG)</span>
              </div>
            </div>
          </div>

          {/* Certifications creator */}
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 space-y-4">
            <h5 className="text-sm uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-cyan-400" /> Academic Certifications
            </h5>

            <form onSubmit={handleAddCert} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[9px] text-slate-500 uppercase block mb-1">Certification Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud foundations"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-250"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase block mb-1">Issuer Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-250"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-500 uppercase block mb-1">Date Issued</label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 2024"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-250"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase block mb-1">Credential URL</label>
                  <input
                    type="url"
                    placeholder="e.g. https://..."
                    value={certProof}
                    onChange={(e) => setCertProof(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-250"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white transition-colors rounded text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> ATTACH CREDENTIAL
              </button>
            </form>

            {/* List of current certs */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">Registered Logs</span>
              {data.certifications.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">No certifications logged.</p>
              ) : (
                <div className="space-y-1.5 font-mono text-[11px]">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-center p-2 rounded bg-slate-900/30 border border-white/5">
                      <div className="truncate pr-2">
                        <p className="text-slate-300 font-bold truncate">{cert.name}</p>
                        <p className="text-[9px] text-slate-500 truncate">{cert.issuer} • {cert.date}</p>
                      </div>
                      <button
                        onClick={() => onDeleteCertification(cert.id)}
                        className="p-1.5 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete certification"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
