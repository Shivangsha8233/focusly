"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Flame, CheckCircle2, MessageCircle } from "lucide-react";
import { PeerProfile, ChatMessage } from "@/lib/types/chat";
import { generatePeerReply } from "@/lib/data/mockPeers";
import { useAppStore } from "@/lib/store/useAppStore";

interface PeerChatModalProps {
  peer: PeerProfile | null;
  onClose: () => void;
}

export function PeerChatModal({ peer, onClose }: PeerChatModalProps) {
  const { addPoints } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with the peer
  useEffect(() => {
    if (!peer) return;

    // Check localStorage for saved messages with this peer
    const saved = localStorage.getItem(`focusly_chat_${peer.id}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {
        // fallback to default
      }
    }

    // Default opening messages
    const initial: ChatMessage[] = [
      {
        id: `init-${peer.id}-1`,
        senderId: peer.id,
        senderName: peer.name,
        senderAvatarBg: peer.avatarBg,
        senderAvatarColor: peer.avatarColor,
        text: `Hey Alex! I'm currently working on "${peer.focusTask}". How's your focus going today?`,
        timestamp: "Just now",
        isCurrentUser: false,
      },
    ];
    setMessages(initial);
  }, [peer]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!peer) return null;

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem(`focusly_chat_${peer.id}`, JSON.stringify(msgs));
    } catch {
      // ignore
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      senderId: "alex-you",
      senderName: "Alex",
      senderAvatarBg: "#E3DEF8",
      senderAvatarColor: "#6C5CE7",
      text,
      timestamp: "Just now",
      isCurrentUser: true,
    };

    const nextMessages = [...messages, userMsg];
    saveMessages(nextMessages);
    setInputText("");

    // Award +2 points for motivating/cheering peers
    addPoints(2, `Cheered ${peer.name}`);
    setCheerNotice("+2 pts • Tribe Motivation");
    setTimeout(() => setCheerNotice(null), 2500);

    // Simulate peer typing & response
    setIsTyping(true);
    setTimeout(() => {
      const replyText = generatePeerReply(peer, text);
      const peerMsg: ChatMessage = {
        id: `peer-${Date.now()}`,
        senderId: peer.id,
        senderName: peer.name,
        senderAvatarBg: peer.avatarBg,
        senderAvatarColor: peer.avatarColor,
        text: replyText,
        timestamp: "Just now",
        isCurrentUser: false,
      };
      setIsTyping(false);
      saveMessages([...nextMessages, peerMsg]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg app-card rounded-[28px] shadow-2xl border flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label={`Chat with ${peer.name}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b app-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[15px] font-black shadow-sm relative flex-shrink-0"
              style={{ backgroundColor: peer.avatarBg, color: peer.avatarColor }}
            >
              {peer.name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1E1C2E]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="app-text-ink text-[16px] font-extrabold leading-none">
                  {peer.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#1C1B29] text-[#FFB84D] text-[11px] font-extrabold">
                  #{peer.rank} • {peer.points} pts
                </span>
              </div>
              <p className="app-text-muted text-[12px] font-medium flex items-center gap-1.5 mt-1">
                <span className="flex items-center gap-0.5 text-[#FFB84D] font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {peer.streak}d streak
                </span>
                <span>•</span>
                <span className="truncate max-w-[200px]">{peer.focusTask}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cheerNotice && (
              <span className="text-[11px] font-extrabold text-[#6C5CE7] bg-[#6C5CE7]/15 px-2.5 py-1 rounded-full animate-bounce">
                {cheerNotice}
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full app-surface hover:opacity-80 flex items-center justify-center app-text-muted transition-all"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Peer Status Pill Banner */}
        <div className="px-5 py-2.5 bg-[#6C5CE7]/10 border-b border-[#6C5CE7]/15 flex items-center justify-between text-[12px]">
          <span className="app-text-ink font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
            {peer.bio}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[260px] max-h-[380px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {!msg.isCurrentUser && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 shadow-sm mt-0.5"
                  style={{ backgroundColor: msg.senderAvatarBg, color: msg.senderAvatarColor }}
                >
                  {msg.senderName.charAt(0)}
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-[18px] p-3.5 text-[13px] leading-relaxed shadow-sm ${
                  msg.isCurrentUser
                    ? "bg-[#6C5CE7] text-white rounded-tr-sm font-medium"
                    : "app-surface app-text-ink rounded-tl-sm border"
                }`}
              >
                {!msg.isCurrentUser && (
                  <p className="text-[11px] font-extrabold text-[#6C5CE7] mb-1">
                    {msg.senderName}
                  </p>
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
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center text-[12px] app-text-muted">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 shadow-sm"
                style={{ backgroundColor: peer.avatarBg, color: peer.avatarColor }}
              >
                {peer.name.charAt(0)}
              </div>
              <div className="app-surface border px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-semibold ml-1">{peer.name} is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Cheer / Question Prompts */}
        <div className="p-3 bg-black/5 dark:bg-white/5 border-t border-b overflow-x-auto flex gap-1.5 no-scrollbar">
          {peer.quickCheers.map((cheer, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(cheer)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full app-card border hover:border-[#6C5CE7] hover:text-[#6C5CE7] app-text-ink transition-all flex-shrink-0 interactive-tap shadow-xs"
            >
              {cheer}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 sm:p-4 app-surface flex items-center gap-2">
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
            placeholder={`Send encouragement to ${peer.name}...`}
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
    </div>
  );
}
