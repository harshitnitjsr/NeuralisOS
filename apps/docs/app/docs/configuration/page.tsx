"use client";
import { motion } from "framer-motion";

export default function ConfigurationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        Configuration & Guardrails
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Setting up API keys, safety protocols, and model preferences via the
        Cloud Dashboard.
      </p>
      <div className="prose prose-invert prose-zinc max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          API Key Authentication
        </h2>
        <p className="text-zinc-400 mb-4">
          All programmatic access to NeuralisOS from your backend requires
          identifying your environment via your Organization's API keys. You can
          generate Secret Keys from the{" "}
          <strong>Settings &gt; Developers</strong> tab.
        </p>
        <p className="text-zinc-400 mb-4">
          Pass your secret key in the HTTP header for REST interactions:
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`Authorization: Bearer sk-neuralis-...`}</code>
        </pre>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Model Toggling (BYOK)
        </h2>
        <p className="text-zinc-400 mb-4">
          By default, NeuralisOS scales <code>gpt-4o</code> for difficult roles
          and <code>gpt-4o-mini</code> for simpler ones. If you wish to use
          alternative foundational models like Anthropic's Claude 3.5 Sonnet, or
          bring your own keys (BYOK) to avoid markup charges, you can override
          default execution paths.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Trust & Guardrails
        </h2>
        <p className="text-zinc-400 mb-4">
          NeuralisOS enforces enterprise safety barriers automatically.
        </p>
        <ul className="list-disc list-inside text-zinc-400 space-y-2 mb-6 ml-4">
          <li>
            <strong>PII Redaction:</strong> In-transit scrubbing of Social
            Security Numbers and Credit Card data before they hit inference
            nodes.
          </li>
          <li>
            <strong>Rate Limiting:</strong> Customizable token budgets per user
            session to prevent abuse.
          </li>
          <li>
            <strong>Semantic Moderation:</strong> Pre-execution vectors classify
            if user queries violate your safety guidelines before the main
            Supervisor engages.
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
