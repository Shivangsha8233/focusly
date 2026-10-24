"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Sparkles,
  Play,
  CheckCircle2,
  ListTree,
  ArrowRight,
  Clock,
  Timer,
  Plus,
  Calendar,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { AppHeader } from "@/components/layout/AppHeader";
import { Task } from "@/lib/types/task";

export function TodayView() {
  const {
    tasks,
    activeTaskId,
    setActiveTaskId,
    setSelectedTaskId,
    completeTask,
    startTask,
    moveTaskToTomorrow,
    setActiveTab,
    setIsQuickAddOpen,
    addPoints,
  } = useAppStore();

  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [todayStr, setTodayStr] = useState<string>("2026-10-24");

  React.useEffect(() => {
    setTodayStr(format(new Date(), "yyyy-MM-dd"));
  }, []);

  // Active Task for Hero Card
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  // Today's other tasks
  const todayTasks = tasks.filter(
    (t) => t.date === todayStr && t.id !== activeTaskId && t.status !== "done"
  );

  // Completed today tasks
  const completedTodayTasks = tasks.filter(
    (t) => t.date === todayStr && t.status === "done"
  );

  // Unfinished tasks from previous days ("Still on your list", no shame)
  const lingeringTasks = tasks.filter(
    (t) => t.date < todayStr && t.status !== "done"
  );

  const handleHeroDone = () => {
    if (!activeTask) return;
    completeTask(activeTask.id);
    setCelebrationMsg("Nice. That counted.");
    setTimeout(() => {
      setCelebrationMsg(null);
    }, 3500);
  };

  const getColorHex = (color: string) => {
    switch (color) {
      case "amber":
        return "#FFB84D";
      case "green":
        return "#10B981";
      default:
        return "#6C5CE7";
    }
  };

  return (
    <div className="pb-28 md:pb-12">
      <AppHeader />

      <main className="px-5 md:px-8 space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
        {/* Left Column (Col 1-7): Hero Focus Card */}
        <div className="md:col-span-7 space-y-5">
          {activeTask && activeTask.status !== "done" ? (
            /* RIGHT NOW Hero Card */
            <div className="hero-card relative rounded-[28px] p-6 md:p-8 shadow-md overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-extrabold tracking-widest text-[#FFB84D] uppercase">
                  RIGHT NOW
                </span>
                <span className="text-[12px] text-[#A3A0B8] font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFB84D]" /> {activeTask.durationMin} min target
                </span>
              </div>

              {/* Countdown ring & task info */}
              <div className="flex items-center gap-5 md:gap-6 my-2 md:my-4">
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      stroke="#3A3856"
                      strokeWidth="3.2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      stroke="#FFB84D"
                      className="transition-all duration-500 ease-out"
                      strokeDasharray="75, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[15px] md:text-[18px] font-extrabold text-[#FFFFFF] leading-none">
                      {activeTask.durationMin}:00
                    </span>
                    <span className="text-[10px] md:text-[11px] text-[#A3A0B8] font-bold mt-0.5">mins</span>
                  </div>
                </div>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedTaskId(activeTask.id)}
                >
                  <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#FFFFFF] leading-snug line-clamp-2 hover:underline">
                    {activeTask.title}
                  </h2>
                  <p className="text-[13px] md:text-[14px] text-[#A3A0B8] font-medium mt-1">
                    {activeTask.notes || "Tap to view subtasks and details"}
                  </p>
                </div>
              </div>

              {/* Celebration toast if triggered */}
              {celebrationMsg && (
                <div className="mt-4 p-3 bg-[#6C5CE7]/30 border border-[#6C5CE7]/60 rounded-xl text-center text-[13px] font-bold text-[#D9D3F7] animate-fadeIn">
                  ✨ {celebrationMsg}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={handleHeroDone}
                  className="h-[52px] rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 interactive-tap shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Done</span>
                </button>

                <button
                  onClick={() => setSelectedTaskId(activeTask.id)}
                  className="h-[52px] rounded-full border border-[#3A3856] hover:border-[#6C5CE7] text-[#D9D3F7] hover:text-white flex items-center justify-center gap-2 font-bold text-[14px] transition-all interactive-tap"
                >
                  <ListTree className="w-4 h-4 text-[#FFB84D]" />
                  <span>Break it down</span>
                </button>
              </div>
            </div>
          ) : (
            /* Friendly "Pick one thing" state when no task is active */
            <div className="app-card rounded-[28px] p-6 md:p-8 shadow-sm border border-[var(--nav-border)] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-[#E3DEF8] dark:bg-[#2B2744] flex items-center justify-center text-[#6C5CE7]">
                <Sparkles className="w-7 h-7 text-[#FFB84D]" />
              </div>
              <div>
                <h3 className="app-text-ink text-[18px] md:text-[20px] font-extrabold">
                  All clear for right now!
                </h3>
                <p className="app-text-muted text-[13px] font-medium mt-1 max-w-sm mx-auto">
                  Pick one task below to start, or add a new intention without any pressure.
                </p>
              </div>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-6 py-3 rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white font-extrabold text-[14px] inline-flex items-center gap-2 interactive-tap shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add a New Task</span>
              </button>
            </div>
          )}

          {/* Quick Momentum / "Just Start" 5-minute card */}
          <div className="app-card p-5 rounded-[22px] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE3B0] dark:bg-[#3E3320] flex items-center justify-center text-[#7E5700] dark:text-[#FFB84D]">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="app-text-ink text-[14px] font-bold">
                  Just Start (5-Minute Timer)
                </h4>
                <p className="app-text-muted text-[12px] font-medium">
                  Zero pressure. Work for 5 min, then decide whether to stop.
                </p>
              </div>
            </div>
            <button
              onClick={() => addPoints(1, "Started 5-minute timer")}
              className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5A49E0] text-white text-[13px] font-bold rounded-full interactive-tap shadow-sm"
            >
              Start 5m
            </button>
          </div>

          {/* Lingering Tasks Section ("Still on your list" - ADHD friendly, no shame) */}
          {lingeringTasks.length > 0 && (
            <div className="app-card p-5 rounded-[22px] shadow-sm border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-amber-600 dark:text-amber-400">
                  Still on your list
                </span>
                <span className="app-text-muted text-[11px]">
                  Want to move them?
                </span>
              </div>
              <div className="space-y-2">
                {lingeringTasks.map((lt) => (
                  <div
                    key={lt.id}
                    className="app-surface p-3 rounded-xl flex items-center justify-between"
                  >
                    <span className="app-text-ink text-[13px] font-bold truncate max-w-[200px]">
                      {lt.title}
                    </span>
                    <button
                      onClick={() => moveTaskToTomorrow(lt.id)}
                      className="px-3 py-1 bg-white dark:bg-[#1E1C2E] border border-[var(--nav-border)] rounded-full text-[11px] font-bold text-[#6C5CE7] hover:scale-105 interactive-tap"
                    >
                      Move to tomorrow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Col 8-12): Up Next & Task List */}
        <div className="md:col-span-5 space-y-5">
          {/* Up next list */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="app-text-ink text-[15px] font-extrabold">
                Up Next ({todayTasks.length})
              </h3>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="app-text-muted hover:text-[#6C5CE7] text-[12px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            <div className="space-y-2.5">
              {todayTasks.length > 0 ? (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className="app-card p-4 rounded-[18px] shadow-sm flex items-center justify-between transition-all interactive-tap cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: getColorHex(t.color) }}
                      />
                      <div className="min-w-0">
                        <h4 className="app-text-ink text-[14px] font-bold leading-snug truncate">
                          {t.title}
                        </h4>
                        <p className="app-text-muted text-[12px] font-medium mt-0.5">
                          {t.time} • {t.durationMin} min
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startTask(t.id);
                      }}
                      className="app-surface w-9 h-9 rounded-full flex items-center justify-center text-[#6C5CE7] hover:scale-105 active:scale-95 transition-all interactive-tap flex-shrink-0 ml-2"
                      aria-label="Start task"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="app-card p-4 rounded-[18px] text-center app-text-muted text-[13px]">
                  No upcoming tasks scheduled for today.
                </div>
              )}
            </div>
          </section>

          {/* Completed Today section */}
          {completedTodayTasks.length > 0 && (
            <section className="space-y-2">
              <span className="app-text-muted text-[12px] font-bold uppercase tracking-wider px-1">
                Done Today ({completedTodayTasks.length})
              </span>
              <div className="space-y-2 opacity-75">
                {completedTodayTasks.map((ct) => (
                  <div
                    key={ct.id}
                    onClick={() => setSelectedTaskId(ct.id)}
                    className="app-surface p-3 rounded-[16px] flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="app-text-ink text-[13px] font-semibold line-through">
                        {ct.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Spark Shortcut Banner */}
          <section className="pt-1">
            <button
              onClick={() => setActiveTab("spark")}
              className="app-surface w-full p-4 rounded-[20px] flex items-center justify-between text-left group transition-all interactive-tap shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#FFB84D]" />
                </div>
                <div>
                  <p className="app-text-ink text-[14px] font-extrabold">
                    Feeling stuck? Talk to Spark
                  </p>
                  <p className="app-text-muted text-[12px] font-medium">
                    One tiny 2-minute step to gain momentum
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#6C5CE7] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
