"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Network, Zap, Shield, Sparkles, Workflow } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">NeuralisOS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="hidden sm:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-white/90">
                Deploy OS
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center text-center px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">
              Enterprise Intelligence Infrastructure
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
            The Operating System for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
              Autonomous AI Organizations
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Deploy memory-aware autonomous AI workforces. NeuralisOS is a
            self-improving platform powered by multi-agent intelligence,
            reinforcement learning, and compound organizational memory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0"
              >
                Initialize Workspace
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
            >
              Read the Whitepaper
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 py-24 bg-black/40 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Compound Organizational Intelligence
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Build self-improving AI workforces that learn from every
              interaction and optimize your operations autonomously.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-muted-foreground">
        <p>
          © 2026 NeuralisOS. The Operating System for Autonomous AI
          Organizations.
        </p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    title: "Hyper Memory Engine",
    description:
      "Multi-layer cognitive memory storing episodic conversations, semantic documents, and procedural workflows.",
  },
  {
    icon: <Workflow className="w-6 h-6 text-purple-400" />,
    title: "Agent Operating System",
    description:
      "Orchestrate functional and cognitive agents with recursive planning, negotiation, and parallel execution.",
  },
  {
    icon: <Network className="w-6 h-6 text-indigo-400" />,
    title: "OpenEnv RL Infrastructure",
    description:
      "Your organization becomes a reinforcement learning environment for autonomous process optimization.",
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    title: "Tool Execution Fabric",
    description:
      "Agents can browse the web, operate SaaS tools, execute code, and manage infrastructure autonomously.",
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "Enterprise Governance",
    description:
      "RBAC, tenant isolation, encrypted memory, and hallucination monitoring built for enterprise scale.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    title: "Personalization Engine",
    description:
      "Deeply adaptive intelligence that adjusts to user roles, emotional tones, and department expertise.",
  },
];
