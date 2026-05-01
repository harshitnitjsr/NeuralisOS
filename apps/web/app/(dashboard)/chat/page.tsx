"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Brain,
  Cpu,
  Shield,
  TrendingUp,
  Users,
  Gavel,
  Megaphone,
  Loader2,
  ChevronDown,
  Sparkles,
  Zap,
  Network,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const AGENT_ICONS: Record<string, React.ReactNode> = {
  Support: <Users className="w-3.5 h-3.5" />,
  DevOps: <Cpu className="w-3.5 h-3.5" />,
  Finance: <TrendingUp className="w-3.5 h-3.5" />,
  Legal: <Gavel className="w-3.5 h-3.5" />,
  HR: <Shield className="w-3.5 h-3.5" />,
  Marketing: <Megaphone className="w-3.5 h-3.5" />,
  Sales: <Sparkles className="w-3.5 h-3.5" />,
  unknown: <Bot className="w-3.5 h-3.5" />,
};

const AGENT_COLORS: Record<string, string> = {
  Support: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  DevOps: "text-orange-400 border-orange-400/20 bg-orange-400/10",
  Finance: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  Legal: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  HR: "text-pink-400 border-pink-400/20 bg-pink-400/10",
  Marketing: "text-amber-400 border-amber-400/20 bg-amber-400/10",
  Sales: "text-cyan-400 border-cyan-400/20 bg-cyan-400/10",
  unknown: "text-zinc-400 border-zinc-400/20 bg-zinc-400/10",
};

const MEMORY_LAYERS = [
  {
    label: "Qdrant Semantic",
    icon: <Brain className="w-3 h-3" />,
    color: "text-indigo-400",
  },
  {
    label: "Neo4j Graph",
    icon: <Network className="w-3 h-3" />,
    color: "text-cyan-400",
  },
  {
    label: "Mem0 Episodic",
    icon: <Zap className="w-3 h-3" />,
    color: "text-amber-400",
  },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  memoryFetched?: boolean;
  memoryContext?: string;
  timestamp: Date;
}

// Inner component that uses useSearchParams
function ChatInner() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("org_id") || "default_tenant";
  const orgName = searchParams.get("org_name") || "NeuralisOS";
  const orgCtx =
    searchParams.get("org_ctx") || "We are an autonomous AI organization.";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm the AI workforce for **${orgName}**. I can route your request to the best specialist — Support, DevOps, Finance, Legal, HR, Sales, or Marketing.`,
      agent: "unknown",
      memoryFetched: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [companyName, setCompanyName] = useState(orgName);
  const [companyContext, setCompanyContext] = useState(orgCtx);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/agents/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          tenant_id: orgId,
          user_id: "user_001",
          company_name: companyName,
          company_context: companyContext,
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "No response generated.",
          agent: data.next_agent || "unknown",
          memoryFetched: true,
          memoryContext: data.memory_context || "",
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Backend connection failed. Make sure the NeuralisOS API is running at ${API_BASE}. ${err instanceof Error ? err.message : ""}`,
          agent: "unknown",
          memoryFetched: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {orgId !== "default_tenant" && (
            <Link href="/organizations">
              <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <Building2 className="w-3.5 h-3.5" /> Organizations
              </button>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chat Terminal</h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              {orgId !== "default_tenant"
                ? `Org: ${companyName}`
                : "Multi-tenant AI workforce"}{" "}
              · Mem0 + Neo4j + Qdrant
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>{companyName}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showSettings ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.05] grid grid-cols-2 gap-5 shadow-sm">
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                  Company Name
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-black/50 border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                  Company Context
                </label>
                <input
                  value={companyContext}
                  onChange={(e) => setCompanyContext(e.target.value)}
                  className="w-full bg-black/50 border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-light"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Layer Status Bar */}
      <div className="flex-shrink-0 flex items-center gap-4 px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.05]">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest border-r border-white/10 pr-4">
          Memory Logic
        </span>
        <div className="flex items-center gap-5">
          {MEMORY_LAYERS.map((layer) => (
            <div
              key={layer.label}
              className={`flex items-center gap-1.5 text-xs font-medium ${layer.color}`}
            >
              {layer.icon}
              <span>{layer.label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />
            </div>
          ))}
        </div>
        {orgId !== "default_tenant" && (
          <span className="ml-auto text-[11px] text-zinc-600 font-mono bg-white/[0.02] px-2 py-0.5 rounded-md border border-white/[0.05]">
            tenant: {orgId.slice(0, 8)}…
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${
                  msg.role === "user"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-white/5 text-zinc-400 border border-white/10"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[70%] space-y-1.5 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}
              >
                {msg.role === "assistant" && msg.agent && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${AGENT_COLORS[msg.agent] || AGENT_COLORS.unknown}`}
                    >
                      {AGENT_ICONS[msg.agent] || AGENT_ICONS.unknown}
                      {msg.agent} Agent
                    </Badge>
                    {msg.memoryFetched && (
                      <span className="text-xs text-zinc-600 flex items-center gap-1">
                        <Brain className="w-3 h-3 text-indigo-500" /> Memory
                        injected
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`px-5 py-3.5 rounded-[20px] text-sm leading-[1.6] shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-sm border border-primary/20 font-medium"
                      : "bg-black/60 backdrop-blur-xl border border-white/[0.05] text-zinc-300 rounded-tl-sm font-light"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.memoryContext && (
                  <div className="mt-2 p-3 bg-black/40 border border-white/10 rounded-xl text-[10px] text-zinc-400 font-mono whitespace-pre-wrap overflow-x-auto w-full">
                    <div className="text-zinc-500 mb-1 font-bold">
                      Knowledge Graph & Context Memory:
                    </div>
                    {msg.memoryContext}
                  </div>
                )}

                <span className="text-[10px] text-zinc-600 px-2 font-medium tracking-wide">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xl border border-white/[0.05] flex items-center justify-center shadow-inner">
              <Bot className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="px-5 py-3.5 rounded-[20px] bg-black/60 backdrop-blur-xl border border-white/[0.05] rounded-tl-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <p className="text-sm font-light text-zinc-400">
                Querying Mem0 + Neo4j + Qdrant...
              </p>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-2">
        <div className="flex items-end gap-3 p-2.5 rounded-[24px] bg-black/40 backdrop-blur-2xl border border-white/[0.05] shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[24px]" />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Ask ${companyName}'s AI workforce anything...`}
            rows={1}
            className="flex-1 bg-transparent text-[15px] font-light text-white placeholder-zinc-600 resize-none focus:outline-none max-h-32 py-2 px-3 relative z-10"
          />
          <button
            id="send-chat-btn"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-[16px] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all z-10"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 font-medium tracking-wide mt-3 pb-2 uppercase">
          Press{" "}
          <kbd className="text-zinc-400 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05] font-sans">
            Enter
          </kbd>{" "}
          to send ·{" "}
          <kbd className="text-zinc-400 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.05] font-sans">
            Shift+Enter
          </kbd>{" "}
          for newline
        </p>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams requires it in Next.js app router
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      }
    >
      <ChatInner />
    </Suspense>
  );
}
