'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Command, ExternalLink, Sparkles, Moon, Sun, 
  Palette, LogOut, Layers, Copy, Check, ArrowRight, CornerDownLeft, X
} from 'lucide-react';
import { SAPTIX_APPS } from './saptix-navigation';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Ecosystem' | 'Actions' | 'Navigation';
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  url?: string;
  action?: () => void;
}

export interface GlobalCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTheme?: () => void;
  onCycleColor?: () => void;
  onLogout?: () => void;
  appName?: string;
}

export function GlobalCommandPalette({
  open,
  onOpenChange,
  onToggleTheme,
  onCycleColor,
  onLogout,
  appName = "Saptix",
}: GlobalCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Command items collection
  const allItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [];

    // 1. Ecosystem apps
    SAPTIX_APPS.forEach((app) => {
      items.push({
        id: `app-${app.sub}`,
        title: app.name,
        category: 'Ecosystem',
        description: `${app.sub}.saptix.tech — ${app.desc}`,
        badge: app.badge,
        icon: <span className="text-base shrink-0">{app.icon}</span>,
        url: app.url,
      });
    });

    // 2. Quick Actions
    if (onToggleTheme) {
      items.push({
        id: 'action-theme',
        title: 'Toggle Color Theme (Dark / Light)',
        category: 'Actions',
        description: 'Switch between dark mode and high-contrast light mode',
        icon: <Sun className="size-4 text-amber-400 shrink-0" />,
        action: onToggleTheme,
      });
    }

    if (onCycleColor) {
      items.push({
        id: 'action-color',
        title: 'Cycle OKLCH Brand Accent Color',
        category: 'Actions',
        description: 'Switch between Teal, Sapphire, Emerald, Violet & Cyan presets',
        icon: <Palette className="size-4 text-primary shrink-0" />,
        action: onCycleColor,
      });
    }

    items.push({
      id: 'action-copy-url',
      title: 'Copy Current Page URL',
      category: 'Actions',
      description: 'Copy link to clipboard for sharing',
      icon: copied ? <Check className="size-4 text-emerald-400 shrink-0" /> : <Copy className="size-4 text-muted-foreground shrink-0" />,
      action: () => {
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      },
    });

    if (onLogout) {
      items.push({
        id: 'action-logout',
        title: 'Global Single Sign-Out (Logout)',
        category: 'Actions',
        description: 'Terminate active session across all .saptix.tech stakes',
        icon: <LogOut className="size-4 text-rose-400 shrink-0" />,
        action: onLogout,
      });
    }

    return items;
  }, [onToggleTheme, onCycleColor, onLogout, copied]);

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Handle arrow navigation & selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        executeItem(selected);
      }
    }
  };

  const executeItem = (item: CommandItem) => {
    onOpenChange(false);
    if (item.action) {
      item.action();
    } else if (item.url) {
      window.location.href = item.url;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-3 sm:px-4">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh] animate-in fade-in-50 zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 shrink-0">
          <Search className="size-4 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 21 apps, routes, commands (⌘K)..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              <X className="size-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/80 rounded border border-border/50">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No matching commands or apps found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? 'bg-primary/15 text-primary border border-primary/25 shadow-2xs font-medium'
                      : 'text-foreground hover:bg-muted/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1 rounded-lg shrink-0 ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-foreground truncate flex items-center gap-2">
                        {item.title}
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      {item.description && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground/60 hidden sm:inline">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="size-3 text-primary shrink-0" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-muted/40 text-[11px] text-muted-foreground shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-background border border-border/60 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-background border border-border/60 font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-background border border-border/60 font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/70">
            {filteredItems.length} items
          </span>
        </div>
      </div>
    </div>
  );
}
