"use client";

import React, { useState } from "react";
import { Sparkles, Send, CheckCircle2, ArrowRight, ShieldAlert, Loader2, Info } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppStore } from "@/lib/store/useAppStore";
import { askSpark } from "@/lib/ai/adapter";

interface Message {
  id: string;
  sender: "spark" | "user";
  text: string;
  checklist?: string[];
  isMedicationWarning?: boolean;
  isCrisisAlert?: boolean;
}

const QUICK_ACTIONS = [
  "I'm low on energy",
  "I can't start",
  "I'm overwhelmed",
  "Break down a task",
  "Plan my day",
  "Celebrate with me",
];

export function SparkView() {
  const { addPoints } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "spark",
      text: "Hey Alex! I'm Spark, your calm ADHD buddy. No pressure and zero guilt here, ever. How's your head feeling today, or is there something we can untangle together?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedChecklists, setAddedChecklists] = useState<Record<string, boolean>>({});

  const handleSend = async (textToSend?: string) => {
    const text = textToSend ?? input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await askSpark(text.trim());

      const isMed = data.safetyResult?.type === "medication";
      const isCrisis = data.safetyResult?.type === "crisis";

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "spark",
        text: data.text,
        checklist: data.checklist,
        isMedicationWarning: isMed,
        isCrisisAlert: isCrisis,
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "spark",
        text: "I'm here with you. Take a gentle breath. Let's pick just ONE tiny step under 2 minutes to start building momentum.",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChecklist = (msgId: string) => {
    if (addedChecklists[msgId]) return;
    addPoints(5, "Adopted Spark mini-steps");
    setAddedChecklists((prev) => ({ ...prev, [msgId]: true }));
  };

  return (
    <div className="pb-36 md:pb-28 flex flex-col min-h-screen">
      <AppHeader title="Spark" subtitle="Calm AI Copilot" />

      {/* Main chat column */}
      <main className="flex-1 px-5 md:px-8 space-y-4 max-w-3xl w-full mx-auto">
        {/* Medical & Scope Disclaimer Banner */}
        <div className="app-surface p-3 rounded-2xl flex items-center gap-2.5 text-[11px] md:text-[12px] app-text-muted">
          <Info className="w-4 h-4 text-[#6C5CE7] flex-shrink-0" />
          <p>
            Spark is a gentle motivation & task helper. It does not provide medical advice or suggest medications.
          </p>
        </div>

        {/* Quick action chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              disabled={isLoading}
              className="app-card flex-shrink-0 px-4 py-2 rounded-full text-[12px] md:text-[13px] font-bold hover:bg-[#6C5CE7] hover:text-white transition-all interactive-tap shadow-sm disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="space-y-4 pt-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "spark" && (
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 ${
                    msg.isCrisisAlert
                      ? "bg-rose-600 text-white"
                      : msg.isMedicationWarning
                      ? "bg-amber-600 text-white"
                      : "bg-[#6C5CE7] text-white"
                  }`}
                >
                  {msg.isCrisisAlert || msg.isMedicationWarning ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#FFB84D]" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-[22px] text-[14px] md:text-[15px] leading-relaxed font-medium shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#6C5CE7] text-white rounded-tr-none"
                    : msg.isCrisisAlert
                    ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100 rounded-tl-none whitespace-pre-line"
                    : msg.isMedicationWarning
                    ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100 rounded-tl-none"
                    : "app-card rounded-tl-none"
                }`}
              >
                <p>{msg.text}</p>

                {/* Micro Steps Checklist */}
                {msg.checklist && (
                  <div className="mt-3.5 pt-3.5 border-t border-[var(--card-border)] space-y-2.5">
                    <span className="text-[11px] md:text-[12px] font-extrabold uppercase tracking-wider text-[#6C5CE7]">
                      Tiny micro-steps:
                    </span>
                    {msg.checklist.map((step, idx) => (
                      <div
                        key={idx}
                        className="app-surface flex items-center gap-2.5 text-[13px] p-2.5 rounded-xl font-semibold"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#6C5CE7] flex-shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddChecklist(msg.id)}
                      disabled={addedChecklists[msg.id]}
                      className={`w-full mt-1.5 py-2.5 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-all interactive-tap shadow-sm ${
                        addedChecklists[msg.id]
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-[#6C5CE7] hover:bg-[#5A49E0] text-white"
                      }`}
                    >
                      {addedChecklists[msg.id] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Added to today (+5 pts awarded!)</span>
                        </>
                      ) : (
                        <>
                          <span>Add to today (+5 pts)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4 text-[#FFB84D]" />
              </div>
              <div className="app-card px-4 py-3 rounded-[22px] rounded-tl-none shadow-sm flex items-center gap-2 text-[13px] app-text-muted">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6C5CE7]" />
                <span>Spark is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Chat Input: Mobile floats above 84px nav; Desktop sits above bottom with sidebar offset */}
      <div className="fixed bottom-[84px] md:bottom-6 left-0 right-0 md:left-64 lg:md:left-72 z-40 flex justify-center pointer-events-none px-4 md:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="app-card w-full max-w-2xl pointer-events-auto flex items-center gap-2 p-2 rounded-full shadow-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type how you feel, or ask to break down a task..."
            className="flex-1 bg-transparent px-4 py-2.5 text-[14px] md:text-[15px] app-text-ink placeholder:text-[#5B5970] dark:placeholder:text-[#A8A5BD] outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-[#6C5CE7] hover:bg-[#5A49E0] text-white flex items-center justify-center disabled:opacity-40 interactive-tap shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
