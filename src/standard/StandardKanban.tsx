"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FilterBar } from "./FilterBar";
import { EmptyState } from "./EmptyState";
import { Badge } from "@/components/ui/badge";
import { EditIcon, GripVerticalIcon } from "lucide-react";

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: "low" | "medium" | "high" | "critical";
  assignee?: string;
  progress?: number;
  dueDate?: string;
  overdue?: boolean;
}

const PRIORITY_COLORS = {
  low: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  high: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  critical: "bg-red-500/15 text-red-700 dark:text-red-400",
};

interface StandardKanbanProps {
  items: KanbanItem[];
  columns: KanbanColumn[];
  onEdit?: (item: KanbanItem) => void;
  onCreate?: () => void;
  searchableKeys?: (keyof KanbanItem)[];
  className?: string;
}

export function StandardKanban({
  items,
  columns,
  onEdit,
  onCreate,
  searchableKeys = ["title", "description"],
  className,
}: StandardKanbanProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = [...items];
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status.toLowerCase() === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchableKeys.some((key) =>
          String((item as any)[key] ?? "").toLowerCase().includes(q)
        )
      );
    }
    return result;
  }, [items, search, statusFilter, searchableKeys]);

  if (items.length === 0) {
    return (
      <div className={cn("rounded-xl border bg-card", className)}>
        <EmptyState
          title="No items yet"
          description="Create your first item to get started."
          action={onCreate ? <button onClick={onCreate} className='text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'>Add Item</button> : undefined}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colItems = filtered.filter(
            (item) => item.status.toLowerCase() === col.id.toLowerCase()
          );
          return (
            <div key={col.id} className="rounded-xl border bg-card/50">
              <div className="flex items-center gap-2 px-4 py-3 border-b">
                <div className={cn("h-2.5 w-2.5 rounded-full", col.color)} />
                <span className="text-sm font-semibold">{col.title}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {colItems.length}
                </Badge>
              </div>
              <div className="p-2 space-y-2 min-h-[120px]">
                {colItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No items
                  </p>
                ) : (
                  colItems.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => onEdit?.(item)}
                    >
                      <div className="flex items-start gap-2">
                        <GripVerticalIcon className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {item.priority && (
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                                  PRIORITY_COLORS[item.priority]
                                )}
                              >
                                {item.priority}
                              </span>
                            )}
                            {item.overdue && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-red-500/15 text-red-700 dark:text-red-400">
                                Overdue
                              </span>
                            )}
                            {item.assignee && (
                              <span className="text-[10px] text-muted-foreground">
                                {item.assignee}
                              </span>
                            )}
                          </div>
                          {item.progress !== undefined && (
                            <div className="mt-2">
                              <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}