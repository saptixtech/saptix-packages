"use client";
import { ReactNode } from "react";

interface StandardPageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function StandardPageLayout({
  title,
  description,
  actions,
  children,
}: StandardPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground leading-snug">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>

      {/* Page content */}
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}