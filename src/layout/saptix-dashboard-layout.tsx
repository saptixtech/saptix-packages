"use client";

import React, { useState } from 'react';
import { SaptixHeader } from './saptix-header';
import { SaptixSidebar, SidebarSection } from './saptix-sidebar';

export function SaptixDashboardLayout({
  children,
  currentApp = 'spectra',
  currentPath = '/',
  customSections,
}: {
  children: React.ReactNode;
  currentApp?: string;
  currentPath?: string;
  customSections?: SidebarSection[];
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <SaptixHeader currentApp={currentApp} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex flex-1 overflow-hidden">
        <SaptixSidebar
          currentPath={currentPath}
          sections={customSections}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
