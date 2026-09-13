'use client';

import React, { useState, useEffect } from "react";
import { 
  Sun, Moon, PanelLeft, Layers, Check, ExternalLink,
  ChevronDown, LogOut, User, ShieldCheck, Activity, Palette 
} from "lucide-react";
import { LogoSvg } from "./LogoSvg";
import { SAPTIX_PORTAL_TABS, SAPTIX_APPS } from "./saptix-navigation";

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
  const [userEmail, setUserEmail] = useState("admin@saptix.com");
  const [userName, setUserName] = useState("Sanjay");

  // Single Sign-Out Broadcast Listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentHost(window.location.hostname);

    try {
      const storedUser = localStorage.getItem("saptix_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.email) setUserEmail(u.email);
        if (u.name) setUserName(u.name);
      }
    } catch (_) {}

    try {
      const storedTheme = localStorage.getItem("saptix-theme-config");
      if (storedTheme) {
        const parsed = JSON.parse(storedTheme);
        if (parsed?.mode) {
          setIsDark(parsed.mode === "dark");
        }
      } else {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    } catch (_) {
      setIsDark(document.documentElement.classList.contains("dark"));
    }

    // BroadcastChannel cross-tab logout receiver
    try {
      const bc = new BroadcastChannel("saptix_sso");
      bc.onmessage = (event) => {
        if (event.data && event.data.type === "LOGOUT") {
          window.location.href = window.location.origin + "/login?logged_out=1";
        }
      };
      return () => bc.close();
    } catch (_) {}
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextDark);
      try {
        const stored = localStorage.getItem("saptix-theme-config");
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.mode = nextDark ? "dark" : "light";
        localStorage.setItem("saptix-theme-config", JSON.stringify(parsed));
      } catch (_) {}
    }
  };

  const applyColor = (key: string) => {
    setCurrentColor(key);
    const preset = COLOR_PRESETS[key];
    if (preset && typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary", preset.oklch);
      document.documentElement.style.setProperty("--primary-foreground", preset.fg);
      document.documentElement.style.setProperty("--ring", preset.oklch);
      document.documentElement.style.setProperty("--brand", preset.oklch);
      document.documentElement.style.setProperty("--sidebar-primary", preset.oklch);
      try {
        const stored = localStorage.getItem("saptix-theme-config");
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.color = key;
        localStorage.setItem("saptix-theme-config", JSON.stringify(parsed));
      } catch (_) {}
    }
  };

  const handleGlobalLogout = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("saptix_token");
        localStorage.removeItem("saptix_user");
        localStorage.removeItem("saptix_session");
        localStorage.removeItem("saptix_sso_session");
        localStorage.removeItem("access_token");
        sessionStorage.clear();
      } catch (_) {}

      // Broadcast logout to all open tabs across subdomains
      try {
        const bc = new BroadcastChannel("saptix_sso");
        bc.postMessage({ type: "LOGOUT", timestamp: Date.now() });
        bc.close();
      } catch (_) {}

      // Clear cookies on .saptix.tech and localhost
      const expired = "=; Domain=.saptix.tech; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
      const expiredLocal = "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      const cookieNames = ["saptix_token", "saptix_session", "saptix_auth", "saptix_sso_session", "token", "refreshToken"];
      cookieNames.forEach((name) => {
        document.cookie = name + expired;
        document.cookie = name + expiredLocal;
      });

      const targetRedirect = window.location.origin + "/login?logged_out=1";
      window.location.href = "https://auth.saptix.tech/api/auth/logout?redirect=" + encodeURIComponent(targetRedirect);
    }
  };

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-colors duration-200">
      <div className="flex h-full items-center justify-between px-3 md:px-5 gap-3">
        {/* Left: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label="Toggle Sidebar"
            >
              <PanelLeft className="size-4.5" />
            </button>
          )}

          <a href="https://saptix.tech" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shadow-xs group-hover:scale-105 transition-transform">
              <LogoSvg className="size-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                {appName}
                {appBadge && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {appBadge}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-muted-foreground/80 font-mono -mt-0.5">
                {subdomain}.saptix.tech
              </span>
            </div>
          </a>
        </div>

        {/* Center: Universal Segmented Portal Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 backdrop-blur-xs">
          {SAPTIX_PORTAL_TABS.map((tab) => {
            const isTabActive =
              currentHost.includes(tab.id) ||
              (tab.id === "hub" && (currentHost === "saptix.tech" || currentHost === "www.saptix.tech"));
            return (
              <a
                key={tab.id}
                href={tab.href}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isTabActive
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Ecosystem Apps Dropdown, Theme Switcher & User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ecosystem Apps Grid */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAppsOpen(!appsOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                appsOpen
                  ? "bg-muted text-foreground border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70 border-transparent"
              } cursor-pointer`}
              title="All Saptix Ecosystem Apps"
            >
              <Layers className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Ecosystem</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {appsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAppsOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl p-3 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                      Saptix Enterprise Suite
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                      21 Integrated Services
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
                    {SAPTIX_APPS.map((app) => (
                      <a
                        key={app.sub}
                        href={app.url}
                        className="flex items-start gap-2 p-2 rounded-xl hover:bg-accent/80 transition-colors group"
                      >
                        <span className="text-base shrink-0 p-1 rounded-lg bg-background border border-border/40 group-hover:scale-110 transition-transform">
                          {app.icon}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {app.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1">
                            {app.desc}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Palette Customizer */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCustomizerOpen(!customizerOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              title="Customize Color Theme"
            >
              <Palette className="size-4" />
            </button>

            {customizerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCustomizerOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl p-3.5 shadow-2xl z-50">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono block mb-2">
                    Theme Accent Color
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applyColor(key)}
                        className={`size-8 rounded-xl border-2 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                          currentColor === key ? "border-primary scale-105 shadow-xs" : "border-border/60"
                        }`}
                        style={{ backgroundColor: preset.swatch }}
                        title={preset.label}
                      >
                        {currentColor === key && <Check className="size-3.5 text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Light/Dark Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-sky-600" />}
          </button>

          {/* User Profile & Single Sign-Out Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl border border-border/70 hover:bg-muted/80 transition-all duration-150 cursor-pointer group"
            >
              <div className="size-7 rounded-lg bg-primary/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/30">
                {userInitials}
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-border/60 mb-1">
                    <span className="text-xs font-semibold text-foreground block truncate">{userName}</span>
                    <span className="text-[11px] text-muted-foreground block truncate">{userEmail}</span>
                    <span className="inline-block mt-1 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Enterprise SSO Active
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <a
                      href="https://account.saptix.tech"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                      <User className="size-3.5 text-muted-foreground" />
                      <span>Account & Profile</span>
                    </a>
                    <a
                      href="https://account.saptix.tech"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-foreground rounded-lg hover:bg-muted transition-colors"
                    >
                      <ShieldCheck className="size-3.5 text-muted-foreground" />
                      <span>Security & API Keys</span>
                    </a>
                  </div>
                  <div className="my-1.5 h-px bg-border/60" />
                  <button
                    type="button"
                    onClick={handleGlobalLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors text-left font-medium"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out (Global SSO)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default SaptixHeader;
