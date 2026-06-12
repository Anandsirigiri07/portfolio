import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { FileText, Printer, Copy, Check, Download, Layers, Eye } from "lucide-react";
import { PortfolioData } from "../types";

interface ResumeBuilderProps {
  data: PortfolioData;
}

export default function ResumeBuilder({ data }: ResumeBuilderProps) {
  // Styles of CV: 'ats' (white page, black text) or 'designer' (premium dark aesthetic)
  const [styleMode, setStyleMode] = useState<"ats" | "designer">("designer");
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Trigger browser raw print setup pointing specifically to this element
  const handlePrint = () => {
    const originalContent = document.body.innerHTML;
    const printContent = printAreaRef.current?.innerHTML || "";

    // Inject temporary print page framework
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${data.name} - Resume</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                background-color: ${styleMode === "ats" ? "#ffffff" : "#050505"};
                color: ${styleMode === "ats" ? "#000000" : "#cbd5e1"};
                font-family: ui-sans-serif, system-ui, sans-serif;
                padding: 40px;
              }
              @media print {
                body { padding: 0px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div>${printContent}</div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Convert entire resume database state to standard text configuration for straightforward clipboard pasting
  const copyAsStructuredText = () => {
    let text = `${data.name.toUpperCase()}\n`;
    text += `${data.degree} - ${data.branch}\n`;
    text += `REVA University | Bangalore, IN\n`;
    text += `Email: ${data.email} | Phone: ${data.phone}\n`;
    text += `Profiles:\n- GitHub: https://github.com/${data.githubUsername}\n- LinkedIn: ${data.linkedinUrl}\n- LeetCode: ${data.leetcodeUsername}\n\n`;

    text += `========================================\n`;
    text += `ACADEMIC SUMMARY\n`;
    text += `========================================\n`;
    text += `${data.university} \n- B.Tech in CSIT (2023 - 2027)\n\n`;

    text += `========================================\n`;
    text += `EXPERIENCE & OPEN SOURCE CONTRIBUTIONS\n`;
    text += `========================================\n`;
    data.achievements.filter(a => !a.archived).forEach((ach) => {
      text += `- ${ach.title} (${ach.date}): ${ach.description}\n`;
    });
    text += `\n`;

    text += `========================================\n`;
    text += `FEATURED PROJECTS\n`;
    text += `========================================\n`;
    data.projects.forEach((proj) => {
      text += `- ${proj.title} (${proj.date})\n`;
      text += `  Overview: ${proj.overview}\n`;
      text += `  Problem Statement: ${proj.problemStatement}\n`;
      text += `  Programmatic Solution: ${proj.solution}\n`;
      text += `  Technologies: ${proj.technologies.join(", ")}\n`;
      text += `  Learning Outcomes: ${proj.learningOutcomes}\n\n`;
    });

    text += `========================================\n`;
    text += `SKILLS TIMELINE IN FOCUS\n`;
    text += `========================================\n`;
    data.skills.forEach((sk) => {
      text += `- ${sk.name}: ${sk.level}% Mastery Status (Phase: ${sk.phase})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="resume-sync-view">
      {/* Settings layout bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-white/5 rounded-xl">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Reactive Automated Resume Core
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Automatically synchronizes changes to achievements, project code, or academic milestones instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* Format Selector */}
          <div className="flex bg-slate-900 rounded p-1 border border-slate-800">
            <button
              onClick={() => setStyleMode("designer")}
              className={`px-3 py-1 text-xs font-bold rounded cursor-pointer transition-all ${
                styleMode === "designer" ? "bg-cyan-600 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              PREMIUM DESIGNER
            </button>
            <button
              onClick={() => setStyleMode("ats")}
              className={`px-3 py-1 text-xs font-bold rounded cursor-pointer transition-all ${
                styleMode === "ats" ? "bg-slate-100 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              ATS-FRIENDLY
            </button>
          </div>

          <button
            onClick={copyAsStructuredText}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            title="Copy CV structured raw txt to clipboard for DOCX"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" /> COPIED!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> COPY RAW TXT
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="p-2 bg-cyan-950/40 hover:bg-cyan-950 text-cyan-400 border border-cyan-800/40 hover:border-cyan-500 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            title="Download PDF via Browser Print"
          >
            <Printer className="h-3.5 w-3.5" /> PDF / PRINT
          </button>
        </div>
      </div>

      {/* Target Preview Segment */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/5 text-[10px] uppercase font-mono tracking-widest text-slate-500">
          <span>Active Render Canvas Preview</span>
          {styleMode === "ats" ? (
            <span className="text-amber-400 font-bold">Black & White Print Optimization Active</span>
          ) : (
            <span className="text-cyan-400 font-bold">Cybernetic Sleek Theme Active</span>
          )}
        </div>

        {/* Live print element structure */}
        <div
          ref={printAreaRef}
          className={`p-8 p-md-12 transition-all duration-300 font-sans ${
            styleMode === "ats"
              ? "bg-white text-[#111111] max-w-4xl mx-auto border-4 border-slate-250 shrink-0"
              : "bg-[#050505] text-slate-300 max-w-4xl mx-auto"
          }`}
          id="resume-live-canvas"
        >
          {/* Header Segment */}
          <div className="border-b border-slate-300/30 pb-6 mb-6">
            <h1
              className={`text-3xl font-black tracking-tight uppercase leading-none ${
                styleMode === "ats" ? "text-black" : "text-white"
              }`}
            >
              {data.name}
            </h1>
            <p className={`text-xs uppercase font-mono tracking-widest mt-1.5 ${styleMode === "ats" ? "text-slate-600" : "text-cyan-400"}`}>
              {data.degree} • {data.branch}
            </p>
            <p className={`text-xs mt-1 ${styleMode === "ats" ? "text-slate-500" : "text-slate-400"}`}>
              {data.university} — Year 1/2 Undergraduate Student
            </p>

            {/* Contacts line */}
            <div className={`mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono pt-3 border-t border-slate-300/10 ${styleMode === "ats" ? "text-slate-650" : "text-slate-400"}`}>
              <div>
                <span className="block text-[9px] uppercase text-slate-500 tracking-wider">Email</span>
                <span className="font-bold">{data.email}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500 tracking-wider">Phone</span>
                <span className="font-bold">{data.phone}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500 tracking-wider">LinkedIn</span>
                <span className="font-bold underline truncate block">{data.linkedinUrl.replace("https://", "")}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500 tracking-wider">GitHub Hub</span>
                <span className="font-bold">@{data.githubUsername}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left columns: Achievements & projects */}
            <div className="md:col-span-8 space-y-6">
              {/* Profile Bio Context */}
              <div className="space-y-1">
                <h4 className={`text-[11px] font-mono tracking-widest uppercase pb-1 border-b border-slate-400/20 ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                  01. Professional Bio Overview
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {data.bio}
                </p>
              </div>

              {/* Achievements accomplishments */}
              {data.achievements.filter(a => !a.archived).length > 0 && (
                <div className="space-y-4">
                  <h4 className={`text-[11px] font-mono tracking-widest uppercase pb-1 border-b border-slate-400/20 ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                    02. Verified Open-Source & Achievements
                  </h4>
                  <div className="space-y-3">
                    {data.achievements
                      .filter((ach) => !ach.archived)
                      .map((ach) => (
                        <div key={ach.id} className="text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className={styleMode === "ats" ? "text-black font-extrabold" : "text-white"}>
                              {ach.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">{ach.date}</span>
                          </div>
                          <span className={`text-[10px] font-mono uppercase tracking-wider ${styleMode === "ats" ? "text-slate-500" : "text-cyan-400"}`}>
                            {ach.category}
                          </span>
                          <p className={`mt-1 leading-normal ${styleMode === "ats" ? "text-slate-600" : "text-slate-400"}`}>
                            {ach.description}
                          </p>
                          {ach.badge && (
                            <span className={`inline-block mt-1 font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${styleMode === "ats" ? "bg-slate-100 text-slate-800" : "bg-amber-500/10 text-amber-300 border border-amber-500/10"}`}>
                              Badge: {ach.badge}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Academic Projects details */}
              <div className="space-y-4">
                <h4 className={`text-[11px] font-mono tracking-widest uppercase pb-1 border-b border-slate-400/20 ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                  03. Technical Projects Portfolio
                </h4>
                <div className="space-y-4">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className={styleMode === "ats" ? "text-black font-extrabold" : "text-white"}>
                          {proj.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{proj.date}</span>
                      </div>
                      <p className={`leading-relaxed italic ${styleMode === "ats" ? "text-slate-700" : "text-slate-300"}`}>
                        Overview: {proj.overview}
                      </p>
                      <p className={`leading-relaxed font-sans ${styleMode === "ats" ? "text-slate-600" : "text-slate-400"}`}>
                        <strong className={styleMode === "ats" ? "text-black" : "text-slate-200"}>Core Problem:</strong> {proj.problemStatement}
                      </p>
                      <p className={`leading-relaxed font-sans ${styleMode === "ats" ? "text-slate-600" : "text-slate-400"}`}>
                        <strong className={styleMode === "ats" ? "text-black" : "text-slate-200"}>Program Solution:</strong> {proj.solution}
                      </p>
                      <p className={`leading-relaxed font-sans ${styleMode === "ats" ? "text-slate-600" : "text-slate-400"}`}>
                        <strong className={styleMode === "ats" ? "text-black" : "text-slate-200"}>Architectural Learning:</strong> {proj.learningOutcomes}
                      </p>
                      <div className="pt-1.5 flex flex-wrap gap-1 font-mono text-[9px]">
                        {proj.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={`px-1 rounded ${
                              styleMode === "ats" ? "bg-slate-150 text-black border border-slate-300" : "bg-slate-900 text-slate-300 border border-slate-800"
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebars: education, certifications, skills timeline */}
            <div className="md:col-span-4 space-y-6">
              {/* Education section */}
              <div className="space-y-2">
                <h4 className={`text-[11px] font-mono tracking-widest uppercase pb-1 border-b border-slate-400/20 ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                  04. Academic Major Code
                </h4>
                <div className="text-xs">
                  <p className={`font-bold ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                    REVA University
                  </p>
                  <p className={styleMode === "ats" ? "text-slate-600" : "text-slate-400"}>
                    B.Tech in Computer Science and IT (CSIT)
                  </p>
                  <p className="font-mono text-[10px] text-slate-500 mt-1">2023 - 2027</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Bangalore, Karnataka, IN</p>
                </div>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-3">
                <h4 className={`text-[11px] font-mono tracking-widest uppercase pb-1 border-b border-slate-400/20 ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                  05. Skill Path Status
                </h4>
                <div className="space-y-2.5">
                  {data.skills.map((sk) => (
                    <div key={sk.id} className="text-xs">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className={`font-bold ${styleMode === "ats" ? "text-black" : "text-slate-200"}`}>{sk.name}</span>
                        <span className="text-slate-500">{sk.level}%</span>
                      </div>
                      <div className="h-1 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${styleMode === "ats" ? "bg-black" : "bg-cyan-500"}`}
                          style={{ width: `${sk.level}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono italic block mt-0.5">Focus: {sk.phase} • {sk.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications verification */}
              {data.certifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`text-[11px] font-mono tracking-widest uppercase pb-1 border-b border-slate-400/20 ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                    06. Certifications Setup
                  </h4>
                  <div className="space-y-2 text-xs">
                    {data.certifications.map((cert) => (
                      <div key={cert.id} className="pb-1.5 border-b border-dotted border-slate-300Last:border-b-0">
                        <p className={`font-bold ${styleMode === "ats" ? "text-black" : "text-white"}`}>
                          {cert.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Issued: {cert.issuer} ({cert.date})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
