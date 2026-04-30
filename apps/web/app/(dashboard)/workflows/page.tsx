"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, PlayCircle, Clock, ShieldCheck, Database } from "lucide-react";

export default function WorkflowsPage() {
  const workflows = [
    { name: "Customer SLA Escalation", status: "Running", steps: 5, activeStep: "World Model Simulation" },
    { name: "Daily Memory Consolidation", status: "Idle", steps: 3, activeStep: "Pending" },
    { name: "Database Scale Up", status: "Success", steps: 8, activeStep: "Complete" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Autonomous Workflow Engine</h1>
        <p className="text-zinc-400">AI-native orchestration. Watch your multi-agent execution graphs in real-time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {workflows.map((wf, i) => (
          <Card key={i} className="bg-white/[0.02] border-white/5 relative overflow-hidden">
            {wf.status === "Running" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-primary" />
                  {wf.name}
                </CardTitle>
                <Badge variant="outline" className={wf.status === "Running" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" : "text-zinc-400 border-zinc-800"}>
                  {wf.status}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {wf.steps} execution steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm mt-4 p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-zinc-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500">Active Node:</span>
                  <span className="text-primary animate-pulse flex items-center gap-1"><PlayCircle className="w-3 h-3"/> {wf.activeStep}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle>Live Execution Graph</CardTitle>
          <CardDescription>Real-time visualization of the Multi-Agent Orchestrator.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 w-full bg-black/20 rounded-lg border border-white/5 flex flex-col items-center justify-center p-8 overflow-hidden">
             
             {/* Simple visualization of a LangGraph StateGraph execution */}
             <div className="flex items-center gap-4 w-full max-w-2xl relative z-10">
               
               {/* Human Input */}
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg">
                   👤
                 </div>
                 <span className="text-xs text-zinc-500 font-mono">Input</span>
               </div>

               <div className="flex-1 h-px bg-gradient-to-r from-zinc-700 to-primary/50 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-ping" />
               </div>

               {/* Supervisor Node */}
               <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-16 rounded-xl bg-primary/20 border-2 border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                   <ShieldCheck className="w-6 h-6 text-primary" />
                 </div>
                 <span className="text-xs text-primary font-mono font-bold">Supervisor</span>
               </div>

               <div className="flex-1 h-px bg-zinc-800 relative">
                  {/* branching paths visually */}
               </div>

               {/* Functional Agents */}
               <div className="flex flex-col gap-6">
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                     🎧
                   </div>
                   <span className="text-[10px] text-zinc-500 font-mono">Support Agent</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                     ⚙️
                   </div>
                   <span className="text-[10px] text-zinc-500 font-mono">DevOps Agent</span>
                 </div>
               </div>

               <div className="flex-1 h-px bg-zinc-800 relative"></div>

               {/* Memory DB */}
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                   <Database className="w-5 h-5 text-zinc-400" />
                 </div>
                 <span className="text-[10px] text-zinc-500 font-mono">Memory</span>
               </div>

             </div>

             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)] pointer-events-none" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
