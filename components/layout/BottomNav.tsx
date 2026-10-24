"use client";

import React from "react";
import { CheckCircle2, CalendarDays, Users2, Sparkles } from "lucide-react";
import { useAppStore, TabType } from "@/lib/store/useAppStore";

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "today", label: "Today", icon: CheckCircle2 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "tribe", label: "Tribe", icon: Users2 },
  { id: "spark", label: "Spark", icon: Sparkles },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
      aria-label="Main Navigation"
    >
      <div className="w-full max-w-[440px] h-[84px] px-6 app-nav border-t shadow-[0_-4px_24px_rgba(28,27,41,0.04)] flex items-center justify-between pointer-events-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all duration-200 rounded-2xl interactive-tap ${
                isActive
                  ? "text-[#6C5CE7]"
                  : "text-[#5B5970] hover:text-[#1C1B29] dark:hover:text-[#F4F1FA]"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-full transition-colors duration-200 ${
                  isActive ? "bg-[#E3DEF8]/60 dark:bg-[#6C5CE7]/20" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span
                className={`text-[12px] tracking-tight transition-all duration-200 ${
                  isActive ? "font-extrabold text-[#6C5CE7]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
