'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  PanelLeft, PanelLeftClose, ExternalLink 
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
    <div className="flex flex-col h-full bg-card border-r border-border select-none relative">
      {/* Brand Header */}
      <div className={`flex items-center h-14 border-b border-border px-3 shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shrink-0">
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
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close Sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation Items (Proper overflow handling when collapsed to prevent tooltip clipping) */}
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

                const linkClasses = `relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                } ${collapsed ? "justify-center" : ""}`;

                const content = (
                  <>
                    <Icon className={`size-4 shrink-0 transition-transform duration-150 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"}`} />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                              active
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground border border-border/40"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isExternal && <ExternalLink className="size-3 text-muted-foreground/60 ml-1 shrink-0" />}
                      </>
                    )}

                    {/* Collapsed Tooltip Hover with High Z-Index & Clean Positioning */}
                    {collapsed && (
                      <div className="fixed left-[72px] px-2.5 py-1 rounded-md bg-popover text-popover-foreground text-xs font-medium border border-border shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-[100] whitespace-nowrap">
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
                    title={collapsed ? item.label : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={linkClasses}
                    title={collapsed ? item.label : undefined}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer User Info & Collapse Toggle */}
      <div className="p-2 border-t border-border shrink-0 space-y-1.5 bg-muted/20">
        {/* User Card */}
        <div className={`flex items-center gap-2 p-1.5 rounded-xl bg-card border border-border/60 shadow-2xs ${collapsed ? "justify-center" : ""}`}>
          <div className="size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">SA</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">Admin Saptix</span>
              <span className="text-[10px] text-muted-foreground font-mono truncate">{footerNote}</span>
            </div>
          )}
          {!collapsed && (
            <span className="size-2 rounded-full bg-emerald-500 shrink-0" title="Active SSO Session" />
          )}
        </div>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors cursor-pointer ${
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
        className={`fixed top-0 left-0 h-full w-64 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-20 hidden md:block transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default SaptixAppSidebar;
