"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SaptixLogo } from './saptix-logo';
import { PanelLeft, Sun, Moon, Search, Bell, LogOut, User, ExternalLink, ChevronDown } from 'lucide-react';

export const SAPTIX_PORTALS = [
  { id: 'marketing', name: 'Overview', url: 'https://saptix.tech' },
  { id: 'spectra', name: 'Spectra Telemetry', url: 'https://spectra.saptix.tech' },
  { id: 'scc', name: 'Cloud Connector', url: 'https://scc.saptix.tech' },
  { id: 'chat', name: 'AI Chat', url: 'https://chat.saptix.tech' },
  { id: 'account', name: 'Account & Billing', url: 'https://account.saptix.tech' },
  { id: 'admin', name: 'Enterprise Admin', url: 'https://admin.saptix.tech' },
  { id: 'agent', name: 'Agent Swarm', url: 'https://agent.saptix.tech' },
  { id: 'modeler', name: 'Architecture Modeler', url: 'https://modeler.saptix.tech' },
];

export function SaptixHeader({
  currentApp = 'spectra',
  onToggleSidebar,
}: {
  currentApp?: string;
  onToggleSidebar?: () => void;
}) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [profileOpen, setProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('admin@saptix.com');

  useEffect(() => {
    // Read active theme from localStorage or document
    const isDark = document.documentElement.classList.contains('dark') ||
                   localStorage.getItem('saptix-theme-mode') !== 'light';
    setTheme(isDark ? 'dark' : 'light');

    // Parse wildcard cookie
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [k, v] = c.trim().split('=');
      if (k === 'saptix_user' && v) {
        try { setUserEmail(decodeURIComponent(v)); } catch (e) {}
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('saptix-theme-mode', next);

    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('saptix_token');
        localStorage.removeItem('saptix_user');
        localStorage.removeItem('saptix_session');
        localStorage.removeItem('saptix_sso_session');
        localStorage.removeItem('access_token');
        sessionStorage.clear();
      } catch (_) {}
      const expired = '=; Domain=.saptix.tech; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'saptix_token' + expired;
      document.cookie = 'saptix_session' + expired;
      document.cookie = 'saptix_sso_session' + expired;
      document.cookie = 'saptix_auth' + expired;
      document.cookie = 'token' + expired;
      const targetRedirect = window.location.origin + '/login?logged_out=1';
      window.location.href = 'https://auth.saptix.tech/api/auth/logout?redirect=' + encodeURIComponent(targetRedirect);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md px-4 lg:px-6 py-2.5 flex items-center justify-between">
      {/* Left: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <PanelLeft className="size-4.5" />
          </button>
        )}

        <SaptixLogo stakeName={currentApp.toUpperCase()} />

        {/* Desktop Portal Switcher Tabs */}
        <nav className="hidden xl:flex items-center gap-1 ml-4 border-l border-border/80 pl-4">
          {SAPTIX_PORTALS.map((portal) => (
            <a
              key={portal.id}
              href={portal.url}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                currentApp === portal.id
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {portal.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Right: Quick Search, Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2">
        {/* Quick Search trigger */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/80 text-xs text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
          <Search className="size-3.5" />
          <span>Search SAPTIX...</span>
          <kbd className="ml-2 font-mono text-[10px] bg-background px-1.5 py-0.5 rounded border border-border text-muted-foreground">⌘K</kbd>
        </div>

        {/* View-Transition Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="size-9 rounded-lg flex items-center justify-center border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-slate-700" />}
        </button>

        {/* Notifications */}
        <button
          className="size-9 rounded-lg flex items-center justify-center border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer relative"
          title="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg border border-border/60 hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="size-7 rounded-md bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-xs font-medium text-foreground truncate max-w-[120px]">{userEmail}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-border/80">
                <p className="font-semibold truncate">{userEmail}</p>
                <p className="text-[11px] text-muted-foreground">Enterprise Administrator</p>
              </div>
              <a
                href="https://account.saptix.tech"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                <User className="size-4" />
                <span>Account Settings</span>
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sign Out Everywhere</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
