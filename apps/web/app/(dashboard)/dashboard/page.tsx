"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Server, Users } from "lucide-react";
import { motion } from "framer-motion";
import { fetchAgents, fetchMemoryActivity, fetchHealth } from "@/lib/api";

export default function DashboardOverview() {
  const [agents, setAgents] = useState<any[]>([]);
  const [memoryActivity, setMemoryActivity] = useState<any[]>([]);
  const [apiHealth, setApiHealth] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setApiHealth(await fetchHealth());
      setAgents(await fetchAgents());
      setMemoryActivity(await fetchMemoryActivity());
    }
    loadData();
  }, []);

  const stats = [
    { title: "Active Agents", value: agents.length || "0", icon: Users, change: "+3 this week" },
    { title: "Memory Entities", value: "1.2M", icon: Brain, change: "+15k today" },
    { title: "Workflows Executed", value: "8,439", icon: Activity, change: "99.8% success" },
    { title: "API Gateway", value: apiHealth?.status === "ok" ? "Online" : "Offline", icon: Server, change: apiHealth ? "Connected" : "Disconnected" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Workspace Overview</h1>
        <p className="text-zinc-400">Manage your autonomous AI workforce and monitor organizational cognition.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/[0.02] border-white/5 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.title === "API Gateway" && stat.value === "Online" ? "text-emerald-500" : "text-zinc-500"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-zinc-500 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Active Agents List */}
        <Card className="lg:col-span-4 bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>Your multi-agent autonomous workforce status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.length > 0 ? agents.map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-zinc-500">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={agent.status === "Active" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" : "text-amber-400 border-amber-400/20 bg-amber-400/10"}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-zinc-500 text-sm border border-white/5 rounded-lg bg-white/[0.01]">
                  Loading agents from API gateway...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Memory Streams */}
        <Card className="lg:col-span-3 bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>Memory Activity</CardTitle>
            <CardDescription>Recent episodic and semantic writes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {memoryActivity.length > 0 ? memoryActivity.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{log.type} Memory</p>
                    <p className="text-sm text-zinc-400">{log.desc}</p>
                    <p className="text-xs text-zinc-500 mt-1">{log.time}</p>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-zinc-500 text-sm border border-white/5 rounded-lg bg-white/[0.01]">
                  Loading memory activity...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
