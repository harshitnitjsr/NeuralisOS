"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Database, BrainCircuit, Activity } from "lucide-react";

export default function GraphPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Organizational Knowledge Graph</h1>
        <p className="text-zinc-400">Powered by Neo4j. Visualize the cognitive structure, dependencies, and communication flow of your AI workforce.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Graph Nodes</CardTitle>
            <Database className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142,891</div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Relationships</CardTitle>
            <Network className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">894,203</div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">RL Reward State</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+1.42 CSAT Avg</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle>Cognitive Network Visualization</CardTitle>
          <CardDescription>Live map of agent interactions and workflow dependencies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 w-full bg-black/20 rounded-lg border border-white/5 flex flex-col items-center justify-center overflow-hidden">
             
             {/* Simulated Force Directed Graph via CSS/HTML for aesthetic purposes */}
             <div className="absolute inset-0 flex items-center justify-center opacity-80">
                {/* Supervisor Node (Center) */}
                <div className="absolute z-10 w-20 h-20 bg-primary/20 border-2 border-primary/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                  <BrainCircuit className="w-8 h-8 text-primary mb-1" />
                  <span className="text-[10px] text-primary font-bold">Supervisor</span>
                </div>

                {/* Edges */}
                <div className="absolute w-[200px] h-[2px] bg-gradient-to-r from-primary/50 to-emerald-500/50 rotate-45" />
                <div className="absolute w-[200px] h-[2px] bg-gradient-to-r from-primary/50 to-blue-500/50 -rotate-45" />
                <div className="absolute w-[300px] h-[2px] bg-gradient-to-r from-primary/50 to-purple-500/50 rotate-90" />
                <div className="absolute w-[250px] h-[2px] bg-gradient-to-r from-emerald-500/30 to-purple-500/30 -rotate-12 translate-y-24" />

                {/* Support Agent Node */}
                <div className="absolute z-10 w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex flex-col items-center justify-center translate-x-[100px] translate-y-[100px]">
                  <span className="text-[9px] text-emerald-400 font-bold text-center leading-tight">Support<br/>Agent</span>
                </div>

                {/* DevOps Agent Node */}
                <div className="absolute z-10 w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex flex-col items-center justify-center -translate-x-[100px] -translate-y-[100px]">
                  <span className="text-[9px] text-blue-400 font-bold text-center leading-tight">DevOps<br/>Agent</span>
                </div>

                {/* Neo4j Graph DB Node */}
                <div className="absolute z-10 w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex flex-col items-center justify-center translate-y-[150px]">
                  <Database className="w-5 h-5 text-purple-400 mb-1" />
                  <span className="text-[9px] text-purple-400 font-bold">Neo4j</span>
                </div>

                {/* Sales Agent Node */}
                <div className="absolute z-10 w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex flex-col items-center justify-center translate-x-[120px] -translate-y-[60px]">
                  <span className="text-[9px] text-amber-400 font-bold text-center leading-tight">Sales<br/>Agent</span>
                </div>
             </div>

             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)] pointer-events-none" />
             
             {/* OpenEnv RL Overlay */}
             <div className="absolute bottom-4 left-4 p-3 bg-black/60 border border-white/10 rounded-lg backdrop-blur-sm">
               <div className="text-xs font-mono text-zinc-400 mb-1">OpenEnv RL Matrix</div>
               <div className="flex gap-4 text-xs">
                 <div className="flex flex-col">
                   <span className="text-zinc-500">Support State</span>
                   <span className="text-emerald-400">[0.84, 12, 0.1]</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-zinc-500">Policy Update</span>
                   <span className="text-primary animate-pulse">Computing...</span>
                 </div>
               </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
