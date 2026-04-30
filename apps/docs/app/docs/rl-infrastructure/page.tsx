"use client";
import { motion } from "framer-motion";

export default function RLInfrastructurePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        RL Infrastructure
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Reinforcement Learning from Human Feedback (RLHF) and tool optimization.
      </p>
      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-zinc-400 mb-6 leading-relaxed">
          NeuralisOS uses a continuous learning pipeline that records agent
          actions, system outcomes, and user ratings to fine-tune tool calling
          logic over time.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Telemetry Pipeline
        </h2>
        <p className="text-zinc-400 mb-4">
          Under the hood, <code>core.telemetry</code> captures JSON traces of
          the LangGraph state transitions and stores them in PostgreSQL.
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`from core.telemetry import log_trajectory

log_trajectory(
    agent="devops",
    input="deploy the site",
    output="deployment successful via vercel",
    success=True
)`}</code>
        </pre>
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Feedback Loops
        </h2>
        <p className="text-zinc-400 mb-4">
          Users can rate agent responses right in the chat UI. This data pairs
          with the trajectory log to train smaller, specialized open-source
          models using DPO (Direct Preference Optimization).
        </p>
      </div>
    </motion.div>
  );
}
