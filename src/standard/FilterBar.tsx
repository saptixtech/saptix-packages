"use client";
import { useState, useCallback } from "react";
import { SearchIcon, XIcon } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  filterOptions?: FilterOption[];
  searchPlaceholder?: string;
  rightSlot?: React.ReactNode;
}

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  filterOptions,
  searchPlaceholder = "Search…",
  rightSlot,
}: FilterBarProps) {
  const clearSearch = useCallback(() => onSearchChange(""), [onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b bg-muted/20">
      {/* Search input */}
      <div className="relative flex-1 min-w-[160px] max-w-xs">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
          className="w-full h-8 pl-8 pr-8 text-sm rounded-md border border-border/60 bg-background/80 focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground/60 transition-colors"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      {filterOptions && filterOptions.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors border ${
              statusFilter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-border"
            }`}
            aria-label="Show all"
            aria-pressed={statusFilter === "all"}
          >
            All
          </button>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors border capitalize ${
                statusFilter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-border"
              }`}
              aria-label={`Filter by ${opt.label}`}
              aria-pressed={statusFilter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Right slot */}
      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </div>
  );
}