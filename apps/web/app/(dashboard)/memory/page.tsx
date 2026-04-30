"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Network, Clock, Settings2 } from "lucide-react";

export default function MemoryPage() {
  const memoryLayers = [
    { title: "Episodic Memory", description: "Event logs, conversations, and discrete agent actions.", icon: Clock, count: "892,341 entries", status: "PostgreSQL Syncing" },
    { title: "Semantic Memory", description: "Vectorized knowledge bases, documents, and concepts.", icon: Database, count: "3.2M vectors", status: "Qdrant Online" },
    { title: "Graph Memory", description: "Organizational relationships and workflow dependencies.", icon: Network, count: "142k nodes", status: "Neo4j Online" },
    { title: "Procedural Memory", description: "Event-sourced action templates and execution chains.", icon: Settings2, count: "4,592 schemas", status: "Kafka Streaming" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Memory Engine</h1>
        <p className="text-zinc-400">Explore the hierarchical memory consolidation and retrieval systems.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {memoryLayers.map((layer, i) => (
          <Card key={i} className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <layer.icon className="h-5 w-5 text-primary" />
                  {layer.title}
                </CardTitle>
                <CardDescription className="text-xs">{layer.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xl font-bold">{layer.count}</div>
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
          <CardTitle>Cognitive RAG++ Engine</CardTitle>
          <CardDescription>Live hybrid search stitching context from all memory layers simultaneously.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black/60 border border-primary/20 font-mono text-sm text-zinc-300">
               <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                 <span className="text-primary animate-pulse">●</span>
                 <span className="text-zinc-400">Supervisor executing hybrid query:</span>
                 <span className="text-white">"Refund for ticket PROJ-1024"</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Semantic Chunk */}
                 <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                   <div className="text-xs text-blue-400 font-bold mb-2 flex items-center gap-1">
                     <Database className="w-3 h-3" /> Qdrant (Semantic)
                   </div>
                   <p className="text-xs text-blue-100/70">"SLA Policy: All premium refund requests must be processed within 2 hours." (Score: 0.94)</p>
                 </div>
                 
                 {/* Graph Chunk */}
                 <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-md">
                   <div className="text-xs text-purple-400 font-bold mb-2 flex items-center gap-1">
                     <Network className="w-3 h-3" /> Neo4j (Graph)
                   </div>
                   <p className="text-xs text-purple-100/70">SupportAgent -&gt; INTERACTED_WITH -&gt; Customer(ID: 402)<br/>Workflow(Refund) -&gt; DEPENDS_ON -&gt; FinanceAPI</p>
                 </div>

                 {/* Episodic Chunk */}
                 <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                   <div className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
                     <Clock className="w-3 h-3" /> Postgres (Episodic)
                   </div>
                   <p className="text-xs text-emerald-100/70">User said: 'My server crashed yesterday.'<br/>Agent DevOps scaled cluster to 5 replicas.</p>
                 </div>
               </div>
               
               <div className="mt-4 pt-3 border-t border-white/10 text-xs text-zinc-500 flex justify-between">
                 <span>Context stitched in 42ms</span>
                 <span className="text-primary font-bold">Injecting to LangGraph State →</span>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/[0.02] border-white/5">
        <CardHeader>
          <CardTitle>Hierarchical Memory Consolidation</CardTitle>
          <CardDescription>Background tasks compressing episodic events into semantic knowledge.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-sm text-zinc-400">
               <div className="flex justify-between items-center mb-2 text-zinc-500 text-xs">
                 <span>[System] Consolidation Job #8392</span>
                 <span>Running</span>
               </div>
               <p className="text-zinc-300">Evaluating 1,200 recent episodic logs from Support Agent alpha...</p>
               <p className="text-emerald-400/70 ml-4">↳ Extracted new policy: "Customers asking about API rate limits prefer code examples."</p>
               <p className="text-blue-400/70 ml-4">↳ Upserted policy vector to Semantic Memory (Qdrant).</p>
               <p className="text-amber-400/70 ml-4">↳ Updated Graph Memory relationship (Support -&gt; Documentation).</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
