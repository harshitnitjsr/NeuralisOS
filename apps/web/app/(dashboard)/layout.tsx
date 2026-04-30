"use client";

import {
  Brain,
  Building2,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Workflow,
  Zap,
  Network,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Setup Chatbot", href: "/setup", icon: Zap },
    { name: "Organizations", href: "/organizations", icon: Building2 },
    { name: "Chat Terminal", href: "/chat", icon: MessageSquare },
    { name: "Agents", href: "/agents", icon: Users },
    { name: "Memory Engine", href: "/memory", icon: Brain },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Graph", href: "/graph", icon: Network },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden font-sans selection:bg-primary/30">
      {/* Sidebar - Sleek Glass Panel */}
      <div className="w-[260px] border-r border-white/[0.05] bg-black/40 backdrop-blur-2xl flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        {/* Glow effect at top left */}
        <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />

        <div className="h-16 flex items-center px-6 border-b border-white/[0.05] relative">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-indigo-500 flex items-center justify-center p-[1px] group-hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300">
              <div className="w-full h-full bg-black/50 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <span className="font-semibold tracking-wide text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              NeuralisOS
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3.5 space-y-1.5 relative">
          <div className="px-3 mb-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Workspace context
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                  isActive
                    ? "bg-white/[0.06] text-primary shadow-sm border border-white/[0.05]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] border border-transparent"
                }`}
              >
                <item.icon
                  className={`w-[18px] h-[18px] ${
                    isActive
                      ? "text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                      : "text-zinc-500"
                  } transition-colors duration-300`}
                />
                <span className={isActive ? "font-medium" : "font-normal"}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-white/[0.05] flex items-center gap-3 bg-white/[0.01]">
          <div className="ring-2 ring-white/10 rounded-full p-[2px] transition-all hover:ring-primary/40">
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "w-8 h-8" } }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">
              Enterprise Admin
            </span>
            <span className="text-xs text-zinc-500 font-medium">Acme Corp</span>
          </div>
        </div>
      </div>

      {/* Main Content Area - Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0A0A0A] relative">
        {/* Subtle radial canvas highlight */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.05),transparent_70%)] pointer-events-none" />
        <div className="flex-1 overflow-y-auto z-10 p-8 md:p-12 h-[100vh] scroll-smooth relative">
          <div className="max-w-[1400px] mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
