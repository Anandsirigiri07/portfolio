import React from "react";
import { motion } from "motion/react";
import { Calendar, ChevronRight, CheckCircle2, Circle, Star, ArrowDown, GraduationCap, LayoutGrid } from "lucide-react";
import { TimelineMilestone, SkillProgress } from "../types";

interface TimelineSectionProps {
  timeline: TimelineMilestone[];
  skills: SkillProgress[];
}

export default function TimelineSection({ timeline, skills }: TimelineSectionProps) {
  // Sort timeline steps just to ensure robust sequence Year 1 to 4
  const sortedTimeline = [...timeline].sort((a, b) => {
    const map = { "Year 1": 1, "Year 2": 2, "Year 3": 3, "Year 4": 4 };
    return map[a.year] - map[b.year];
  });

  // Phases in skill evolution
  const skillPhases = [
    { name: "C Programming", desc: "Foundational syntaxes & pointers", color: "from-blue-500 to-cyan-500" },
    { name: "Java Basics", desc: "Classes, compilers, standard standard utilities", color: "from-cyan-500 to-teal-500" },
    { name: "OOP", desc: "Inheritance, encapsulation, templates", color: "from-teal-500 to-emerald-500" },
    { name: "DSA", desc: "Recursion, list links, sorting metrics", color: "from-emerald-500 to-yellow-500" },
    { name: "Web Dev", desc: "Next.js, Node infrastructure models", color: "from-yellow-500 to-orange-500" },
    { name: "Advanced Tech", desc: "Cloud databases, micro-structures", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="space-y-12" id="academic-timeline-view">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] px-3 py-1 rounded-full bg-blue-950/50 border border-blue-900/30 text-blue-400">
          The Career Operating System Engine
        </span>
        <h3 className="text-3xl font-light tracking-tight text-white">
          Road to Becoming a <span className="font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Software Engineer</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tracing academic landmarks, practical frameworks, and open-source contributions step-by-step from enrollment to placement.
        </p>
      </div>

      {/* Skill Evolution Timeline Tracker */}
      <div className="bg-slate-950 border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="h-5 w-5 text-blue-400" />
          <div>
            <h4 className="text-sm font-bold text-slate-200">Continuous Curriculum Learning Progress</h4>
            <p className="text-[10px] text-slate-500 font-mono">Dynamic sequence mapping skills acquired over the B.Tech lifecycle</p>
          </div>
        </div>

        {/* Custom horizontal progression timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {skillPhases.map((p, idx) => {
            // Find corresponding item in actual skills database
            const matches = skills.filter((s) => s.phase === p.name);
            const overallLevel = matches.length > 0 ? Math.round(matches.reduce((sum, current) => sum + current.level, 0) / matches.length) : 0;
            const status = matches.length > 0 ? matches[0].status : "Planned";

            return (
              <div
                key={p.name}
                className="bg-slate-900/40 border border-slate-900 rounded-lg p-3.5 relative flex flex-col justify-between group hover:border-slate-800 transition-all"
              >
                {/* Visual Connector Arrow (Hidden on Mobile) */}
                {idx < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10 text-slate-700">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                      PHASE 0{idx + 1}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                        status === "Mastered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : status === "In Progress"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                    <span>PROGRESS</span>
                    <span>{overallLevel}%</span>
                  </div>
                  <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${p.color}`}
                      style={{ width: `${overallLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Timeline Card List */}
      <div className="relative border-l border-white/10 ml-4 pl-8 space-y-12">
        {sortedTimeline.map((item, idx) => {
          const isCompleted = item.status === "Completed";
          const isCurrent = item.status === "Current";

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Anchor */}
              <div
                className={`absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                  isCompleted
                    ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                    : isCurrent
                    ? "bg-blue-950 border-blue-400 text-blue-400 shadow-[0_0_12px_rgba(34,211,238,0.4)] animate-pulse"
                    : "bg-slate-950 border-slate-700 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isCurrent ? (
                  <Star className="h-3 w-3 fill-blue-400" />
                ) : (
                  <Circle className="h-2 w-2 fill-slate-700 text-slate-700" />
                )}
              </div>

              {/* Box container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 border border-white/5 rounded-xl p-6 hover:border-slate-800 transition-all">
                {/* Year tag & description label */}
                <div className="lg:col-span-4 space-y-2">
                  <span
                    className={`inline-block text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                        : isCurrent
                        ? "bg-blue-950 text-blue-400 border border-blue-900/30"
                        : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {item.year.toUpperCase()} • {item.date}
                  </span>
                  <h4 className="text-lg font-bold text-slate-200 mt-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.description}</p>
                </div>

                {/* Sub-items list */}
                <div className="lg:col-span-8 bg-slate-900/30 border border-white/5 rounded-lg p-5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-3">
                    Milestones and Targets Active
                  </span>
                  <div className="space-y-3">
                    {item.items.map((sub, sIdx) => (
                      <div key={sIdx} className="flex gap-2.5 items-start text-xs text-slate-300">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${isCompleted ? "text-emerald-500" : isCurrent ? "text-cyan-400" : "text-slate-600"}`} />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
