"use client";
import { motion } from "framer-motion";

export default function GettingStartedPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        Getting Started
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Integrate NeuralisOS into your product and start routing autonomous AI
        agents in minutes.
      </p>
      <div className="prose prose-invert prose-zinc max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          1. Create an Account
        </h2>
        <p className="text-zinc-400 mb-4">
          To get started, secure your workspace on the NeuralisOS Cloud
          platform.
        </p>
        <ul className="list-disc list-inside text-zinc-400 space-y-2 mb-6 ml-4">
          <li>
            Sign up at the{" "}
            <a
              href="http://localhost:3000"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              NeuralisOS Dashboard
            </a>
          </li>
          <li>Create your first Organization</li>
          <li>Define your Agents' Roles and Industry contexts</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          2. Upload Knowledge
        </h2>
        <p className="text-zinc-400 mb-4">
          NeuralisOS relies on a powerful compound memory engine instantly
          provisioned for your Organization. Navigate to your Organization's
          page and upload your data seamlessly.
        </p>
        <p className="text-zinc-400 mb-6">
          We handle the embedding pipelines into Qdrant (Semantic) and Neo4j
          (Graph), meaning zero backend infrastructure for you to maintain.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          3. Embed the Assistant
        </h2>
        <p className="text-zinc-400 mb-4">
          The easiest way to go live is to copy your organization's unique
          embedded script. Simply drop it into the &lt;head&gt; or before
          &lt;/body&gt; of your frontend application:
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`<!-- NeuralisOS Chat Widget -->
<script>
  (function(){
    var s = document.createElement('script');
    s.src = "https://cdn.neuralisos.com/widget.v1.js";
    s.async = true;
    s.setAttribute("data-org-id", "YOUR_ORG_ID");
    document.body.appendChild(s);
  })();
</script>`}</code>
        </pre>
        <p className="text-zinc-400 mb-4">
          Check out the{" "}
          <a
            href="/docs/integrations"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Integrations & Embed
          </a>{" "}
          guide for frameworks like Next.js and React, or dive into the{" "}
          <a
            href="/docs/agents-api"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Agents API
          </a>{" "}
          to build custom behaviors.
        </p>
      </div>
    </motion.div>
  );
}
