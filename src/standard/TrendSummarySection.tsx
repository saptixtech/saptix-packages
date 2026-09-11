"use client";
import { ReactNode } from "react";

interface TrendSummarySectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  minHeight?: number;
}

export function TrendSummarySection({
  title,
  subtitle,
  children,
  className = "",
  minHeight = 160,
}: TrendSummarySectionProps) {
  return (
    <div className={`rounded-xl border bg-card shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-start justify-between px-5 py-4 border-b">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div
        className="p-5"
        style={{ minHeight }}
      >
        {children}
      </div>
    </div>
  );
}