"use client";
import { InboxIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Add your first item to get started.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border">
        {icon ?? <InboxIcon className="h-6 w-6 text-muted-foreground" />}
      </div>
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}