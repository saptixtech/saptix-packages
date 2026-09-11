"use client";
import React from "react";
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;        // positive = up, negative = down
  progress?: number;      // 0-100
  prefix?: string;
  suffix?: string;
}

interface KpiMetricGridProps {
  metrics: KpiMetric[];
}

export function KpiMetricGrid({ metrics }: KpiMetricGridProps) {
  const visible = metrics.slice(0, 6);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {visible.map((m) => (
        <KpiCard key={m.id} metric={m} />
      ))}
    </div>
  );
}

function KpiCard({ metric: m }: { metric: KpiMetric }) {
  const isUp    = typeof m.change === "number" && m.change > 0;
  const isDown  = typeof m.change === "number" && m.change < 0;
  const isFlat  = typeof m.change === "number" && m.change === 0;
  const hasChange = typeof m.change === "number";

  return (
    <div className="group relative flex flex-col justify-between gap-2.5 rounded-xl border border-border bg-card p-4 shadow-xs hover:shadow-md hover:border-border/80 transition-all duration-200 hover:-translate-y-0.5 cursor-default min-w-0">
      <div className="space-y-1.5 min-w-0">
        {/* Label */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
          {m.label}
        </p>

        {/* Value */}
        <p className="text-2xl font-bold font-[tabular-nums] text-foreground leading-tight tracking-tight truncate">
          {m.prefix}{m.value}{m.suffix}
        </p>
      </div>

      {/* Change pill */}
      {hasChange && (
        <div className="flex items-center gap-1.5 pt-1">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isUp
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : isDown
                ? "bg-red-500/15 text-red-600 dark:text-red-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isUp && <TrendingUpIcon className="h-3 w-3" />}
            {isDown && <TrendingDownIcon className="h-3 w-3" />}
            {isFlat && <MinusIcon className="h-3 w-3" />}
            {isUp ? `+${m.change}%` : isDown ? `${m.change}%` : "0%"}
          </span>
          <span className="text-[11px] text-muted-foreground">vs prev period</span>
        </div>
      )}

      {/* Progress bar */}
      {typeof m.progress === "number" && (
        <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              m.progress >= 80
                ? "bg-emerald-500"
                : m.progress >= 50
                ? "bg-primary"
                : m.progress >= 30
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, m.progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
