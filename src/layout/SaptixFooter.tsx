'use client';

import React from "react";

export interface SaptixFooterProps {
  appName?: string;
  footerNote?: string;
}

export function SaptixFooter({
  appName = "Saptix Enterprise",
  footerNote = "Next.js 16 • React 19 • OKLCH Dynamic Engine",
}: SaptixFooterProps) {
  return (
    <footer className="border-t border-border/70 px-6 py-4 text-xs text-muted-foreground transition-colors bg-background/50 backdrop-blur-sm mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-foreground font-bold tracking-tight">SAPTIX</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-foreground/90 font-medium">{appName}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span>{footerNote}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-primary font-semibold">Live Production</span>
        </div>
      </div>
    </footer>
  );
}

export default SaptixFooter;
