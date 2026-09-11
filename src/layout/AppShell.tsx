'use client';

import React, { useState, useEffect } from "react";
import { SaptixHeader } from "./SaptixHeader";
import { SaptixAppSidebar, type NavSection } from "./SaptixAppSidebar";
import { SaptixFooter } from "./SaptixFooter";

export interface AppShellProps {
  appName: string;
  appBadge?: string;
  subdomain?: string;
  sections: NavSection[];
  footerNote?: string;
  children: React.ReactNode;
}

export function AppShell({
  appName = "Saptix Workspace",
  appBadge = "v3.0",
  subdomain,
  sections = [],
  footerNote = "Unified Cloud Core",
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("saptix-sidebar-collapsed");
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    } catch (e) {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((prev) => {
          const next = !prev;
          try {
            localStorage.setItem("saptix-sidebar-collapsed", String(next));
          } catch (err) {}
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("saptix-sidebar-collapsed", String(next));
      } catch (err) {}
      return next;
    });
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      handleToggleCollapse();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors overflow-x-hidden">
      {/* Unified Saptix Sidebar */}
      <SaptixAppSidebar
        appName={appName}
        appBadge={appBadge}
        sections={sections}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        footerNote={footerNote}
      />

      {/* Main Container offset by sidebar width with min-w-0 to prevent table & box blowout */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-[68px]" : "md:ml-64"
        } ml-0`}
      >
        {/* Unified Saptix Topbar */}
        <SaptixHeader
          appName={appName}
          appBadge={appBadge}
          subdomain={subdomain}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={collapsed}
        />

        {/* Dynamic Page Content with responsive breathing room */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 container mx-auto max-w-7xl w-full min-w-0">
          {children}
        </main>

        {/* Unified Saptix Footer */}
        <SaptixFooter appName={appName} footerNote={`${appName} • Saptix Cloud OS`} />
      </div>
    </div>
  );
}

export default AppShell;
