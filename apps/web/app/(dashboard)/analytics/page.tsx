"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Activity, AlertTriangle, Coins, Target } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics & Observability</h1>
        <p className="text-zinc-400">Track real-time agent telemetry, token economics, and RL reward progression.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Tokens Consumed (24h)</CardTitle>
            <Coins className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2M</div>
            <p className="text-xs text-purple-400 mt-1">~$24.50 (Llama-3)</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg Execution Time</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.24s</div>
            <p className="text-xs text-blue-400 mt-1">-0.1s from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Blocked Hallucinations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-amber-400 mt-1">Caught by Evaluator Node</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">Avg RL Reward</CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+1.85</div>
            <p className="text-xs text-emerald-400 mt-1">Trending positive</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>Telemetry Stream</CardTitle>
            <CardDescription>Live Prometheus metrics intercepting LangGraph events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-400">agent_execution_time_seconds</span>
                <span>[Support_Agent] 0.84s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">tokens_consumed_total</span>
                <span>[Support_Agent] +240 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400">hallucination_incidents_total</span>
                <span>[DevOps_Agent] +0</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-blue-400">agent_execution_time_seconds</span>
                <span>[Supervisor_Agent] 0.31s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">tokens_consumed_total</span>
                <span>[Supervisor_Agent] +120 tokens</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>RL Reward Convergence</CardTitle>
            <CardDescription>Support Environment Episode Progression</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-48 w-full bg-black/40 border border-white/10 rounded-lg flex items-center justify-center">
               <div className="text-center">
                 <LineChart className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                 <p className="text-xs text-zinc-500 font-mono">Chart.js Visualization Pending</p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
