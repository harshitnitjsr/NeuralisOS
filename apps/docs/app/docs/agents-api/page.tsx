"use client";
import { motion } from "framer-motion";

export default function AgentsAPIPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
        Agents API
      </h1>
      <p className="text-lg text-zinc-400 font-light mb-10 tracking-wide">
        Architecting multi-agent networks and passing cognitive state.
      </p>
      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-zinc-400 mb-6 leading-relaxed">
          NeuralisOS uses a{" "}
          <strong className="text-white">Supervisor-Role</strong> architecture
          built on top of LangGraph. Agents can be customized, provided with
          tools, and bound to specific memory namespaces.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Defining Custom Roles
        </h2>
        <p className="text-zinc-400 mb-4">
          Create new agents by instantiating cognitive nodes in Python:
        </p>
        <pre className="bg-black/60 border border-white/[0.05] p-4 rounded-xl overflow-x-auto text-sm font-mono text-zinc-300 mb-6">
          <code>{`from langchain.chat_models import ChatOpenAI
from core.state import AgentState

def custom_agent_node(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o")
    response = llm.invoke(state["messages"])
    return {"messages": [response]}`}</code>
        </pre>
        <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-white/10 pb-2">
          Routing via Supervisor
        </h2>
        <p className="text-zinc-400 mb-4">
          The Supervisor node dynamically chooses the next best agent to answer
          the query based on real-time classification. It uses OpenAI's function
          calling abilities to route state between <code>HR Node</code>,{" "}
          <code>DevOps Node</code>, and others.
        </p>
      </div>
    </motion.div>
  );
}
