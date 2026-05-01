"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Network, Clock, Settings2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function MemoryPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("org_id") || "default_tenant";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/memory/activity?tenant_id=${orgId}`,
        );
        const memoryData = await res.json();
        setData(memoryData);
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

  const memoryLayers = [
    {
      title: "Episodic Memory",
      description: "Event logs, conversations, and discrete agent actions.",
      icon: Clock,
      count: "Active",
      status: "PostgreSQL Syncing",
    },
    {
      title: "Semantic Memory",
      description: "Vectorized knowledge bases, documents, and concepts.",
      icon: Database,
      count: "Active",
      status: "Qdrant Online",
    },
    {
      title: "Graph Memory",
      description: "Organizational relationships and workflow dependencies.",
      icon: Network,
      count: "Active",
      status: "Neo4j Online",
    },
    {
      title: "Procedural Memory",
      description: "Event-sourced action templates and execution chains.",
      icon: Settings2,
      count: "Active",
      status: "Kafka Streaming",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Memory Engine
        </h1>
        <p className="text-zinc-400">
          Explore the hierarchical memory consolidation and retrieval systems
          for ({orgId}).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {memoryLayers.map((layer, i) => (
          <Card
            key={i}
            className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <layer.icon className="h-5 w-5 text-primary" />
                  {layer.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {layer.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xl font-bold text-zinc-300">
                  {layer.count}
                </div>
                <div className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-full border border-white/10 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                  {layer.status}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle>Recent Activity For Context Injection</CardTitle>
          <CardDescription>
            Live hybrid search stitching context from all memory layers
            simultaneously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black/60 border border-primary/20 font-mono text-sm text-zinc-300">
              <div className="grid gap-4">
                {data?.activity?.map((act: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10"
                  >
                    <div className="flex flex-col">
                      <span className="text-primary font-bold text-xs">
                        {act.type}
                      </span>
                      <span className="text-zinc-300 text-sm mt-1">
                        {act.desc}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
