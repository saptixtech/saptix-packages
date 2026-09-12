
const COLOR_PRESETS: Record<string, { label: string; oklch: string; fg: string; swatch: string }> = {
  teal:    { label: "Teal",    oklch: "oklch(0.65 0.18 175)", fg: "oklch(0.985 0 0)",  swatch: "#14b8a6" },
  cyan:    { label: "Cyan",    oklch: "oklch(0.7 0.15 200)",  fg: "oklch(0.145 0 0)",  swatch: "#06b6d4" },
  sky:     { label: "Sky",     oklch: "oklch(0.68 0.16 225)", fg: "oklch(0.145 0 0)",  swatch: "#38bdf8" },
  blue:    { label: "Blue",    oklch: "oklch(0.62 0.18 260)", fg: "oklch(0.985 0 0)",  swatch: "#3b82f6" },
  indigo:  { label: "Indigo",  oklch: "oklch(0.6 0.2 275)",   fg: "oklch(0.985 0 0)",  swatch: "#6366f1" },
  violet:  { label: "Violet",  oklch: "oklch(0.65 0.22 300)", fg: "oklch(0.985 0 0)",  swatch: "#8b5cf6" },
  royal:   { label: "Royal",   oklch: "oklch(0.55 0.22 280)", fg: "oklch(0.985 0 0)",  swatch: "#4f46e5" },
  rose:    { label: "Rose",    oklch: "oklch(0.65 0.22 15)",  fg: "oklch(0.985 0 0)",  swatch: "#f43f5e" },
  amber:   { label: "Amber",   oklch: "oklch(0.75 0.18 65)",  fg: "oklch(0.145 0 0)",  swatch: "#f59e0b" },
  emerald: { label: "Emerald", oklch: "oklch(0.62 0.17 155)", fg: "oklch(0.985 0 0)",  swatch: "#10b981" },
};

'use client';

import React, { useState, useEffect } from "react";
import { 
  Sun, Moon, PanelLeft, Layers, Check, ExternalLink,
  ChevronDown, LogOut, User, ShieldCheck, Activity, Palette } , Palette } from "lucide-react";
import { LogoSvg } from "./LogoSvg";
import { SAPTIX_PORTAL_TABS, SAPTIX_APPS } from "./saptix-navigation";

export interface SaptixHeaderProps {
  appName: string;
  appBadge?: string;
  subdomain?: string;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export function SaptixHeader({
  appName = "Saptix Workspace",
  appBadge = "v3.0",
  subdomain = "Portal",
  onToggleSidebar,
  sidebarCollapsed = false,
}: SaptixHeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [appsOpen, setAppsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("teal");
  const [currentHost, setCurrentHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.hostname);
      try {
        const stored = localStorage.getItem("saptix-theme-config");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.mode) {
            setIsDark(parsed.mode === "dark");
          }
        } else {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      } catch (e) {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    }
  }, []);

  
  const applyColor = (colorKey: string) => {
    setCurrentColor(colorKey);
    if (typeof window !== "undefined") {
      const doc = document.documentElement;
      const preset = COLOR_PRESETS[colorKey] || COLOR_PRESETS.teal;
      doc.style.setProperty("--primary", preset.oklch);
      doc.style.setProperty("--primary-foreground", preset.fg);
      doc.style.setProperty("--ring", preset.oklch);
      doc.style.setProperty("--brand", preset.oklch);
      doc.style.setProperty("--brand-foreground", preset.fg);
      doc.style.setProperty("--sidebar-primary", preset.oklch);
      doc.style.setProperty("--sidebar-primary-foreground", preset.fg);
      doc.style.setProperty("--sidebar-ring", preset.oklch);
      doc.setAttribute("data-color-preset", colorKey);
      try {
        const stored = JSON.parse(localStorage.getItem("saptix-theme-config") || "{}");
        localStorage.setItem("saptix-theme-config", JSON.stringify({ ...stored, color: colorKey }));
      } catch (e) {}
    }
  };

  const toggleTheme = () => {
    const nextMode = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    if (typeof window !== "undefined") {
      const doc = document.documentElement;
      if (nextMode === "dark") {
        doc.classList.add("dark");
        doc.classList.remove("light");
        doc.setAttribute("data-theme", "dark");
      } else {
        doc.classList.remove("dark");
        doc.classList.add("light");
        doc.setAttribute("data-theme", "light");
      }
      try {
        const existing = localStorage.getItem("saptix-theme-config");
        const conf = existing ? JSON.parse(existing) : {};
        conf.mode = nextMode;
        localStorage.setItem("saptix-theme-config", JSON.stringify(conf));
        window.dispatchEvent(new Event("saptix-theme-change"));
      } catch (e) {}
    }
  };

  const activeSub = subdomain.toLowerCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/90 px-3 sm:px-5 lg:px-6 backdrop-blur-xl transition-all select-none">
      {/* Left: Sidebar Toggle + Brand Logo + App Name */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 border border-transparent hover:border-border/60 transition-all cursor-pointer shrink-0"
          title={sidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center p-1 shrink-0">
            <LogoSvg className="size-full" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground truncate max-w-[130px] sm:max-w-[190px] md:max-w-[240px]">
            {appName}
          </span>
          {appBadge && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border/60 shrink-0">
              {appBadge}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Universal 9-Stake Quick Portal Tabs (Clean, Scrollable, Non-Colliding) */}
      <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2 sm:px-4">
        <nav className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40 overflow-x-auto scrollbar-none max-w-full">
          {SAPTIX_PORTAL_TABS.map((tab) => {
            const isCurrent = activeSub.includes(tab.id) || currentHost.includes(tab.id);
            return (
              <a
                key={tab.id}
                href={tab.href}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Right: Telemetry Badge + Apps Switcher + Theme Toggle + User SSO Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Live System Status Indicator (Adaptive width) */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[11px] font-medium shrink-0">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System: Optimal • 18ms</span>
        </div>
        <div 
          className="hidden md:flex 2xl:hidden items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[11px] font-medium shrink-0 cursor-default"
          title="System: Optimal • 18ms (Saptix Edge Node)"
        >
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>18ms</span>
        </div>

        {/* 12-App Ecosystem Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAppsOpen(!appsOpen)}
            className="flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-lg border border-border bg-card/60 text-xs font-medium text-foreground hover:bg-accent/80 hover:border-border/80 transition-all cursor-pointer shadow-2xs"
            title="Saptix Enterprise Suite Apps"
            aria-label="Saptix Ecosystem Apps"
          >
            <Layers className="size-3.5 text-primary" />
            <span className="hidden sm:inline font-semibold">Apps</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>

          {appsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAppsOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-2.5 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-border/60 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Saptix Connected Ecosystem</span>
                    <span className="text-[10px] text-muted-foreground font-mono">21 Ecosystem Apps</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Unified enterprise SSO navigation across active services
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-0.5">
                  {SAPTIX_APPS.map((app) => {
                    const isCurrent = activeSub.includes(app.sub) || currentHost.includes(app.sub);
                    return (
                      <a
                        key={app.name}
                        href={app.url}
                        className={`flex items-start gap-2 p-2 rounded-xl border transition-all text-left group ${
                          isCurrent
                            ? "bg-primary/15 text-primary border-primary/40 ring-1 ring-primary/25"
                            : "border-transparent bg-muted/20 hover:bg-muted/60 text-foreground hover:border-border/60"
                        }`}
                      >
                        <span className="text-sm leading-none p-1 rounded-lg bg-background border border-border/40 shrink-0">
                          {app.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{app.name}</span>
                            {isCurrent && <Check className="size-3 text-primary shrink-0" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                            {app.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        
        {/* OKLCH Theme Customizer Trigger & Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCustomizerOpen(!customizerOpen)}
            className={`flex items-center justify-center size-8 rounded-lg border transition-all cursor-pointer shadow-2xs ${
              customizerOpen 
                ? "border-primary bg-primary/15 text-primary" 
                : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/80"
            }`}
            title="OKLCH Color Palette Presets"
            aria-label="OKLCH Theme Palette"
          >
            <Palette className="size-4 text-primary" />
          </button>

          {customizerOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCustomizerOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-72 rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-3.5 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">OKLCH Theme Presets</h4>
                    <p className="text-[10px] text-muted-foreground">Universal runtime dynamic color tokens</p>
                  </div>
                  <button 
                    onClick={() => setCustomizerOpen(false)} 
                    className="text-muted-foreground hover:text-foreground text-sm font-bold leading-none p-1"
                  >
                    &times;
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(COLOR_PRESETS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => applyColor(key)}
                      className={`group flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                        currentColor === key 
                          ? "border-primary bg-primary/15 scale-105" 
                          : "border-transparent hover:bg-muted/60"
                      }`}
                      title={val.label}
                    >
                      <span 
                        className="size-5 rounded-full border border-black/10 shadow-xs group-hover:scale-110 transition-transform" 
                        style={{ backgroundColor: val.swatch }} 
                      />
                      <span className="text-[9px] font-medium text-muted-foreground group-hover:text-foreground truncate">
                        {val.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center size-8 rounded-lg border border-border/80 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all cursor-pointer shadow-2xs"
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-400" />}
        </button>

        {/* User SSO Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-center size-8 rounded-full border border-border/80 bg-primary/10 hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus:outline-none shrink-0"
            aria-label="User SSO Menu"
            title="Saptix SSO Profile"
          >
            <span className="text-xs font-bold text-primary">SA</span>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-2.5 py-2 border-b border-border/60 mb-1">
                  <p className="text-xs font-semibold text-foreground">Admin Saptix</p>
                  <p className="text-[10px] text-muted-foreground truncate font-mono">admin@saptix.tech</p>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">Enterprise SSO Active</span>
                </div>
                <div className="space-y-0.5">
                  <a
                    href="https://account.saptix.tech"
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground cursor-pointer rounded-lg hover:bg-muted transition-colors"
                  >
                    <User className="size-3.5 text-muted-foreground" />
                    <span>Account & Profile</span>
                  </a>
                  <a
                    href="https://account.saptix.tech"
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground cursor-pointer rounded-lg hover:bg-muted transition-colors"
                  >
                    <ShieldCheck className="size-3.5 text-muted-foreground" />
                    <span>Security & API Keys</span>
                  </a>
                </div>
                <div className="my-1.5 h-px bg-border/60" />
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("saptix_token");
                      localStorage.removeItem("access_token");
                      window.location.href = "https://account.saptix.tech";
                    }
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default SaptixHeader;
