"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

interface PointsChipProps {
  className?: string;
}

export function PointsChip({ className = "" }: PointsChipProps) {
  const points = useAppStore((s) => s.user.points);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1B29] text-[#FFB84D] rounded-full text-[13px] font-extrabold tracking-wide shadow-sm select-none ${className}`}
      aria-label={`${points} total points`}
    >
      <Sparkles className="w-3.5 h-3.5 text-[#FFB84D] fill-[#FFB84D]" />
      <span>{points} pts</span>
    </div>
  );
}
