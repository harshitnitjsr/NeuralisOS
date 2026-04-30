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
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight">NeuralisOS</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Workspace
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${isActive ? "text-primary" : "text-zinc-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Enterprise Admin</span>
            <span className="text-xs text-zinc-500">Acme Corp</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-black to-black pointer-events-none" />
        <div className="flex-1 overflow-y-auto z-10 p-8">{children}</div>
      </main>
    </div>
  );
}
