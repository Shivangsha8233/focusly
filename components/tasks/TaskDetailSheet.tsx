"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  X,
  Play,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  Plus,
  ArrowRight,
  Bell,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export function TaskDetailSheet() {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    moveTaskToTomorrow,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useAppStore();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task || !selectedTaskId) return null;

  const isCompleted = task.status === "done";

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="app-card w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] p-6 shadow-2xl relative space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--nav-border)]">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  task.color === "amber"
                    ? "#FFB84D"
                    : task.color === "green"
                    ? "#10B981"
                    : "#6C5CE7",
              }}
            />
            <span className="app-text-muted text-[12px] font-bold uppercase tracking-wider">
              Task Details
            </span>
          </div>
          <button
            onClick={() => setSelectedTaskId(null)}
            className="app-surface w-9 h-9 rounded-full flex items-center justify-center app-text-muted hover:app-text-ink interactive-tap"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Notes */}
        <div className="space-y-2">
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="app-text-ink text-[20px] font-extrabold w-full bg-transparent outline-none border-b border-transparent focus:border-[#6C5CE7] pb-1"
          />
          <textarea
            rows={2}
            value={task.notes || ""}
            onChange={(e) => updateTask(task.id, { notes: e.target.value })}
            placeholder="Add notes or reminders..."
            className="app-surface w-full p-3 rounded-2xl app-text-ink text-[13px] outline-none border border-[var(--nav-border)] focus:border-[#6C5CE7]"
          />
        </div>

        {/* Schedule & Duration Metadata Pills */}
        <div className="flex flex-wrap gap-2 text-[12px] font-bold app-text-muted">
          <div className="app-surface px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>{task.date}</span>
          </div>
          <div className="app-surface px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>{task.time} ({task.durationMin}m)</span>
          </div>
          {task.hasAlarm && (
            <div className="app-surface px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[#FFB84D]">
              <Bell className="w-3.5 h-3.5 fill-current" />
              <span>Alarm on</span>
            </div>
          )}
        </div>

        {/* Subtasks Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="app-text-ink text-[14px] font-extrabold">
              Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
            </h4>
            <span className="text-[11px] font-semibold text-[#FFB84D]">
              +2 pts each
            </span>
          </div>

          <div className="space-y-2">
            {task.subtasks.map((sub) => (
              <div
                key={sub.id}
                className={`app-surface p-3 rounded-2xl flex items-center justify-between transition-all ${
                  sub.completed ? "opacity-60" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSubtask(task.id, sub.id)}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      sub.completed
                        ? "bg-[#6C5CE7] border-[#6C5CE7] text-white"
                        : "border-[var(--nav-border)] bg-transparent"
                    }`}
                  >
                    {sub.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span
                    className={`text-[13px] font-semibold app-text-ink ${
                      sub.completed ? "line-through text-opacity-60" : ""
                    }`}
                  >
                    {sub.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteSubtask(task.id, sub.id)}
                  className="app-text-muted hover:text-rose-500 p-1"
                  aria-label="Delete subtask"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSub} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a tiny micro-step..."
              className="app-surface flex-1 px-4 py-2 rounded-2xl text-[13px] app-text-ink outline-none border border-[var(--nav-border)] focus:border-[#6C5CE7]"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim()}
              className="w-9 h-9 rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white flex items-center justify-center disabled:opacity-40 interactive-tap"
              aria-label="Add subtask"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-[var(--nav-border)]">
          {!isCompleted ? (
            <div className="grid grid-cols-2 gap-3">
              {/* Start Now (Activates hero countdown on Today) */}
              <button
                onClick={() => startTask(task.id)}
                className="h-[50px] rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 interactive-tap shadow-md"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Start Now</span>
              </button>

              {/* Complete Task */}
              <button
                onClick={() => completeTask(task.id)}
                className="h-[50px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[14px] flex items-center justify-center gap-2 interactive-tap shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Done</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-center text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
              ✓ Completed! Great job!
            </div>
          )}

          {/* Move to Tomorrow & Delete */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => moveTaskToTomorrow(task.id)}
              className="h-[44px] rounded-full border border-[var(--nav-border)] hover:border-[#6C5CE7] app-text-ink text-[13px] font-bold flex items-center justify-center gap-1.5 interactive-tap"
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Move to tomorrow</span>
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="h-[44px] rounded-full border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[13px] font-bold flex items-center justify-center gap-1.5 interactive-tap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
