"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { PointsChip } from "@/components/ui/PointsChip";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showPoints?: boolean;
}

export function AppHeader({ title, subtitle, showPoints = true }: AppHeaderProps) {
  const { user, theme, setTheme } = useAppStore();

  const [timeGreeting, setTimeGreeting] = React.useState("Today");

  React.useEffect(() => {
    const now = new Date();
    const day = format(now, "EEEE");
    const hour = now.getHours();
    let period = "morning";
    if (hour >= 12 && hour < 17) period = "afternoon";
    else if (hour >= 17) period = "evening";
    setTimeGreeting(`${day} ${period}`);
  }, []);

  const displaySubtitle = subtitle ?? timeGreeting;
  const displayTitle = title ?? `Hi ${user.displayName}`;

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <header className="pt-6 pb-4 px-6 flex items-start justify-between">
      <div className="space-y-0.5">
        <p className="app-text-muted text-[13px] font-semibold tracking-tight">
          {displaySubtitle}
        </p>
        <h1 className="app-text-ink text-[26px] leading-tight font-extrabold tracking-tight">
          {displayTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="app-surface w-9 h-9 rounded-full flex items-center justify-center interactive-tap"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-[#FFB84D]" /> : <Moon className="w-4 h-4" />}
        </button>

        {showPoints && <PointsChip />}
      </div>
    </header>
  );
}
