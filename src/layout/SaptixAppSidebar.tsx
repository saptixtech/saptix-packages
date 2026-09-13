'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  PanelLeft, PanelLeftClose, ExternalLink, Sparkles 
} from "lucide-react";
import { LogoSvg } from "./LogoSvg";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isExternal?: boolean;
  external?: boolean;
}

export interface NavSection {
  title?: string;
  heading?: string;
  items: NavItem[];
}

export interface SaptixAppSidebarProps {
  appName: string;
  appBadge?: string;
  sections: NavSection[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  footerNote?: string;
}

export function SaptixAppSidebar({
  appName = "Saptix",
  appBadge,
  sections = [],
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  footerNote = "Enterprise Suite",
}: SaptixAppSidebarProps) {
  const pathname = usePathname() || "/";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card/90 backdrop-blur-2xl border-r border-border/70 select-none relative transition-all duration-300">
      {/* Brand Header */}
      <div className={`flex items-center h-14 border-b border-border/60 px-3 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shrink-0 shadow-xs hover:scale-105 transition-transform">
            <LogoSvg className="size-full" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                {appName}
              </span>
              {appBadge && (
                <span className="text-[10px] text-muted-foreground font-mono truncate">
                  {appBadge}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.96] transition-transform"
            aria-label="Close Sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className={`flex-1 px-2.5 py-3 space-y-4 ${collapsed ? "overflow-x-visible overflow-y-auto scrollbar-none" : "overflow-y-auto scrollbar-thin"}`}>
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {/* Section Title */}
            {!collapsed && (section.title || section.heading) && (
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 font-mono">
                {section.title || section.heading}
              </div>
            )}

            {/* Nav Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const isExternal = item.isExternal || item.external || item.href.startsWith("http");

                const linkClasses = `relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer active:scale-[0.98] ${
                  active
                    ? "bg-primary/15 text-primary font-semibold border border-primary/25 shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary before:rounded-r-full"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:translate-x-0.5"
                } ${collapsed ? "justify-center" : ""}`;

                const content = (
                  <>
                    <Icon className={`size-4 shrink-0 transition-transform duration-150 ${active ? "text-primary scale-105" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"}`} />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                              active
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-muted text-muted-foreground border border-border/40"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isExternal && <ExternalLink className="size-3 text-muted-foreground/60 ml-1 shrink-0" />}
                      </>
                    )}

                    {/* Relative Tooltip for Collapsed Sidebar: Aligns with item regardless of scroll */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-popover text-popover-foreground text-xs font-medium border border-border shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-[100] whitespace-nowrap">
                        {item.label}
                        {item.badge && <span className="ml-1.5 text-primary">({item.badge})</span>}
                      </div>
                    )}
                  </>
                );

                return isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={item.id} href={item.href} className={linkClasses}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Status Area */}
      <div className="border-t border-border/60 p-2.5 space-y-2 shrink-0">
        <div className={`flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground ${collapsed ? "justify-center" : ""}`}>
          {!collapsed && (
            <span className="font-mono truncate">{footerNote}</span>
          )}
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" title="Active SSO Connection" />
        </div>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-150 cursor-pointer active:scale-[0.96] ${
            collapsed ? "justify-center" : ""
          }`}
          title="Toggle Sidebar (Ctrl+B)"
        >
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 md:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 hidden md:block transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
