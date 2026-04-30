"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Zap } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Org {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  ts: Date;
}

const AGENT_COLORS: Record<string, string> = {
  Support: "#60a5fa",
  DevOps: "#fb923c",
  Finance: "#34d399",
  Legal: "#a78bfa",
  HR: "#f472b6",
  Marketing: "#fbbf24",
  Sales: "#22d3ee",
  unknown: "#71717a",
};

export default function EmbedChatPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const [org, setOrg] = useState<Org | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/organizations/${orgId}`);
        if (!res.ok) throw new Error("Not found");
        const data: Org = await res.json();
        setOrg(data);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `Hi! I'm the AI assistant for **${data.name}**. How can I help you today?`,
            agent: "unknown",
            ts: new Date(),
          },
        ]);
      } catch {
        setMessages([
          {
            id: "error",
            role: "assistant",
            content: "⚠️ Could not load this chatbot. Please check the organization ID.",
            agent: "unknown",
            ts: new Date(),
          },
        ]);
      } finally {
        setOrgLoading(false);
      }
    })();
  }, [orgId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !org) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      ts: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Auto-resize reset
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch(`${API_BASE}/agents/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          tenant_id: org.id,
          user_id: "embed_user",
          company_name: org.name,
          company_context: org.description,
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "No response generated.",
          agent: data.next_agent || "unknown",
          ts: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ Connection error. Please try again.",
          agent: "unknown",
          ts: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  if (orgLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#09090b",
        }}
      >
        <Loader2
          style={{
            width: 24,
            height: 24,
            color: "#7c3aed",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#09090b",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#f4f4f5",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(124,58,237,0.4)",
          }}
        >
          <Bot style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {org?.name ?? "AI Assistant"}
          </p>
          <div
            style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#34d399",
                display: "inline-block",
                boxShadow: "0 0 6px #34d399",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 11, color: "#71717a" }}>Online · Multi-agent AI</span>
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            borderRadius: 20,
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <Zap style={{ width: 10, height: 10, color: "#a78bfa" }} />
          <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 500 }}>
            NeuralisOS
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                gap: 8,
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    msg.role === "user"
                      ? "rgba(124,58,237,0.2)"
                      : "rgba(255,255,255,0.05)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(124,58,237,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {msg.role === "user" ? (
                  <User style={{ width: 12, height: 12, color: "#a78bfa" }} />
                ) : (
                  <Bot style={{ width: 12, height: 12, color: "#71717a" }} />
                )}
              </div>

              {/* Bubble */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "78%",
                  gap: 3,
                }}
              >
                {msg.role === "assistant" &&
                  msg.agent &&
                  msg.agent !== "unknown" && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: AGENT_COLORS[msg.agent] ?? AGENT_COLORS.unknown,
                        paddingLeft: 2,
                      }}
                    >
                      {msg.agent} Agent
                    </span>
                  )}
                <div
                  style={{
                    padding: "9px 13px",
                    borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    fontSize: 13,
                    lineHeight: 1.55,
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(124,58,237,0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                    color: msg.role === "user" ? "#fff" : "#d4d4d8",
                    boxShadow:
                      msg.role === "user"
                        ? "0 4px 15px rgba(124,58,237,0.25)"
                        : "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "#3f3f46",
                    paddingLeft: msg.role === "user" ? 0 : 2,
                    paddingRight: msg.role === "user" ? 2 : 0,
                  }}
                >
                  {msg.ts.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Bot style={{ width: 12, height: 12, color: "#71717a" }} />
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "4px 16px 16px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} style={{ height: 4 }} />
      </div>

      {/* Input */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 12px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "8px 8px 8px 12px",
            transition: "border-color 0.2s",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${org?.name ?? "AI"}...`}
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f4f4f5",
              fontSize: 13,
              lineHeight: 1.5,
              resize: "none",
              fontFamily: "inherit",
              maxHeight: 120,
              padding: 0,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              background:
                loading || !input.trim()
                  ? "rgba(124,58,237,0.2)"
                  : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              boxShadow:
                loading || !input.trim()
                  ? "none"
                  : "0 4px 12px rgba(124,58,237,0.4)",
            }}
          >
            {loading ? (
              <Loader2
                style={{
                  width: 13,
                  height: 13,
                  color: "#a78bfa",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              <Send
                style={{
                  width: 13,
                  height: 13,
                  color: "#fff",
                  marginLeft: 1,
                }}
              />
            )}
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: 10,
            color: "#3f3f46",
            margin: "6px 0 0",
          }}
        >
          Powered by{" "}
          <span style={{ color: "#6d28d9", fontWeight: 600 }}>NeuralisOS</span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #34d399; }
          50% { opacity: 0.5; box-shadow: 0 0 2px #34d399; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        textarea::placeholder { color: #52525b; }
        button:hover:not(:disabled) { filter: brightness(1.1); }
      `}</style>
    </div>
  );
}
