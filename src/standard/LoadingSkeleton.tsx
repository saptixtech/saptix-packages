"use client";

interface LoadingSkeletonProps {
  rows?: number;
  cols?: number;
  variant?: "table" | "cards" | "list";
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`}
    />
  );
}

export function LoadingSkeleton({ rows = 5, cols = 4, variant = "table" }: LoadingSkeletonProps) {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: cols * 2 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-7 w-16" />
            <Shimmer className="h-1.5 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <Shimmer className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-3.5 w-1/3" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Default: table
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b bg-muted/40 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className={`h-3 ${i === 0 ? "w-24" : "w-16"}`} />
        ))}
      </div>
      <div className="divide-y divide-border/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Shimmer key={j} className={`h-4 ${j === 0 ? "w-32" : "w-20"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}