import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ShieldAlert } from "lucide-react";
import { PortfolioData } from "../types";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AiAssistantProps {
  portfolioData: PortfolioData;
}

export default function AiAssistant({ portfolioData }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      content: "Hello! I am Anand's AI Assistant, trained on his real academic achievements, open-source work, and programming skills. Ask me anything about. For example, 'What are his GSSoC contributions?' or 'How is he learning DSA?'",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/config")
        .then((res) => res.json())
        .then((data) => setIsConfigured(data.configured))
        .catch((err) => console.error("Error fetching config status:", err));
    }
  }, [isOpen]);

  const suggestionChips = [
    "Summarize GSSoC contributions?",
    "Anand's DSA learning roadmap?",
    "Provide his contact details?",
    "Why hire Anand for CSIT positions?"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          userProfile: {
            name: portfolioData.name,
            university: portfolioData.university,
            degree: portfolioData.degree,
            branch: portfolioData.branch,
            email: portfolioData.email,
            phone: portfolioData.phone,
            github: portfolioData.githubUsername,
            linkedin: portfolioData.linkedinUrl,
            leetcode: portfolioData.leetcodeUsername,
            hack2skill: portfolioData.hack2skillUsername,
            statsOverrides: portfolioData.statsOverrides,
            skills: portfolioData.skills.filter((s) => s.status === "Mastered" || s.status === "In Progress").map((s) => s.name),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Chat assistant failed to respond");
      }

      const responseData = await response.json();
      const aiReply: Message = {
        id: Math.random().toString(),
        sender: "ai",
        content: responseData.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          content: "Sorry, I had a small connection lag, but you can explore all of Anand's real achievements and statistics on this dashboard directly!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-assistant-root">
      {/* Floating button */}
      <motion.button
        id="ai-toggle-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Bot className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] flex flex-col rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-cyan-100 leading-tight flex items-center gap-1">
                    Anand's AI Co-Pilot <Sparkles className="h-3 w-3 text-cyan-400 fill-cyan-400" />
                  </h3>
                  <span className="text-xs text-cyan-400">Powered by Gemini 3.5</span>
                </div>
              </div>
              <button
                id="ai-close-inner"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800">
              {isConfigured === false && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs rounded-xl flex flex-col gap-1.5 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-bold">Gemini API Key Required</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal normal-case">
                    The AI Co-Pilot chat requires a valid Gemini API Key to function. Go to **Command Center** (the gear settings icon in the top right header) and configure your API key.
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-800 text-slate-300">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "bg-cyan-650 text-slate-50 rounded-br-none"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                    }`}
                  >
                    {message.content}
                    <div
                      className={`text-[10px] mt-1 text-slate-400 ${
                        message.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.sender === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-800 text-slate-300">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-slate-900 text-slate-300 border border-slate-800 px-3.5 py-2.5 rounded-xl rounded-bl-none text-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/50">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block mb-1">Quick Inquiries</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    id={`sug-chip-${idx}`}
                    onClick={() => handleSendMessage(chip)}
                    className="text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-800 hover:bg-slate-800/80 text-cyan-300 transition-colors text-left truncate max-w-full cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                id="ai-text-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                placeholder="Ask about Anand..."
                className="flex-1 px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                id="ai-send-button"
                onClick={() => handleSendMessage(inputValue)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
