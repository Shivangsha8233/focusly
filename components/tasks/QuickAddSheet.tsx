"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { X, Sparkles, Bell, Repeat, Clock, Plus, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TaskColor, RecurrenceRule } from "@/lib/types/task";
import { askSpark } from "@/lib/ai/adapter";

const COLOR_OPTIONS: { id: TaskColor; name: string; bg: string; border: string }[] = [
  { id: "amber", name: "Amber", bg: "#FFE3B0", border: "#FFB84D" },
  { id: "violet", name: "Violet", bg: "#D9D3F7", border: "#6C5CE7" },
  { id: "green", name: "Green", bg: "#CFEBDD", border: "#10B981" },
];

const DURATION_PRESETS = [10, 25, 45, 60];

export function QuickAddSheet() {
  const { isQuickAddOpen, setIsQuickAddOpen, addTask } = useAppStore();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("2026-10-24");

  React.useEffect(() => {
    setDate(format(new Date(), "yyyy-MM-dd"));
  }, []);
  const [time, setTime] = useState("12:00");
  const [durationMin, setDurationMin] = useState(25);
  const [color, setColor] = useState<TaskColor>("violet");
  const [hasAlarm, setHasAlarm] = useState(true);
  const [recurrence, setRecurrence] = useState<RecurrenceRule>("none");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [isSparkBreaking, setIsSparkBreaking] = useState(false);

  if (!isQuickAddOpen) return null;

  const handleSparkBreakdown = async () => {
    if (!title.trim() || isSparkBreaking) return;
    setIsSparkBreaking(true);

    try {
      const data = await askSpark(`Please break down this task into 3 tiny 2-minute steps: ${title}`);
      if (data.checklist && data.checklist.length > 0) {
        setSubtasks((prev) => [...prev, ...(data.checklist || [])]);
      } else {
        setSubtasks((prev) => [
          ...prev,
          "Step 1: Set up work tools and take 1 deep breath",
          "Step 2: Do 2 minutes of the simplest part",
          "Step 3: Review progress",
        ]);
      }
    } catch {
      setSubtasks((prev) => [
        ...prev,
        "Step 1: Open work tool",
        "Step 2: Do 2 minutes of focus",
      ]);
    } finally {
      setIsSparkBreaking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      notes: notes.trim(),
      date,
      time,
      durationMin,
      color,
      hasAlarm,
      recurrence,
      subtasks,
    });

    // Reset fields
    setTitle("");
    setNotes("");
    setSubtasks([]);
    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="app-card w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--nav-border)]">
          <h2 className="app-text-ink text-[18px] md:text-[20px] font-extrabold">
            Quick Add Task
          </h2>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="app-surface w-9 h-9 rounded-full flex items-center justify-center app-text-muted hover:app-text-ink interactive-tap"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title */}
          <div>
            <label className="block app-text-muted text-[12px] font-bold uppercase tracking-wider mb-1">
              Task Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish client report, Wash dishes..."
              className="app-surface w-full px-4 py-3 rounded-2xl app-text-ink text-[15px] font-medium placeholder:text-[#5B5970] dark:placeholder:text-[#A8A5BD] outline-none border border-[var(--nav-border)] focus:border-[#6C5CE7]"
            />
          </div>

          {/* Spark Break It Down Helper */}
          {title.trim().length > 3 && (
            <button
              type="button"
              onClick={handleSparkBreakdown}
              disabled={isSparkBreaking}
              className="w-full py-2.5 px-4 bg-[#6C5CE7]/15 hover:bg-[#6C5CE7]/25 text-[#6C5CE7] rounded-2xl flex items-center justify-center gap-2 text-[13px] font-extrabold transition-all interactive-tap"
            >
              {isSparkBreaking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Spark is chunking this down...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFB84D]" />
                  <span>Break it down with Spark (+3 micro-steps)</span>
                </>
              )}
            </button>
          )}

          {/* Subtasks preview */}
          {subtasks.length > 0 && (
            <div className="space-y-1.5 p-3 app-surface rounded-2xl">
              <span className="app-text-muted text-[11px] font-extrabold uppercase">
                Tiny Steps:
              </span>
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center justify-between text-[12px] app-text-ink">
                  <span>• {st}</span>
                  <button
                    type="button"
                    onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))}
                    className="text-rose-500 hover:text-rose-700 ml-2 text-[11px]"
                  >
                    remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block app-text-muted text-[12px] font-bold uppercase tracking-wider mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details or link to keep in mind..."
              className="app-surface w-full px-4 py-2.5 rounded-2xl app-text-ink text-[13px] font-medium placeholder:text-[#5B5970] dark:placeholder:text-[#A8A5BD] outline-none border border-[var(--nav-border)] focus:border-[#6C5CE7]"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block app-text-muted text-[12px] font-bold uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="app-surface w-full px-3 py-2.5 rounded-2xl app-text-ink text-[13px] font-bold outline-none border border-[var(--nav-border)]"
              />
            </div>
            <div>
              <label className="block app-text-muted text-[12px] font-bold uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="app-surface w-full px-3 py-2.5 rounded-2xl app-text-ink text-[13px] font-bold outline-none border border-[var(--nav-border)]"
              />
            </div>
          </div>

          {/* Duration Presets */}
          <div>
            <label className="block app-text-muted text-[12px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Duration</span>
              <span className="app-text-ink font-extrabold">{durationMin} mins</span>
            </label>
            <div className="flex gap-2">
              {DURATION_PRESETS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationMin(dur)}
                  className={`flex-1 py-2 text-[12px] font-bold rounded-xl transition-all interactive-tap ${
                    durationMin === dur
                      ? "bg-[#6C5CE7] text-white shadow-sm"
                      : "app-surface app-text-muted hover:app-text-ink"
                  }`}
                >
                  {dur}m
                </button>
              ))}
            </div>
          </div>

          {/* Color Tint Options */}
          <div>
            <label className="block app-text-muted text-[12px] font-bold uppercase tracking-wider mb-1.5">
              Task Block Color
            </label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  className={`flex-1 py-2 px-3 rounded-2xl flex items-center justify-center gap-2 border-2 transition-all interactive-tap ${
                    color === opt.id ? "scale-105 shadow-md" : "opacity-80"
                  }`}
                  style={{
                    backgroundColor: opt.bg,
                    borderColor: color === opt.id ? opt.border : "transparent",
                    color: "#1C1B29",
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.border }} />
                  <span className="text-[12px] font-extrabold">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles: Alarm & Repeat */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setHasAlarm(!hasAlarm)}
              className={`p-3 rounded-2xl flex items-center justify-between border text-[13px] font-bold transition-all interactive-tap ${
                hasAlarm
                  ? "bg-[#6C5CE7]/15 border-[#6C5CE7] text-[#6C5CE7]"
                  : "app-surface border-[var(--nav-border)] app-text-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Alarm</span>
              </div>
              <span>{hasAlarm ? "ON" : "OFF"}</span>
            </button>

            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}
              className="app-surface p-3 rounded-2xl border border-[var(--nav-border)] app-text-ink text-[13px] font-bold outline-none"
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily Routine</option>
              <option value="weekly">Weekly Routine</option>
            </select>
          </div>

          {/* Submit Button (52px pill) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full h-[52px] rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 interactive-tap"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
