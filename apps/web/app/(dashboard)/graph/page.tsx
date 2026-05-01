"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Network,
  Database,
  BrainCircuit,
  Activity,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function GraphPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("org_id") || "default_tenant";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/memory/graph?tenant_id=${orgId}`,
        );
        const graphData = await res.json();
        setData(graphData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Organizational Knowledge Graph
        </h1>
        <p className="text-zinc-400">
          Powered by Neo4j. Visualize the cognitive structure, dependencies, and
          communication flow of your AI workforce ({orgId}).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Graph Nodes
            </CardTitle>
            <Database className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.stats?.total_nodes || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Active Relationships
            </CardTitle>
            <Network className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {data?.stats?.active_relationships || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">
              RL Reward State
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {data?.stats?.csat || "+0.0"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle>Cognitive Network Visualization</CardTitle>
          <CardDescription>
            Live map of agent interactions and workflow dependencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 w-full bg-black/20 rounded-lg border border-white/5 flex flex-col items-center justify-center overflow-hidden">
            {/* Simulated Force Directed Graph via CSS/HTML for aesthetic purposes */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              {/* User/Org Node (Center) */}
              <div className="absolute z-10 w-20 h-20 bg-primary/20 border-2 border-primary/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                <BrainCircuit className="w-8 h-8 text-primary mb-1" />
                <span className="text-[10px] text-primary font-bold">
                  Tenant/Org
                </span>
              </div>

              {/* Dynamically render edges & nodes for visually pleasing spread */}
              {data?.nodes?.map((node: any, idx: number) => {
                if (node.id === orgId) return null; // Center node

                const angle = (idx / data.nodes.length) * 2 * Math.PI;
                const radius = 120;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                  <div key={node.id}>
                    {/* Edge */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 0 }}
                    >
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`calc(50% + ${x}px)`}
                        y2={`calc(50% + ${y}px)`}
                        stroke="#10b981"
                        strokeWidth="1"
                        strokeOpacity="0.5"
                      />
                    </svg>

                    {/* Document/Entity Node */}
                    <div
                      className="absolute z-10 w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex flex-col items-center justify-center"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <Database className="w-5 h-5 text-emerald-400 mb-1" />
                      <span className="text-[8px] text-emerald-400 font-bold px-1 text-center truncate w-full">
                        {node.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)] pointer-events-none" />

            {/* OpenEnv RL Overlay */}
            <div className="absolute bottom-4 left-4 p-3 bg-black/60 border border-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-xs font-mono text-zinc-400 mb-1">
                OpenEnv RL Matrix
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-zinc-500">Support State</span>
                  <span className="text-emerald-400">[0.84, 12, 0.1]</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500">Policy Update</span>
                  <span className="text-primary animate-pulse">
                    Computing...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
