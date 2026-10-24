"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Users, Flame, Heart } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppStore } from "@/lib/store/useAppStore";

type TribeSegment = "today" | "week" | "all";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarBg: string;
  avatarColor: string;
  tasksDone: number;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Maya R.",
    avatarBg: "#FFE3B0",
    avatarColor: "#7E5700",
    tasksDone: 6,
    streak: 12,
    points: 240,
  },
  {
    rank: 2,
    name: "Alex (You)",
    avatarBg: "#E3DEF8",
    avatarColor: "#6C5CE7",
    tasksDone: 4,
    streak: 4,
    points: 120,
    isCurrentUser: true,
  },
  {
    rank: 3,
    name: "Kiran P.",
    avatarBg: "#CFEBDD",
    avatarColor: "#1D5E3B",
    tasksDone: 3,
    streak: 9,
    points: 110,
  },
  {
    rank: 4,
    name: "Sam T.",
    avatarBg: "#F4F1FA",
    avatarColor: "#1C1B29",
    tasksDone: 3,
    streak: 2,
    points: 85,
  },
];

export function TribeView() {
  const [segment, setSegment] = useState<TribeSegment>("today");
  const { user } = useAppStore();

  return (
    <div className="pb-28 md:pb-12">
      <AppHeader title="Tribe" subtitle="Friendly peer motivation" />

      <main className="px-5 md:px-8 space-y-5 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
        {/* Left Column on Desktop (Col 1-7): Segmented Control & Leaderboard */}
        <div className="md:col-span-7 space-y-4">
          {/* Soft violet Segmented Control */}
          <div className="app-surface p-1 rounded-full flex items-center justify-between">
            {(["today", "week", "all"] as TribeSegment[]).map((seg) => {
              const labels: Record<TribeSegment, string> = {
                today: "Today",
                week: "This week",
                all: "All time",
              };
              const active = segment === seg;

              return (
                <button
                  key={seg}
                  onClick={() => setSegment(seg)}
                  className={`flex-1 py-2 text-[13px] rounded-full transition-all duration-200 interactive-tap ${
                    active
                      ? "app-card font-extrabold shadow-sm"
                      : "app-text-muted font-semibold"
                  }`}
                >
                  {labels[seg]}
                </button>
              );
            })}
          </div>

          {/* Leaderboard Table / Cards */}
          <section className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <h3 className="app-text-ink text-[14px] md:text-[15px] font-extrabold">
                Daily Leaderboard
              </h3>
              <span className="app-text-muted text-[12px] font-medium">
                Friendly rank • Personal best
              </span>
            </div>

            <div className="space-y-2.5">
              {MOCK_LEADERBOARD.map((member) => (
                <div
                  key={member.rank}
                  className={`p-3.5 md:p-4 rounded-[18px] transition-all flex items-center justify-between ${
                    member.isCurrentUser
                      ? "bg-[#6C5CE7]/15 border border-[#6C5CE7]/50"
                      : "app-card shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="app-text-muted w-5 text-center text-[13px] font-extrabold">
                      {member.rank}
                    </span>

                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold shadow-sm"
                      style={{ backgroundColor: member.avatarBg, color: member.avatarColor }}
                    >
                      {member.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="app-text-ink text-[14px] md:text-[15px] font-bold leading-snug">
                        {member.name}
                      </h4>
                      <p className="app-text-muted text-[11px] md:text-[12px] font-semibold flex items-center gap-1.5 mt-0.5">
                        <span>{member.tasksDone} done today</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-[#FFB84D]">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {member.streak}d streak
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-[#1C1B29] text-[#FFB84D] border border-[#3A3856] rounded-full text-[12px] font-extrabold">
                      {member.points}
                    </div>

                    {!member.isCurrentUser && (
                      <button
                        className="h-8 px-3 rounded-full border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white text-[12px] font-bold transition-all interactive-tap flex items-center gap-1"
                        aria-label={`Ask ${member.name}`}
                      >
                        <MessageSquarePlus className="w-3 h-3" />
                        Ask
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column on Desktop (Col 8-12): Body Doubling & Routine Posts */}
        <div className="md:col-span-5 space-y-4">
          {/* Live Body Doubling Room */}
          <div className="app-card p-4 md:p-5 rounded-[22px] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#6C5CE7]/15 flex items-center justify-center text-[#6C5CE7]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="app-text-ink text-[14px] md:text-[15px] font-extrabold">
                  Quiet Focus Room
                </p>
                <p className="app-text-muted text-[12px] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  14 people working right now
                </p>
              </div>
            </div>
            <button className="h-9 px-4 rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white text-[13px] font-bold interactive-tap shadow-sm">
              Join (25m)
            </button>
          </div>

          {/* Routine Post Card */}
          <div className="app-card p-4 md:p-5 rounded-[20px] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#6C5CE7] uppercase tracking-wider">
                Routine Share
              </span>
              <span className="app-text-muted text-[11px]">
                2h ago
              </span>
            </div>
            <p className="app-text-ink text-[13px] md:text-[14px] font-semibold leading-relaxed">
              &quot;Whenever my brain refuses to start deep work, I set a 3-minute timer just to open the editor and name 1 variable. It breaks the inertia 90% of the time!&quot;
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5">
                <span className="app-surface px-2.5 py-0.5 text-[11px] font-semibold rounded-md">
                  #morning
                </span>
                <span className="app-surface px-2.5 py-0.5 text-[11px] font-semibold rounded-md">
                  #focus
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-bold text-[#6C5CE7] hover:opacity-80 interactive-tap">
                <Heart className="w-3.5 h-3.5 fill-[#6C5CE7]" />
                Helpful (18)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
