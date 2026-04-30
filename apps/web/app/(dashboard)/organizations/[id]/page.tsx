"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  Upload,
  Trash2,
  Loader2,
  MessageSquare,
  Send,
  Bot,
  User,
  Brain,
  Network,
  Zap,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Code2,
  Copy,
  Check,
  X,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Doc {
  id: string;
  filename: string;
  size_bytes: number;
  content_type: string;
  text_preview: string;
}
interface Org {
  id: string;
  name: string;
  description: string;
  industry: string;
  document_count: number;
  agents_enabled: string[];
}
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  ts: Date;
}

const AGENT_COLOR: Record<string, string> = {
  Support: "text-blue-400",
  DevOps: "text-orange-400",
  Finance: "text-emerald-400",
  Legal: "text-purple-400",
  HR: "text-pink-400",
  Marketing: "text-amber-400",
  Sales: "text-cyan-400",
  unknown: "text-zinc-400",
};

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [org, setOrg] = useState<Org | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState<"snippet" | "url" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch org + docs
  useEffect(() => {
    (async () => {
      try {
        const [orgRes, docRes] = await Promise.all([
          fetch(`${API}/organizations/${id}`),
          fetch(`${API}/organizations/${id}/documents`),
        ]);
        const orgData = await orgRes.json();
        const docData = await docRes.json();
        setOrg(orgData);
        setDocs(docData.documents || []);

        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `Hi! I'm the AI chatbot for **${orgData.name}**. I have access to ${docData.documents?.length || 0} uploaded documents. Ask me anything about your organization!`,
            agent: "unknown",
            ts: new Date(),
          },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrg(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Upload docs
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadStatus("idle");
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`${API}/organizations/${id}/documents`, {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        setDocs((prev) => [...prev, data.document]);
      }
      setUploadStatus("success");
    } catch (e) {
      setUploadStatus("error");
      console.error(e);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  const deleteDoc = async (docId: string) => {
    await fetch(`${API}/organizations/${id}/documents/${docId}`, {
      method: "DELETE",
    });
    setDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  // Chat
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading || !org) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      ts: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/agents/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: chatInput,
          tenant_id: org.id,
          user_id: "user_001",
          company_name: org.name,
          company_context: org.description,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "No response.",
          agent: data.next_agent,
          ts: new Date(),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "⚠️ Backend connection failed. Make sure the API is running.",
          agent: "unknown",
          ts: new Date(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ── Embed helpers ──────────────────────────────────────────────────────────
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "https://your-neuralis-domain.com");

  const embedUrl = `${appUrl}/embed/${id}`;

  const embedSnippet = `<!-- NeuralisOS Chat Widget -->
<script>
(function(){
  var EMBED_URL="${embedUrl}";
  var btn=document.createElement("div");
  btn.id="neuralis-chat-btn";
  btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  Object.assign(btn.style,{position:"fixed",bottom:"24px",right:"24px",width:"56px",height:"56px",borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(124,58,237,0.5)",zIndex:"9999",transition:"transform 0.2s,box-shadow 0.2s"});
  btn.onmouseenter=function(){btn.style.transform="scale(1.1)";btn.style.boxShadow="0 6px 28px rgba(124,58,237,0.7)"};
  btn.onmouseleave=function(){btn.style.transform="scale(1)";btn.style.boxShadow="0 4px 20px rgba(124,58,237,0.5)"};
  var frame=document.createElement("iframe");
  frame.src=EMBED_URL;
  frame.allow="microphone";
  Object.assign(frame.style,{position:"fixed",bottom:"96px",right:"24px",width:"380px",height:"560px",border:"none",borderRadius:"20px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",zIndex:"9998",display:"none",transition:"opacity 0.25s,transform 0.25s",opacity:"0",transform:"translateY(12px)"});
  var open=false;
  btn.onclick=function(){
    open=!open;
    if(open){frame.style.display="block";setTimeout(function(){frame.style.opacity="1";frame.style.transform="translateY(0)"},10);}
    else{frame.style.opacity="0";frame.style.transform="translateY(12px)";setTimeout(function(){frame.style.display="none"},260);}
  };
  document.body.appendChild(frame);
  document.body.appendChild(btn);
})();
</script>`;

  const copyToClipboard = async (text: string, type: "snippet" | "url") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  if (loadingOrg)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  if (!org) return <div className="text-zinc-500">Organization not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organizations">
          <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{org.name}</h1>
          <p className="text-zinc-500 text-sm">
            {org.industry} · {org.document_count} documents ·{" "}
            {org.agents_enabled.length} agents
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`/embed/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </a>
          <button
            id="get-embed-code-btn"
            onClick={() => setShowEmbed(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary hover:bg-primary/20 transition-all font-medium"
          >
            <Code2 className="w-4 h-4" />
            Get Embed Code
          </button>
        </div>
      </div>

      {/* ── Embed Code Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEmbed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEmbed(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            >
              {/* Modal Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Code2 className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Embed Chat Widget
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Add {org.name}&apos;s AI assistant to any website in seconds
                  </p>
                </div>
                <button
                  onClick={() => setShowEmbed(false)}
                  className="ml-auto p-2 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* How it works */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { step: "1", label: "Copy the snippet", icon: Copy },
                    { step: "2", label: "Paste before </body>", icon: Code2 },
                    { step: "3", label: "Chat widget appears", icon: Globe },
                  ].map(({ step, label, icon: Icon }) => (
                    <div
                      key={step}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {step}
                      </div>
                      <Icon className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Direct URL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Direct iframe URL
                    </label>
                    <button
                      onClick={() => copyToClipboard(embedUrl, "url")}
                      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-primary transition-colors"
                    >
                      {copied === "url" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied === "url" ? "Copied!" : "Copy URL"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black/60 border border-white/[0.06] font-mono text-xs text-zinc-400 overflow-hidden">
                    <Globe className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{embedUrl}</span>
                  </div>
                </div>

                {/* Full Snippet */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      JavaScript Snippet
                    </label>
                    <button
                      id="copy-embed-snippet-btn"
                      onClick={() => copyToClipboard(embedSnippet, "snippet")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        copied === "snippet"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {copied === "snippet" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Snippet
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <pre className="px-4 py-4 rounded-xl bg-black/70 border border-white/[0.06] text-[11px] leading-relaxed text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-56 overflow-y-auto scrollbar-thin">
                      <span className="text-zinc-600">{`<!-- NeuralisOS Chat Widget -->`}</span>
                      {"\n"}
                      <span className="text-purple-400">{`<script>`}</span>
                      {"\n"}
                      <span className="text-zinc-500">{`(function(){`}</span>
                      {"\n"}
                      <span className="text-zinc-500 pl-4">{`  // Floating chat bubble for `}</span>
                      <span className="text-amber-400">{org.name}</span>
                      {"\n"}
                      <span className="text-zinc-500 pl-4">{`  var EMBED_URL=`}</span>
                      <span className="text-emerald-400">
                        &quot;{embedUrl}&quot;
                      </span>
                      <span className="text-zinc-500">{`;`}</span>
                      {"\n"}
                      <span className="text-zinc-500">{`  // ... injects iframe + chat bubble`}</span>
                      {"\n"}
                      <span className="text-zinc-500">{`})();`}</span>
                      {"\n"}
                      <span className="text-purple-400">{`</script>`}</span>
                    </pre>
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">
                    Paste this snippet anywhere before{" "}
                    <code className="text-zinc-500 bg-white/5 px-1 py-0.5 rounded">
                      &lt;/body&gt;
                    </code>{" "}
                    in your HTML. Works on any website.
                  </p>
                </div>

                {/* Footer actions */}
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={`/embed/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-400 hover:text-white hover:border-white/10 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Preview Widget
                  </a>
                  <button
                    onClick={() => copyToClipboard(embedSnippet, "snippet")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
                  >
                    {copied === "snippet" ? (
                      <>
                        <Check className="w-4 h-4" /> Snippet Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Full Snippet
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
        {/* LEFT: Document Manager */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Upload Zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleUpload(e.dataTransfer.files);
            }}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/30 cursor-pointer transition-colors group"
          >
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : uploadStatus === "success" ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : uploadStatus === "error" ? (
              <AlertCircle className="w-8 h-8 text-red-400" />
            ) : (
              <Upload className="w-8 h-8 text-zinc-600 group-hover:text-primary transition-colors" />
            )}
            <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors text-center">
              {uploading
                ? "Uploading & indexing into Qdrant..."
                : uploadStatus === "success"
                  ? "Documents indexed successfully!"
                  : uploadStatus === "error"
                    ? "Upload failed. Try again."
                    : "Drop files here or click to upload\nDocuments are indexed into Qdrant for semantic retrieval"}
            </p>
          </div>

          {/* Memory Layer Status */}
          <div className="flex-shrink-0 flex items-center gap-4 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
            <span className="text-zinc-600 uppercase tracking-wider font-medium">
              Active Memory
            </span>
            {[
              {
                label: "Qdrant",
                icon: <Brain className="w-3 h-3" />,
                color: "text-indigo-400",
              },
              {
                label: "Neo4j",
                icon: <Network className="w-3 h-3" />,
                color: "text-cyan-400",
              },
              {
                label: "Mem0",
                icon: <Zap className="w-3 h-3" />,
                color: "text-amber-400",
              },
            ].map((l) => (
              <span
                key={l.label}
                className={`flex items-center gap-1 ${l.color}`}
              >
                {l.icon} {l.label}{" "}
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              </span>
            ))}
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {docs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-zinc-600 text-sm">No documents yet.</p>
                <p className="text-zinc-700 text-xs">
                  Upload files to power the chatbot's knowledge base.
                </p>
              </div>
            ) : (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  className="group flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {(doc.size_bytes / 1024).toFixed(1)} KB ·{" "}
                      {doc.content_type}
                    </p>
                    {doc.text_preview && (
                      <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                        {doc.text_preview}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-zinc-600 hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Embedded Chatbot */}
        <div className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.01] overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{org.name} AI Assistant</p>
              <p className="text-xs text-zinc-600">
                Powered by {docs.length} documents · Multi-agent routing
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setShowEmbed(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-primary/10 hover:bg-primary/20 border border-primary/20 text-xs text-primary transition-colors text-nowrap"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Get Embed</span>
              </button>
              <div className="flex items-center gap-1.5 px-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-zinc-600 hidden sm:inline">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs border
                    ${msg.role === "user" ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-zinc-400"}`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {msg.role === "assistant" &&
                      msg.agent &&
                      msg.agent !== "unknown" && (
                        <span
                          className={`text-xs mb-1 font-medium ${AGENT_COLOR[msg.agent] || "text-zinc-500"}`}
                        >
                          {msg.agent} Agent
                        </span>
                      )}
                    <div
                      className={`px-3 py-2.5 rounded-xl text-sm leading-relaxed
                      ${
                        msg.role === "user"
                          ? "bg-primary/15 border border-primary/20 text-white rounded-tr-sm"
                          : "bg-white/[0.04] border border-white/8 text-zinc-200 rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-xs text-zinc-700 px-1 mt-1">
                      {msg.ts.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {chatLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/8">
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  <span className="text-xs text-zinc-500">
                    Searching documents + memory...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-3 border-t border-white/8">
            <div className="flex gap-2 items-end">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
                placeholder={`Ask about ${org.name}...`}
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none focus:border-primary/40 max-h-28"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white disabled:opacity-40 hover:bg-primary/80 transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
