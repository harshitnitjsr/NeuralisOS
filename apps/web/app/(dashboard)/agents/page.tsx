"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, Cpu, TrendingUp, Gavel, Megaphone, Brain, Zap, MessageSquare, Network } from "lucide-react";
import Link from "next/link";

const ROLE_AGENTS = [
  { name: "Support Agent",    role: "Customer Success",       basis: "Role",      icon: <Users className="w-5 h-5 text-blue-400" />,    color: "border-blue-500/20 bg-blue-500/5",    status: "Active",  tools: ["lookup_internal_policy"] },
  { name: "DevOps Agent",     role: "Infrastructure",         basis: "Role",      icon: <Cpu className="w-5 h-5 text-orange-400" />,    color: "border-orange-500/20 bg-orange-500/5", status: "Active", tools: ["check_server_status"] },
  { name: "Sales Agent",      role: "Growth & Revenue",       basis: "Role",      icon: <Zap className="w-5 h-5 text-cyan-400" />,      color: "border-cyan-500/20 bg-cyan-500/5",    status: "Active",  tools: [] },
  { name: "Finance Agent",    role: "Financial Operations",   basis: "Role",      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/20 bg-emerald-500/5", status: "Active", tools: ["calculate_tax"] },
  { name: "Legal Agent",      role: "Compliance & Contracts", basis: "Role",      icon: <Gavel className="w-5 h-5 text-purple-400" />,  color: "border-purple-500/20 bg-purple-500/5", status: "Active", tools: ["draft_legal_clause"] },
  { name: "HR Agent",         role: "People & Culture",       basis: "Role",      icon: <ShieldCheck className="w-5 h-5 text-pink-400" />, color: "border-pink-500/20 bg-pink-500/5", status: "Active", tools: [] },
  { name: "Marketing Agent",  role: "Brand & Campaigns",      basis: "Role",      icon: <Megaphone className="w-5 h-5 text-amber-400" />, color: "border-amber-500/20 bg-amber-500/5", status: "Active", tools: [] },
];

const COGNITIVE_AGENTS = [
  { name: "Supervisor Agent", role: "Cognitive Router",       basis: "Cognitive", icon: <Brain className="w-5 h-5 text-primary" />,     color: "border-primary/20 bg-primary/5",       status: "Active",  tools: ["cognitive_rag"] },
  { name: "Critic Agent",     role: "Response Evaluator",     basis: "Cognitive", icon: <ShieldCheck className="w-5 h-5 text-rose-400" />, color: "border-rose-500/20 bg-rose-500/5", status: "Active", tools: [] },
];

export default function AgentsPage() {
  const allAgents = [...COGNITIVE_AGENTS, ...ROLE_AGENTS];
  const active = allAgents.filter(a => a.status === "Active").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Cognitive Workforce</h1>
          <p className="text-zinc-400">Multi-tenant AI agents organized by Role, Task, and Cognitive Function.</p>
        </div>
        <Link href="/chat">
          <Button className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
            <MessageSquare className="w-4 h-4" />
            Open Chat Terminal
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Agents",       value: allAgents.length, icon: <Users className="h-4 w-4 text-zinc-500" /> },
          { label: "Active",             value: active,            icon: <Zap className="h-4 w-4 text-emerald-500" /> },
          { label: "Memory Layers",      value: 3,                 icon: <Brain className="h-4 w-4 text-indigo-400" /> },
          { label: "Tool Functions",     value: 5,                 icon: <Network className="h-4 w-4 text-cyan-400" /> },
        ].map((s, i) => (
          <Card key={i} className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{s.label}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cognitive Agents */}
      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Cognitive Layer</CardTitle>
          <CardDescription>Meta-agents that supervise and evaluate the workforce.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {COGNITIVE_AGENTS.map((agent, i) => <AgentRow agent={agent} key={i} />)}
        </CardContent>
      </Card>

      {/* Role Agents */}
      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Role-Based Agents</CardTitle>
          <CardDescription>Domain-specific agents that serve your organization's departments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ROLE_AGENTS.map((agent, i) => <AgentRow agent={agent} key={i} />)}
        </CardContent>
      </Card>
    </div>
  );
}

function AgentRow({ agent }: { agent: typeof ROLE_AGENTS[0] }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border gap-4 ${agent.color}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          {agent.icon}
        </div>
        <div>
          <p className="font-medium text-sm">{agent.name}</p>
          <p className="text-xs text-zinc-500">{agent.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {agent.tools.length > 0 && agent.tools.map(t => (
          <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-400">{t}()</span>
        ))}
        {agent.tools.length === 0 && <span className="text-xs text-zinc-700">No direct tools</span>}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">{agent.basis}</Badge>
        <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/20 bg-emerald-400/10">{agent.status}</Badge>
      </div>
    </div>
  );
}
