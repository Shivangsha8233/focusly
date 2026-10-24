"use client";

import React from "react";
import {
  CheckCircle2,
  CalendarDays,
  Users2,
  Sparkles,
  Sun,
  Moon,
  Flame,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { useAppStore, TabType } from "@/lib/store/useAppStore";
import { PointsChip } from "@/components/ui/PointsChip";

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "today", label: "Today", icon: CheckCircle2, description: "Focus & countdown" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, description: "Timeline & routines" },
  { id: "tribe", label: "Tribe", icon: Users2, description: "Community & double" },
  { id: "spark", label: "Spark", icon: Sparkles, description: "Calm AI helper" },
];

export function DesktopSidebar() {
  const {
    activeTab,
    setActiveTab,
    user,
    theme,
    setTheme,
    toggleBadDayMode,
    setIsQuickAddOpen,
  } = useAppStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 app-nav border-r p-6 justify-between flex-shrink-0 select-none z-30">
      {/* Brand & Points */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center shadow-md shadow-[#6C5CE7]/20">
              <Sparkles className="w-5 h-5 text-[#FFB84D]" />
            </div>
            <div>
              <span className="text-[20px] font-extrabold tracking-tight app-text-ink leading-none">
                Focusly
              </span>
              <p className="text-[11px] font-semibold app-text-muted mt-0.5">
                Calm ADHD Copilot
              </p>
            </div>
          </div>
          <PointsChip />
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5A49E0] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-[#6C5CE7]/25 interactive-tap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Desktop Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all duration-200 interactive-tap ${
                  isActive
                    ? "bg-[#6C5CE7] text-white font-extrabold shadow-md shadow-[#6C5CE7]/25"
                    : "app-text-muted hover:app-text-ink hover:bg-[#E3DEF8]/40 dark:hover:bg-[#2B2744]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] leading-tight font-bold">{item.label}</div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? "text-white/80" : "opacity-75"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Status & Preferences Footer */}
      <div className="space-y-3 pt-6 border-t border-[var(--nav-border)]">
        {/* Streak & Bad Day Mode Quick Pill */}
        <div className="app-card p-3 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFE3B0] dark:bg-[#3E3320] flex items-center justify-center text-[#FFB84D]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className="text-[12px] font-extrabold app-text-ink leading-tight">
                {user.streak}-Day Streak
              </p>
              <p className="text-[10px] app-text-muted font-medium">
                {user.streakFreezes} freeze available
              </p>
            </div>
          </div>

          <button
            onClick={toggleBadDayMode}
            title={user.badDayMode ? "Bad day mode is ON" : "Turn on Bad day mode"}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all interactive-tap ${
              user.badDayMode
                ? "bg-[#6C5CE7] text-white"
                : "app-surface app-text-muted hover:app-text-ink"
            }`}
          >
            {user.badDayMode ? "Gentle ON" : "Bad Day?"}
          </button>
        </div>

        {/* User Card & Theme Switcher */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7] flex items-center justify-center font-extrabold text-[14px]">
              {user.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold app-text-ink truncate">
                {user.displayName}
              </p>
              <p className="text-[11px] app-text-muted truncate">Free Explorer</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="app-surface w-9 h-9 rounded-full flex items-center justify-center interactive-tap"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#FFB84D]" />
            ) : (
              <Moon className="w-4 h-4 text-[#5B5970]" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
