"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  Database,
  Bot,
  MessageSquare,
  Cpu,
  FileCode,
  ShieldCheck,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export type SidebarItem = {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  external?: boolean;
};

export type SidebarSection = {
  header: string;
  items: SidebarItem[];
};

export const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    header: 'CORE PLATFORM',
    items: [
      { title: 'Telemetry Overview', href: '/overview', icon: LayoutDashboard },
      { title: 'AI Copilot Chat', href: 'https://chat.saptix.tech', icon: MessageSquare, badge: 'Live', external: true },
      { title: 'Cloud Connector Mesh', href: 'https://scc.saptix.tech', icon: Layers, external: true },
      { title: 'Autonomous Swarm', href: 'https://agent.saptix.tech', icon: Bot, external: true },
    ],
  },
  {
    header: 'SAP INTEGRATION',
    items: [
      { title: 'RFC & BAPI Telemetry', href: '/bapi', icon: Cpu },
      { title: 'Clean Core Modeler', href: 'https://modeler.saptix.tech', icon: FileCode, external: true },
      { title: 'Enterprise Database', href: 'https://admin.saptix.tech', icon: Database, external: true },
      { title: 'Security & Jails', href: '/monitoring', icon: ShieldCheck, badge: 'Protected' },
    ],
  },
  {
    header: 'MANAGEMENT',
    items: [
      { title: 'Account & Billing', href: 'https://account.saptix.tech', icon: Settings, external: true },
      { title: 'Architecture Docs', href: 'https://saptix.tech', icon: HelpCircle, external: true },
    ],
  },
];

export function SaptixSidebar({
  currentPath = '/',
  sections = DEFAULT_SECTIONS,
  collapsed = false,
  onToggle,
}: {
  currentPath?: string;
  sections?: SidebarSection[];
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <aside
      className={`border-r border-border/80 bg-card/60 backdrop-blur-md flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1.5">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase font-mono">
                {sec.header}
              </h4>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;

                const content = (
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                    }`}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="size-4.5 shrink-0" />
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-primary/15 text-primary border border-primary/30">
                            {item.badge}
                          </span>
                        )}
                        {item.external && !item.badge && (
                          <ExternalLink className="size-3 text-muted-foreground opacity-50" />
                        )}
                      </div>
                    )}
                  </div>
                );

                return item.external ? (
                  <a key={item.title} href={item.href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link key={item.title} href={item.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Version Status */}
      <div className="p-3 border-t border-border/80 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
        {!collapsed ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SAPTIX v2.4 (Clean Core)
            </span>
            <span>Next 16</span>
          </>
        ) : (
          <span className="mx-auto size-2 rounded-full bg-emerald-400 animate-pulse"></span>
        )}
      </div>
    </aside>
  );
}
