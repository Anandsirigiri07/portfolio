import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Plus, Trash2, Edit2, Archive, ArrowUp, ArrowDown, ExternalLink, ShieldCheck, Check, RotateCcw } from "lucide-react";
import { Achievement } from "../types";

interface AchievementManagerProps {
  achievements: Achievement[];
  onAdd: (achievement: Omit<Achievement, "id" | "displayOrder" | "archived" >) => void;
  onUpdate: (id: string, updated: Partial<Achievement>) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

export default function AchievementManager({
  achievements,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: AchievementManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [badge, setBadge] = useState("");
  const [category, setCategory] = useState<Achievement["category"]>("Academics");

  // Filtering states
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [showArchived, setShowArchived] = useState(false);

  const keyCategories: Achievement["category"][] = [
    "Academics",
    "Open Source",
    "Hackathons",
    "Competitions",
    "Certifications",
    "Leadership",
    "Community",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !description.trim()) return;

    if (editingId) {
      onUpdate(editingId, {
        title,
        date,
        description,
        proofLink: proofLink || undefined,
        badge: badge || undefined,
        category,
      });
      setEditingId(null);
    } else {
      onAdd({
        title,
        date,
        description,
        proofLink: proofLink || undefined,
        badge: badge || undefined,
        category,
      });
    }

    // Reset Form
    setTitle("");
    setDate("");
    setDescription("");
    setProofLink("");
    setBadge("");
    setCategory("Academics");
    setIsAdding(false);
  };

  const startEdit = (ach: Achievement) => {
    setEditingId(ach.id);
    setTitle(ach.title);
    setDate(ach.date);
    setDescription(ach.description);
    setProofLink(ach.proofLink || "");
    setBadge(ach.badge || "");
    setCategory(ach.category);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setDescription("");
    setProofLink("");
    setBadge("");
    setCategory("Academics");
    setIsAdding(false);
  };

  // Filter and sort achievements
  // Sorted by displayOrder
  const displayedAchievements = achievements
    .filter((ach) => {
      const matchCat = filterCategory === "All" || ach.category === filterCategory;
      const matchArchived = showArchived ? ach.archived : !ach.archived;
      return matchCat && matchArchived;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6" id="achievement-manager-cms">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="text-yellow-400 h-5 w-5" />
            Verified Achievement Credentials CMS
          </h4>
          <p className="text-xs text-slate-500 font-mono">
            Add, update, reorder or archive career benchmarks immediately streaming to your live resume format.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer ml-auto"
            id="add-entry-trigger"
          >
            <Plus className="h-4 w-4" /> ADD ACHIEVEMENT
          </button>
        )}
      </div>

      {/* Form Area */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-hidden font-mono"
            id="achievement-form-container"
          >
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              {editingId ? "Edit Verified Entry" : "Register Verified Achievement"}
            </h5>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Achievement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GSSoC Active Contributor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Date / Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. June 2024"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Category Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Achievement["category"])}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {keyCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Proof Link (Optional URL)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://github.com/..."
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-1">Official Badge / Rank</label>
                  <input
                    type="text"
                    placeholder="e.g. Ranked Top 10"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Verification / Description Details *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Introduce metrics, pull requests resolved, or specific exam scores. Maximize recruiter trust."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-950 text-slate-400 rounded text-xs tracking-wider uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-100 hover:bg-white text-black font-bold rounded text-xs tracking-wider uppercase cursor-pointer"
                >
                  {editingId ? "SAVE UPDATE" : "SUBMIT PROOF"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Category selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y border-white/5 font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 mr-2 uppercase tracking-wide">Category:</span>
          {["All", ...keyCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterCategory === cat
                  ? "bg-slate-100 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-850"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-400 font-mono select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded bg-slate-900 border-slate-800 text-cyan-600 focus:ring-0 focus:ring-offset-0"
            />
            <span>Show Archived ({achievements.filter((a) => a.archived).length})</span>
          </label>
        </div>
      </div>

      {/* Main achievements list */}
      <div className="space-y-3" id="ach-list-container">
        {displayedAchievements.length === 0 ? (
          <div className="text-center p-8 bg-slate-950/20 border border-slate-900 rounded-xl space-y-2">
            <p className="text-xs text-slate-500 italic">No achievements matching filters registered.</p>
          </div>
        ) : (
          displayedAchievements.map((ach, idx) => (
            <div
              key={ach.id}
              className="bg-slate-950 border border-white/5 rounded-xl p-5 hover:border-slate-800 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-bold">
                    [#{ach.displayOrder}] {ach.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">• {ach.date}</span>
                  {ach.archived && (
                    <span className="text-[9px] px-1.5 rounded bg-amber-950 text-amber-400 font-mono border border-amber-900/40 uppercase">
                      Archived
                    </span>
                  )}
                </div>
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  {ach.title}
                  {ach.proofLink && (
                    <a
                      href={ach.proofLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-350 transition-colors"
                      title="Verify proof source"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{ach.description}</p>

                {ach.badge && (
                  <span className="inline-flex mt-1 text-[9px] font-mono tracking-wider text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 uppercase font-bold">
                    {ach.badge}
                  </span>
                )}
              </div>

              {/* Administrative actions */}
              <div className="shrink-0 flex sm:flex-col gap-1.5 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 justify-end font-mono">
                {/* Reordering indicators */}
                <div className="flex gap-1">
                  <button
                    onClick={() => onReorder(ach.id, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer border border-slate-800"
                    title="Move Order Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onReorder(ach.id, "down")}
                    disabled={idx === displayedAchievements.length - 1}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer border border-slate-800"
                    title="Move Order Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(ach)}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 cursor-pointer border border-slate-800 flex items-center gap-1 text-[10px] tracking-tight"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> EDIT
                  </button>
                  <button
                    onClick={() => onUpdate(ach.id, { archived: !ach.archived })}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 cursor-pointer border border-slate-800 flex items-center gap-1 text-[10px]"
                    title={ach.archived ? "Unarchive" : "Archive"}
                  >
                    <Archive className="h-3.5 w-3.5" /> ARCHIVE
                  </button>
                  <button
                    onClick={() => onDelete(ach.id)}
                    className="p-1.5 rounded bg-red-950/20 hover:bg-red-950 border border-red-900/30 text-red-400 hover:text-red-100 cursor-pointer flex items-center gap-1 text-[10px]"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> DEL
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
