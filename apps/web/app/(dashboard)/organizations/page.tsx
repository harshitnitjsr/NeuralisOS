"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  FileText,
  MessageSquare,
  Trash2,
  Loader2,
  ChevronRight,
  Globe,
  Cpu,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Org {
  id: string;
  name: string;
  description: string;
  industry: string;
  document_count: number;
  agents_enabled: string[];
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Legal",
  "Retail",
  "Manufacturing",
  "Education",
  "Other",
];

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "Technology",
  });
  const [creating, setCreating] = useState(false);

  const fetchOrgs = async () => {
    try {
      const res = await fetch(`${API}/organizations/`);
      const data = await res.json();
      setOrgs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const createOrg = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/organizations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newOrg = await res.json();
      setOrgs((prev) => [newOrg, ...prev]);
      setForm({ name: "", description: "", industry: "Technology" });
      setShowCreate(false);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const deleteOrg = async (id: string) => {
    await fetch(`${API}/organizations/${id}`, { method: "DELETE" });
    setOrgs((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Organizations
          </h1>
          <p className="text-zinc-400 text-sm">
            Create an organization, upload documents, and launch an AI chatbot
            for it.
          </p>
        </div>
        <button
          id="create-org-btn"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Organization
        </button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreate(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <h2 className="text-lg font-bold">Create Organization</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">
                    Organization Name *
                  </label>
                  <input
                    id="org-name-input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Acme Corp"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Brief overview of what this organization does..."
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">
                    Industry
                  </label>
                  <select
                    value={form.industry}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, industry: e.target.value }))
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="confirm-create-org-btn"
                  onClick={createOrg}
                  disabled={creating || !form.name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/80 disabled:opacity-50 transition-colors"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : orgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
          <Building2 className="w-12 h-12 text-zinc-700" />
          <p className="text-zinc-500">
            No organizations yet. Create one to get started.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm hover:bg-primary/20 transition-colors"
          >
            Create your first organization
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {orgs.map((org, i) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex flex-col p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.05] hover:border-primary/20 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <button
                      onClick={() => deleteOrg(org.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-semibold mb-1">{org.name}</h3>
                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2 flex-1">
                    {org.description || "No description"}
                  </p>

                  <div className="flex items-center gap-3 mb-5 text-xs text-zinc-600">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {org.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {org.document_count} docs
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> {org.agents_enabled.length}{" "}
                      agents
                    </span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link href={`/organizations/${org.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-white/10 text-xs text-zinc-300 hover:bg-white/[0.06] transition-all">
                        Manage <ChevronRight className="w-3 h-3" />
                      </button>
                    </Link>
                    <Link
                      href={`/chat?org_id=${org.id}&org_name=${encodeURIComponent(org.name)}&org_ctx=${encodeURIComponent(org.description)}`}
                      className="flex-1"
                    >
                      <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-all font-medium">
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
