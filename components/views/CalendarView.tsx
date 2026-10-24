"use client";

import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Plus, Bell, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppStore } from "@/lib/store/useAppStore";
import { Task } from "@/lib/types/task";

export function CalendarView() {
  const { tasks, setSelectedTaskId, setIsQuickAddOpen } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date("2026-10-24T12:00:00"));

  React.useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  // Filter tasks for the active selected day
  const dayTasks = tasks.filter((t) => t.date === selectedDateStr);

  return (
    <div className="pb-28 md:pb-12">
      <AppHeader
        title={format(selectedDate, "MMMM yyyy")}
        subtitle="Timeline view"
      />

      <main className="px-5 md:px-8 space-y-5">
        {/* Horizontal Week Strip */}
        <div className="app-card flex items-center justify-between gap-2 p-2.5 rounded-[22px] shadow-sm">
          {weekDays.map((date) => {
            const isToday =
              format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const isSelected =
              format(date, "yyyy-MM-dd") === selectedDateStr;

            const dayTasksCount = tasks.filter(
              (t) => t.date === format(date, "yyyy-MM-dd") && t.status !== "done"
            ).length;

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center transition-all interactive-tap relative ${
                  isSelected
                    ? "bg-[#6C5CE7] text-white font-extrabold shadow-sm"
                    : "app-text-muted hover:bg-[#E3DEF8]/40"
                }`}
              >
                <span className="text-[11px] md:text-[12px] font-semibold uppercase">
                  {format(date, "EEE")}
                </span>
                <span className={`text-[15px] md:text-[18px] font-bold mt-0.5 ${isSelected ? "text-white" : "app-text-ink"}`}>
                  {format(date, "d")}
                </span>

                {dayTasksCount > 0 && !isSelected && (
                  <span className="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline Day View */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="app-text-ink text-[14px] md:text-[16px] font-extrabold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#6C5CE7]" />
              Schedule for {format(selectedDate, "EEEE, MMMM d")} ({dayTasks.length} tasks)
            </span>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="text-[13px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          {/* Real-time "Now" Line indicator */}
          <div className="relative py-2 flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#6C5CE7] shadow-sm -ml-1.5" />
            <div className="flex-1 h-[2px] bg-[#6C5CE7]" />
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#6C5CE7] text-white rounded-full ml-1.5">
              TIMELINE
            </span>
          </div>

          {/* Dynamic Day Task Blocks */}
          {dayTasks.length > 0 ? (
            <div className="space-y-3">
              {dayTasks.map((task) => {
                const isAmber = task.color === "amber";
                const isGreen = task.color === "green";

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-4 md:p-5 rounded-[20px] shadow-sm flex items-start justify-between cursor-pointer transition-all interactive-tap border ${
                      isAmber
                        ? "bg-[#FFE3B0] dark:bg-[#2C2417] text-[#1C1B29] dark:text-[#FFE3B0] border-[#FFB84D]/30"
                        : isGreen
                        ? "bg-[#CFEBDD] dark:bg-[#152B20] text-[#1C1B29] dark:text-[#CFEBDD] border-[#10B981]/30"
                        : "bg-[#D9D3F7] dark:bg-[#24203D] text-[#1C1B29] dark:text-[#D9D3F7] border-[#6C5CE7]/30"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] md:text-[13px] font-extrabold">
                          {task.time} ({task.durationMin} min)
                        </span>
                        {task.hasAlarm && (
                          <span className="flex items-center gap-1 text-[11px] md:text-[12px] font-semibold">
                            <Bell className="w-3 h-3" /> Gentle alarm
                          </span>
                        )}
                        {task.status === "done" && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        )}
                      </div>
                      <h4 className="text-[15px] md:text-[17px] font-extrabold leading-snug">
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-[12px] md:text-[13px] opacity-90 font-medium">
                          {task.notes}
                        </p>
                      )}
                      {task.subtasks.length > 0 && (
                        <p className="text-[11px] opacity-75 font-semibold pt-0.5">
                          {task.subtasks.filter((s) => s.completed).length} of {task.subtasks.length} steps completed
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="app-card p-8 rounded-[24px] text-center space-y-3">
              <CalendarIcon className="w-10 h-10 text-[#6C5CE7] mx-auto opacity-60" />
              <h4 className="app-text-ink text-[16px] font-extrabold">
                No tasks on {format(selectedDate, "MMMM d")}
              </h4>
              <p className="app-text-muted text-[13px]">
                Enjoy your calm schedule or plan something gentle.
              </p>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-5 py-2.5 bg-[#6C5CE7] text-white rounded-full font-bold text-[13px] inline-flex items-center gap-1.5 interactive-tap shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task for this day</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Quick-Add button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-6 md:right-10 w-14 h-14 bg-[#1C1B29] dark:bg-[#6C5CE7] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all interactive-tap z-40 border border-[#3A3856]"
          aria-label="Quick Add Task"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </main>
    </div>
  );
}
