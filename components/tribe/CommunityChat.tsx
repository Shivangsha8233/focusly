"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Users, Sparkles, Flame, MessageCircle, Heart } from "lucide-react";
import { ChatMessage, PeerProfile } from "@/lib/types/chat";
import { INITIAL_COMMUNITY_MESSAGES, PEER_PROFILES } from "@/lib/data/mockPeers";
import { useAppStore } from "@/lib/store/useAppStore";

interface CommunityChatProps {
  onOpenPeerChat: (peer: PeerProfile) => void;
}

export function CommunityChat({ onOpenPeerChat }: CommunityChatProps) {
  const { user, addPoints, tasks, activeTaskId } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTask = tasks.find((t) => t.id === activeTaskId && t.status === "doing");

  useEffect(() => {
    const saved = localStorage.getItem("focusly_community_chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {
        // fallback
      }
    }
    setMessages(INITIAL_COMMUNITY_MESSAGES);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem("focusly_community_chat", JSON.stringify(msgs));
    } catch {
      // ignore
    }
  };

  const handleSendMessage = (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-cm-${Date.now()}`,
      senderId: "alex-you",
      senderName: user.displayName || "Alex",
      senderAvatarBg: "#E3DEF8",
      senderAvatarColor: "#6C5CE7",
      text,
      timestamp: "Just now",
      isCurrentUser: true,
    };

    const nextMessages = [...messages, userMsg];
    saveMessages(nextMessages);
    setInputText("");

    addPoints(2, "Shared encouragement in Tribe");
    setCheerNotice("+2 pts • Community Cheer");
    setTimeout(() => setCheerNotice(null), 2500);

    // Simulated peer cheer response after 2.5 seconds
    setTimeout(() => {
      const peers = PEER_PROFILES;
      const randomPeer = peers[Math.floor(Math.random() * peers.length)];
      const peerCheers = [
        `You've got this ${user.displayName || "Alex"}! Let's get that done together! 🙌`,
        `Cheering for you from the focus room! 🔥`,
        `Rooting for you! Remember: just start with 5 minutes! 🚀`,
        `High five on showing up today! 🌟`,
      ];
      const peerMsg: ChatMessage = {
        id: `peer-cm-${Date.now()}`,
        senderId: randomPeer.id,
        senderName: randomPeer.name,
        senderAvatarBg: randomPeer.avatarBg,
        senderAvatarColor: randomPeer.avatarColor,
        text: peerCheers[Math.floor(Math.random() * peerCheers.length)],
        timestamp: "Just now",
        isCurrentUser: false,
        cheerReaction: "👏 2",
      };
      saveMessages([...nextMessages, peerMsg]);
    }, 2200);
  };

  const handleShareCurrentTask = () => {
    if (!activeTask) {
      handleSendMessage("Starting a new focus sprint right now! Who's with me? 🚀");
    } else {
      handleSendMessage(`Focusing on: "${activeTask.title}" (${activeTask.durationMin}m block)! Let's do this! 💪`);
    }
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    const updated = messages.map((m) => {
      if (m.id === msgId) {
        return {
          ...m,
          cheerReaction: m.cheerReaction ? `${m.cheerReaction} ${emoji}` : `${emoji} 1`,
        };
      }
      return m;
    });
    saveMessages(updated);
    addPoints(1, "Reacted to peer");
  };

  return (
    <div className="app-card rounded-[24px] shadow-sm border flex flex-col overflow-hidden h-[540px]">
      {/* Lounge Header */}
      <div className="p-4 border-b app-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7]/15 text-[#6C5CE7] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="app-text-ink text-[15px] font-extrabold leading-none">
                Focus Lounge Chat
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="app-text-muted text-[11px] font-medium mt-1">
              Live body doubling & peer encouragement
            </p>
          </div>
        </div>

        {cheerNotice && (
          <span className="text-[11px] font-extrabold text-[#6C5CE7] bg-[#6C5CE7]/15 px-2.5 py-1 rounded-full animate-bounce">
            {cheerNotice}
          </span>
        )}
      </div>

      {/* Share Focus Prompt Banner */}
      <div className="px-4 py-2 bg-[#6C5CE7]/10 border-b border-[#6C5CE7]/15 flex items-center justify-between">
        <span className="app-text-ink text-[12px] font-semibold truncate max-w-[220px]">
          {activeTask ? `Active: ${activeTask.title}` : "Ready to focus?"}
        </span>
        <button
          onClick={handleShareCurrentTask}
          className="text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 interactive-tap"
        >
          <Sparkles className="w-3 h-3" />
          Share to Chat (+2 pts)
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const peer = PEER_PROFILES.find((p) => p.id === msg.senderId);

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!msg.isCurrentUser && (
                <button
                  onClick={() => peer && onOpenPeerChat(peer)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black flex-shrink-0 shadow-sm mt-0.5 hover:scale-105 transition-all interactive-tap"
                  style={{ backgroundColor: msg.senderAvatarBg, color: msg.senderAvatarColor }}
                  title={`Click to chat directly with ${msg.senderName}`}
                >
                  {msg.senderName.charAt(0)}
                </button>
              )}

              <div className="max-w-[80%] space-y-1">
                <div
                  className={`rounded-[18px] p-3 text-[13px] leading-relaxed shadow-sm ${
                    msg.isCurrentUser
                      ? "bg-[#6C5CE7] text-white rounded-tr-sm font-medium"
                      : "app-surface app-text-ink rounded-tl-sm border"
                  }`}
                >
                  {!msg.isCurrentUser && (
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <button
                        onClick={() => peer && onOpenPeerChat(peer)}
                        className="text-[11px] font-extrabold text-[#6C5CE7] hover:underline flex items-center gap-1"
                      >
                        {msg.senderName}
                        {peer && (
                          <span className="text-[10px] app-text-muted font-normal">
                            #{peer.rank}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => peer && onOpenPeerChat(peer)}
                        className="text-[10px] text-[#6C5CE7] font-bold hover:opacity-80 flex items-center gap-0.5"
                      >
                        <MessageCircle className="w-2.5 h-2.5" />
                        PM
                      </button>
                    </div>
                  )}

                  <p>{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      msg.isCurrentUser ? "text-white/70" : "app-text-muted"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Reaction / Cheer Chips */}
                <div
                  className={`flex items-center gap-1.5 px-1 ${
                    msg.isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.cheerReaction && (
                    <span className="text-[11px] app-surface px-2 py-0.5 rounded-full border shadow-2xs font-semibold">
                      {msg.cheerReaction}
                    </span>
                  )}
                  {!msg.isCurrentUser && (
                    <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                      {["🔥", "👏", "☕"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-[11px]"
                          aria-label={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Cheer Shortcuts */}
      <div className="p-2 app-surface border-t border-b overflow-x-auto flex gap-1.5 no-scrollbar">
        {[
          "🔥 Keep going everyone!",
          "🎧 In the quiet room doubling",
          "☕ Drink some water!",
          "💪 25m sprint starting now",
        ].map((cheer, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(cheer)}
            className="text-[11px] font-bold px-2.5 py-1 rounded-full app-card border hover:border-[#6C5CE7] hover:text-[#6C5CE7] app-text-ink transition-all flex-shrink-0 interactive-tap shadow-xs"
          >
            {cheer}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 app-surface flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Send a cheer or focus update..."
          className="flex-1 app-card border app-text-ink px-4 py-2.5 rounded-full text-[13px] outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 shadow-inner"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] disabled:opacity-40 text-white flex items-center justify-center transition-all interactive-tap flex-shrink-0 shadow-sm"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
