"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Building2, Loader2, Target, Briefcase } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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

export default function SetupChatbotPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    purpose: "",
    industry: "Technology",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    try {
      // Create Organization
      // Include purpose in description to have a richer context
      const fullDescription =
        `${form.description}\n\nPurpose: ${form.purpose}`.trim();

      const res = await fetch(`${API}/organizations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: fullDescription,
          industry: form.industry,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create company data");
      }

      const newOrg = await res.json();

      // Redirect to the newly created organization's chatbot page
      router.push(`/organizations/${newOrg.id}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-10 text-center">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-primary/20 text-primary items-center justify-center mb-6">
          <Bot className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Launch Your Company AI
        </h1>
        <p className="text-zinc-400 text-lg">
          Tell us about your company and its purpose, and we'll instantly spin
          up a custom chatbot ready to assist your team and customers.
        </p>
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Building2 className="w-4 h-4 text-zinc-500" />
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Acme Corporation"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Target className="w-4 h-4 text-zinc-500" />
              Chatbot Purpose & Role <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.purpose}
              onChange={(e) =>
                setForm((p) => ({ ...p, purpose: e.target.value }))
              }
              placeholder="e.g. Assist customers with booking flights, handle support queries"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
            />
            <p className="text-xs text-zinc-500">
              What specific tasks should the AI handle?
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Briefcase className="w-4 h-4 text-zinc-500" />
              Industry
            </label>
            <select
              value={form.industry}
              onChange={(e) =>
                setForm((p) => ({ ...p, industry: e.target.value }))
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            >
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Additional Company Details
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Brief overview of what your organization does (products, services, values)..."
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !form.name.trim() || !form.purpose.trim()}
              className="w-full relative group overflow-hidden rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3.5"
            >
              {/* Highlight effect */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10">Initializing AI...</span>
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">
                    Generate Company Chatbot
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-zinc-500 text-xs mt-4">
              You will be able to upload documents and train your AI further on
              the next screen.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
