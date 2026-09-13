'use client';

import React, { useState } from 'react';
import { 
  Bell, CheckCheck, X, ExternalLink, ShieldAlert, Sparkles, 
  Cpu, Activity, Target, CheckCircle2, AlertTriangle, Info, BellOff,
  Clock, ArrowRight
} from 'lucide-react';
import type { SaptixNotification } from './useSaptixNotifications';

export interface SaptixNotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications: SaptixNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onOpenSettings?: () => void;
}

function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (_) {
    return 'recently';
  }
}

function getStakeIcon(stake: string, type: string) {
  if (stake === 'security' || type === 'security') {
    return <ShieldAlert className="size-4 text-amber-500" />;
  }
  if (stake === 'gate') {
    return <Sparkles className="size-4 text-purple-400" />;
  }
  if (stake === 'modeler') {
    return <Cpu className="size-4 text-blue-400" />;
  }
  if (stake === 'spectra') {
    return <Activity className="size-4 text-emerald-400" />;
  }
  if (stake === 'lead') {
    return <Target className="size-4 text-rose-400" />;
  }
  if (type === 'success') {
    return <CheckCircle2 className="size-4 text-emerald-500" />;
  }
  if (type === 'warning' || type === 'alert') {
    return <AlertTriangle className="size-4 text-amber-500" />;
  }
  return <Info className="size-4 text-cyan-400" />;
}

export function SaptixNotificationDropdown({
  open,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onOpenSettings,
}: SaptixNotificationDropdownProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'system'>('all');

  if (!open) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'system') return n.stake === 'system' || n.stake === 'security' || n.type === 'security';
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <span className="font-semibold text-xs text-foreground tracking-tight">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5 text-primary" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/40 bg-muted/10 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
              filter === 'unread'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('system')}
            className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors cursor-pointer ${
              filter === 'system'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Security & System
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/30 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
              <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center mb-2.5">
                <BellOff className="size-5 text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications in this view.'}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.read) onMarkAsRead(item.id);
                }}
                className={`p-3 transition-colors flex items-start gap-2.5 group relative cursor-pointer ${
                  !item.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                }`}
              >
                {/* Icon */}
                <div className="size-8 rounded-xl bg-background border border-border/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getStakeIcon(item.stake, item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </span>
                    {!item.read && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground/70">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {timeAgo(item.created_at)}
                    </span>
                    <span className="uppercase font-mono tracking-wider font-semibold text-[9px] px-1 py-0.2 rounded bg-muted/80">
                      {item.stake}
                    </span>
                    {item.link_url && (
                      <a
                        href={item.link_url}
                        target="_self"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-0.5 text-primary hover:underline font-medium"
                      >
                        <span>Open</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted absolute top-2 right-2 cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-[11px]">
          <a
            href="https://account.saptix.tech"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 font-medium transition-colors"
          >
            <span>Account Portal</span>
            <ArrowRight className="size-3" />
          </a>
          <span className="text-[10px] text-muted-foreground/60 font-mono">
            auth.saptix.tech
          </span>
        </div>
      </div>
    </>
  );
}
