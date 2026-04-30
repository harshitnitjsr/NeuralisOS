"use client";
import { motion } from "framer-motion";

export default function MemorySystemPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        Memory System
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Deep dive into Semantic, Episodic, and Graph memory layers.
      </p>
      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-zinc-400 mb-6 leading-relaxed">
          The intelligence of NeuralisOS comes from its compound memory engine.
          We split memory across three specialized databases to ensure agents
          have perfect context.
        </p>

        <div className="grid lg:grid-cols-3 gap-6 my-8">
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.05]">
            <h3 className="text-white font-semibold mb-2">Mem0 (Episodic)</h3>
            <p className="text-sm text-zinc-400">
              Tracks user preferences, interaction history, and short-term
              dialogue context allowing for conversational continuity.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.05]">
            <h3 className="text-white font-semibold mb-2">Qdrant (Semantic)</h3>
            <p className="text-sm text-zinc-400">
              Knowledge base vector search. Stores company documents,
              embeddings, and vast amounts of static information.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.05]">
            <h3 className="text-white font-semibold mb-2">Neo4j (Graph)</h3>
            <p className="text-sm text-zinc-400">
              Relational memories connecting entities, workflows, and abstract
              concepts to understand "who knows what."
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-12 mb-4 border-b border-white/10 pb-2">
          Injecting Context
        </h2>
        <p className="text-zinc-400 mb-4">
          When a User invokes a query, the API searches all 3 databases to
          construct a highly informed <code>SystemMessage</code> payload
          injected into the active Agent Node's prompt.
        </p>
      </div>
    </motion.div>
  );
}
