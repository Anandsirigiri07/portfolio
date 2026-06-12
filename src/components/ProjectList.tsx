import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderGit2, ExternalLink, Github, BookOpen, AlertCircle, Sparkles, Plus, Trash } from "lucide-react";
import { Project } from "../types";

interface ProjectListProps {
  projects: Project[];
  onAddProject?: (proj: Omit<Project, "id">) => void;
  onDeleteProject?: (id: string) => void;
}

export default function ProjectList({ projects, onAddProject, onDeleteProject }: ProjectListProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  // Form states to support future project additions comfortably
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [overview, setOverview] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [solution, setSolution] = useState("");
  const [techString, setTechString] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !overview.trim() || !onAddProject) return;

    onAddProject({
      title,
      date: date || "June 2024",
      overview,
      problemStatement: problemStatement || "Unspecified physical system requirement.",
      solution: solution || "Unspecified digital outcome layout.",
      technologies: techString ? techString.split(",").map(t => t.trim()).filter(Boolean) : ["Java"],
      githubLink: githubLink || undefined,
      demoLink: demoLink || undefined,
      learningOutcomes: learningOutcomes || "Mastered standard algorithmic thinking."
    });

    // Reset Form
    setTitle("");
    setDate("");
    setOverview("");
    setProblemStatement("");
    setSolution("");
    setTechString("");
    setGithubLink("");
    setDemoLink("");
    setLearningOutcomes("");
    setIsAdding(false);
  };

  const selectedProj = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6" id="projects-showcase-view">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-cyan-400" />
            Interactive Engineering Showcase
          </h4>
          <p className="text-xs text-slate-500 font-mono">
            Click any project to dissect its architectural design, problem assertions, and learning outcomes.
          </p>
        </div>

        {onAddProject && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-cyan-400 font-mono text-xs rounded-lg transition-colors cursor-pointer"
          >
            + ADD NEW PROJECT
          </button>
        )}
      </div>

      {/* Add Project Form Drawer */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-hidden font-mono text-xs"
            id="proj-form-container"
          >
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Add Verified Portfolio Project
            </h5>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graph Pathfinders"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Release Month/Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jan 2024"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-450 uppercase block mb-1">Quick Overview (Context) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Summarize the core premise of the app."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Problem Statement</label>
                  <textarea
                    rows={2}
                    placeholder="What bottleneck was resolved?"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Detailed Solution</label>
                  <textarea
                    rows={2}
                    placeholder="How was the framework initialized?"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Technology Chips (comma lists)</label>
                  <input
                    type="text"
                    placeholder="Java, Swing, OOP, Threading"
                    value={techString}
                    onChange={(e) => setTechString(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Github Code Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/Anandsirigiri07/..."
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-450 uppercase block mb-1">Live Demo / Proof Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={demoLink}
                    onChange={(e) => setDemoLink(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-450 uppercase block mb-1">Key Learning Outcomes</label>
                <textarea
                  rows={2}
                  placeholder="Mastery of runtime vectors, pointer constraints..."
                  value={learningOutcomes}
                  onChange={(e) => setLearningOutcomes(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-850 text-slate-200 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-400 rounded cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-100 hover:bg-white text-black font-bold rounded cursor-pointer"
                >
                  REGISTER PROJECT
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Projects Vertical Index */}
        <div className="lg:col-span-5 space-y-2">
          {projects.map((proj) => {
            const isActive = selectedProj?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                  isActive
                    ? "bg-slate-950 border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                    : "bg-slate-900/30 border-white/5 hover:border-slate-800 hover:bg-slate-900/55"
                }`}
                id={`project-item-${proj.id}`}
              >
                {isActive && (
                  <div className="absolute top-1/2 left-0 w-1 h-8 bg-cyan-400 -translate-y-1/2 rounded-r"></div>
                )}
                <div className="flex justify-between items-start mb-1 font-mono text-[10px]">
                  <span className={`${isActive ? "text-cyan-400" : "text-slate-500"}`}>{proj.date}</span>
                  {onDeleteProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer"
                      title="Delete profile project"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <h5 className="font-bold text-xs text-slate-100">{proj.title}</h5>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{proj.overview}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {proj.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-450 border border-slate-850"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 3 && (
                    <span className="text-[9px] font-mono text-slate-650 px-1 hover:text-cyan-400">
                      +{proj.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Target Project Dissect Details View */}
        <div className="lg:col-span-7">
          {selectedProj ? (
            <div className="bg-slate-950 border border-white/5 rounded-xl p-6 space-y-6 relative overflow-hidden" id="project-detail-portal">
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Title Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-wider text-cyan-400 block uppercase">
                    Architectural Deep-Dive
                  </span>
                  <h4 className="text-lg font-bold text-slate-200">{selectedProj.title}</h4>
                  <span className="text-xs text-slate-500 font-mono">{selectedProj.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedProj.githubLink && (
                    <a
                      href={selectedProj.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
                      title="Inspect Github Source"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {selectedProj.demoLink && (
                    <a
                      href={selectedProj.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors border border-slate-800"
                      title="Live Deployment Preview"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Problem/Solution split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/40 border border-white/5 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <AlertCircle className="h-3.5 w-3.5" /> Problem Assertion
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedProj.problemStatement}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/40 border border-white/5 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" /> Programmatic Solution
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedProj.solution}
                  </p>
                </div>
              </div>

              {/* Stack Used */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Platform Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outcomes */}
              <div className="p-4 bg-slate-900/40 border border-cyan-500/10 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <BookOpen className="h-3.5 w-3.5" /> Key Learning Outcomes (Integrity Check)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedProj.learningOutcomes}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-slate-950/20 border border-slate-900 rounded-xl">
              <span className="text-xs text-slate-500 italic">Select a project to analyze specifications.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
