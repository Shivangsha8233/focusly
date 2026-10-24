"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Users, Flame, Heart, MessageCircle, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppStore } from "@/lib/store/useAppStore";
import { PEER_PROFILES } from "@/lib/data/mockPeers";
import { PeerProfile } from "@/lib/types/chat";
import { PeerChatModal } from "@/components/tribe/PeerChatModal";
import { CommunityChat } from "@/components/tribe/CommunityChat";

type TribeSegment = "today" | "week" | "all";
type TribeTab = "leaderboard" | "chat";

export function TribeView() {
  const [segment, setSegment] = useState<TribeSegment>("today");
  const [mobileTab, setMobileTab] = useState<TribeTab>("leaderboard");
  const [activePeer, setActivePeer] = useState<PeerProfile | null>(null);
  const { user } = useAppStore();

  const handleOpenPeerChat = (peer: PeerProfile) => {
    setActivePeer(peer);
  };

  return (
    <div className="pb-28 md:pb-12">
      <AppHeader
        title="Tribe"
        subtitle="Friendly peer motivation & body doubling"
      />

      {/* Mobile Tab Switcher: Leaderboard vs Live Lounge */}
      <div className="px-5 mb-4 md:hidden">
        <div className="app-surface p-1 rounded-full flex items-center justify-between">
          <button
            onClick={() => setMobileTab("leaderboard")}
            className={`flex-1 py-2 text-[13px] rounded-full transition-all duration-200 interactive-tap flex items-center justify-center gap-1.5 ${
              mobileTab === "leaderboard"
                ? "app-card font-extrabold shadow-sm"
                : "app-text-muted font-semibold"
            }`}
          >
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-2 text-[13px] rounded-full transition-all duration-200 interactive-tap flex items-center justify-center gap-1.5 ${
              mobileTab === "chat"
                ? "app-card font-extrabold shadow-sm"
                : "app-text-muted font-semibold"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>Lounge Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

      <main className="px-5 md:px-8 space-y-5 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
        {/* Left Column on Desktop (Col 1-7): Segmented Control & Leaderboard */}
        <div
          className={`md:col-span-7 space-y-4 ${
            mobileTab === "chat" ? "hidden md:block" : "block"
          }`}
        >
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
                Tap member to chat or cheer
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Current User Row */}
              <div className="p-3.5 md:p-4 rounded-[18px] transition-all flex items-center justify-between bg-[#6C5CE7]/15 border border-[#6C5CE7]/50 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <span className="app-text-muted w-5 text-center text-[13px] font-extrabold">
                    2
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold shadow-sm bg-[#E3DEF8] text-[#6C5CE7]">
                    A
                  </div>
                  <div>
                    <h4 className="app-text-ink text-[14px] md:text-[15px] font-bold leading-snug">
                      {user.displayName} (You)
                    </h4>
                    <p className="app-text-muted text-[11px] md:text-[12px] font-semibold flex items-center gap-1.5 mt-0.5">
                      <span>4 done today</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-[#FFB84D]">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {user.streak}d streak
                      </span>
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 bg-[#1C1B29] text-[#FFB84D] border border-[#3A3856] rounded-full text-[12px] font-extrabold">
                  {user.points}
                </div>
              </div>

              {/* Peers Rows */}
              {PEER_PROFILES.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 md:p-4 rounded-[18px] transition-all flex items-center justify-between app-card shadow-sm hover:border-[#6C5CE7]/40 border"
                >
                  <button
                    onClick={() => handleOpenPeerChat(member)}
                    className="flex items-center gap-3.5 text-left flex-1 interactive-tap"
                  >
                    <span className="app-text-muted w-5 text-center text-[13px] font-extrabold">
                      {member.rank}
                    </span>

                    {/* Avatar with live status */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold shadow-sm"
                        style={{ backgroundColor: member.avatarBg, color: member.avatarColor }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1E1C2E]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="app-text-ink text-[14px] md:text-[15px] font-bold leading-snug">
                          {member.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          Online
                        </span>
                      </div>
                      <p className="app-text-muted text-[11px] md:text-[12px] font-semibold flex items-center gap-1.5 mt-0.5">
                        <span>{member.tasksDone} done</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-[#FFB84D]">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          {member.streak}d
                        </span>
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 bg-[#1C1B29] text-[#FFB84D] border border-[#3A3856] rounded-full text-[12px] font-extrabold">
                      {member.points}
                    </div>

                    <button
                      onClick={() => handleOpenPeerChat(member)}
                      className="h-8 px-3 rounded-full border border-[#6C5CE7] text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white text-[12px] font-bold transition-all interactive-tap flex items-center gap-1 shadow-2xs"
                      aria-label={`Chat with ${member.name}`}
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column on Desktop (Col 8-12): Community Live Chat & Body Doubling */}
        <div
          className={`md:col-span-5 space-y-4 ${
            mobileTab === "leaderboard" ? "hidden md:block" : "block"
          }`}
        >
          {/* Live Community Chat */}
          <CommunityChat onOpenPeerChat={handleOpenPeerChat} />

          {/* Live Quiet Focus Room Card */}
          <div className="app-card p-4 md:p-5 rounded-[22px] shadow-sm flex items-center justify-between border">
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
            <button
              onClick={() => {
                setActivePeer(PEER_PROFILES[0]);
              }}
              className="h-9 px-4 rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white text-[13px] font-bold interactive-tap shadow-sm"
            >
              Join (25m)
            </button>
          </div>
        </div>
      </main>

      {/* 1-on-1 Peer Chat Drawer/Modal */}
      <PeerChatModal
        peer={activePeer}
        onClose={() => setActivePeer(null)}
      />
    </div>
  );
}
