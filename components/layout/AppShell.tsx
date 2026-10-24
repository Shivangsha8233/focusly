"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { TodayView } from "@/components/views/TodayView";
import { CalendarView } from "@/components/views/CalendarView";
import { TribeView } from "@/components/views/TribeView";
import { SparkView } from "@/components/views/SparkView";
import { QuickAddSheet } from "@/components/tasks/QuickAddSheet";
import { TaskDetailSheet } from "@/components/tasks/TaskDetailSheet";

export function AppShell() {
  const { activeTab, theme, setTheme } = useAppStore();

  useEffect(() => {
    // Sync initial theme
    const isDark =
      theme === "dark" ||
      (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);

    // Register simple PWA service worker if supported
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.log("SW registration skipped:", err));
    }
  }, [theme]);

  const renderActiveView = () => {
    switch (activeTab) {
      case "today":
        return <TodayView />;
      case "calendar":
        return <CalendarView />;
      case "tribe":
        return <TribeView />;
      case "spark":
        return <SparkView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex justify-center selection:bg-[#E3DEF8]">
      {/* Desktop Shell: Side Navigation + Main Content Area */}
      <div className="w-full flex justify-center max-w-[1440px]">
        {/* Desktop Sidebar (hidden on mobile) */}
        <DesktopSidebar />

        {/* Main Content Column (Mobile 390px-440px, Desktop expands to 768px-960px) */}
        <div className="flex-1 w-full max-w-[440px] md:max-w-3xl lg:max-w-4xl min-h-screen relative flex flex-col md:border-r border-[var(--nav-border)]">
          {/* Active View */}
          <div className="flex-1 w-full">{renderActiveView()}</div>

          {/* 84px Mobile Bottom Navigation (hidden on desktop) */}
          <BottomNav />
        </div>
      </div>

      {/* Task Creation & Detail Modals */}
      <QuickAddSheet />
      <TaskDetailSheet />
    </div>
  );
}
