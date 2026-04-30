"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Terminal,
  Code,
  Settings,
  Server,
  Brain,
  Zap,
  Blocks,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVIGATION = [
  {
    name: "Getting Started",
    href: "/docs/getting-started",
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    name: "Agents API",
    href: "/docs/agents-api",
    icon: <Code className="w-4 h-4" />,
  },
  {
    name: "Memory System",
    href: "/docs/memory-system",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    name: "Deployment",
    href: "/docs/deployment",
    icon: <Server className="w-4 h-4" />,
  },
  {
    name: "Integrations & Embed",
    href: "/docs/integrations",
    icon: <Blocks className="w-4 h-4" />,
  },
  {
    name: "Configuration",
    href: "/docs/configuration",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    name: "RL Infrastructure",
    href: "/docs/rl-infrastructure",
    icon: <Zap className="w-4 h-4" />,
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-primary/30 relative text-zinc-100 flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(124,58,237,0.03),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(50,150,255,0.03),transparent_25%)] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl sticky top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="w-full flex items-center h-16 px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-indigo-500 p-[1px] group-hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300">
              <div className="w-full h-full bg-black/50 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <span className="font-semibold tracking-wide text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              NeuralisOS Docs
            </span>
          </Link>
          <nav className="ml-auto flex gap-6 text-[13px] text-zinc-400 font-medium tracking-wide">
            <a
              href="http://localhost:3000"
              className="hover:text-white transition-colors"
            >
              Platform
            </a>
            <a
              href="https://github.com"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 relative z-10 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/[0.05] pr-6 py-10 hidden md:block">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 px-3">
            Documentation
          </div>
          <nav className="space-y-1">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${isActive ? "bg-white/[0.06] text-primary shadow-sm border border-white/[0.05]" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] border border-transparent"}`}
                >
                  <span
                    className={
                      isActive
                        ? "text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                        : "text-zinc-500"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? "font-medium" : "font-normal"}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 pl-0 md:pl-12 py-10 pr-6 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
