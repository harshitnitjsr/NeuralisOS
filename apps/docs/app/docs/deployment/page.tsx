"use client";
import { motion } from "framer-motion";

export default function DeploymentPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        Enterprise Deployment
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Scale your agentic deployments from staging to planet-scale production.
      </p>
      <div className="prose prose-invert prose-zinc max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Global Edge Network
        </h2>
        <p className="text-zinc-400 mb-4">
          By default, NeuralisOS hosts your customized Agent API and compound
          memory stores across our global edge network, guaranteeing ultra-low
          latency routing and instantaneous conversational feedback, effectively
          eliminating cold boots for your chatbots.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Enterprise Dedicated Clusters (VPC)
        </h2>
        <p className="text-zinc-400 mb-4">
          For financial, medical, and legal clients possessing hard compliance
          requirements (SOC2, HIPAA), NeuralisOS provides single-tenant
          deployments. We provision isolated VPCs containing dedicated
          Postgres/pgvector instances and compute nodes within your AWS or AWS
          GovCloud environments.
        </p>
        <p className="text-zinc-400 mb-4">
          Please contact our Enterprise Support team to configure AWS
          PrivateLink mirroring.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Webhooks & Tool Execution
        </h2>
        <p className="text-zinc-400 mb-4">
          When agents identify a task they need to execute externally,
          NeuralisOS securely pushes signed payloads to your backend via
          webhook. This architecture ensures your private system APIs and write
          actions stay entirely behind your own firewall.
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`POST /api/webhooks/neuralis HTTP/1.1
Host: api.yourcompany.com
Neuralis-Signature: v1,t=167...

{
  "action": "refund_customer",
  "actor_agent": "finance-node",
  "payload": {
    "customer_id": "cus_123",
    "amount": 49.99
  }
}`}</code>
        </pre>
      </div>
    </motion.div>
  );
}
