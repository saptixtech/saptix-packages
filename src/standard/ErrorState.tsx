"use client";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
        <AlertTriangleIcon className="h-6 w-6 text-red-500" />
      </div>
      <div className="space-y-1 max-w-xs">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-1.5">
          <RefreshCwIcon className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}