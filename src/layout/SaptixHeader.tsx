'use client';

import React, { useState, useEffect } from "react";
import { 
  Sun, Moon, PanelLeft, Layers, Check, ExternalLink,
  ChevronDown, LogOut, User, ShieldCheck, Activity, Palette, Search, Bell
} from "lucide-react";
import { LogoSvg } from "./LogoSvg";
import { SAPTIX_PORTAL_TABS, SAPTIX_APPS } from "./saptix-navigation";
import { GlobalCommandPalette } from "./GlobalCommandPalette";
import { SaptixProfileSettingsModal } from "./SaptixProfileSettingsModal";
import { useSaptixNotifications } from "./useSaptixNotifications";
import { SaptixNotificationDropdown } from "./SaptixNotificationDropdown";

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
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useSaptixNotifications();
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
        if (parsed?.primaryColor && COLOR_PRESETS[parsed.primaryColor]) {
          setCurrentColor(parsed.primaryColor);
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
    const preset = COLOR_PRESETS[key];
    if (!preset) return;
    setCurrentColor(key);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary", preset.oklch);
      document.documentElement.style.setProperty("--primary-foreground", preset.fg);
      document.documentElement.style.setProperty("--ring", preset.oklch);
      try {
        const stored = localStorage.getItem("saptix-theme-config");
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.primaryColor = key;
        localStorage.setItem("saptix-theme-config", JSON.stringify(parsed));
      } catch (_) {}
    }
  };

  const cycleColor = () => {
    const keys = Object.keys(COLOR_PRESETS);
    const currIdx = keys.indexOf(currentColor);
    const nextKey = keys[(currIdx + 1) % keys.length];
    applyColor(nextKey);
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
    <>
      <header className="sticky top-0 z-40 w-full h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-colors duration-200">
        <div className="flex h-full items-center justify-between px-3 md:px-5 gap-2 sm:gap-3">
          {/* Left: Sidebar Toggle & Desktop Breadcrumbs Context */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-150 cursor-pointer active:scale-[0.96]"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                aria-label="Toggle Sidebar"
              >
                <PanelLeft className="size-4.5" />
              </button>
            )}

            {/* Desktop Breadcrumbs: Eliminates duplicate brand logo since sidebar owns brand */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                {appName}
                {appBadge && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {appBadge}
                  </span>
                )}
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {subdomain || "Portal"}
              </span>
            </div>

            {/* Mobile Brand: Shown only on small viewports (< 768px) where sidebar is in drawer */}
            <a href="https://saptix.tech" className="md:hidden flex items-center gap-2 group">
              <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center p-1 shadow-xs">
                <LogoSvg className="size-full" />
              </div>
              <span className="font-bold text-xs tracking-tight text-foreground truncate max-w-[110px]">
                {appName}
              </span>
            </a>
          </div>

          {/* Center: Global Command & Search Bar (⌘K) */}
          <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-md mx-1 sm:mx-3">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="w-full h-8.5 px-2.5 sm:px-3 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/60 hover:border-border/90 text-xs text-muted-foreground flex items-center justify-between gap-2 transition-all duration-150 group shadow-2xs cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <span className="truncate hidden sm:inline">Search apps, commands, or press...</span>
                <span className="truncate sm:hidden">Search...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground/80 bg-background/80 rounded border border-border/60 shadow-2xs">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right: Ecosystem Apps Dropdown, Segmented Tabs, Theme Switcher & User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Universal Segmented Portal Navigation Tabs (Wide Desktop only) */}
            <nav className="hidden xl:flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 backdrop-blur-xs">
              {SAPTIX_PORTAL_TABS.map((tab) => {
                const isTabActive =
                  currentHost.includes(tab.id) ||
                  (tab.id === "hub" && (currentHost === "saptix.tech" || currentHost === "www.saptix.tech"));
                return (
                  <a
                    key={tab.id}
                    href={tab.href}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
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

            {/* Ecosystem Apps Grid */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAppsOpen(!appsOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border active:scale-[0.97] ${
                  appsOpen
                    ? "bg-muted text-foreground border-border shadow-xs"
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
                    <div className="grid grid-cols-2 gap-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
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
                            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {app.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
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

            {/* Theme Color Customizer Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCustomizerOpen(!customizerOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 cursor-pointer active:scale-[0.96]"
                title="Customize OKLCH Accent Theme"
              >
                <Palette className="size-4 text-primary" />
              </button>

              {customizerOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCustomizerOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl p-3.5 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 font-mono">
                      Brand Accent Color
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            applyColor(key);
                            setCustomizerOpen(false);
                          }}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                          title={preset.label}
                        >
                          <span
                            className="size-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs border border-white/20"
                            style={{ backgroundColor: preset.swatch }}
                          >
                            {currentColor === key && (
                              <Check className="size-3.5 text-white stroke-[3]" />
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {preset.label.slice(0, 3)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 cursor-pointer active:scale-[0.96]"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-400" />}
            </button>

            {/* Universal Notification Center */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                  setAppsOpen(false);
                  setCustomizerOpen(false);
                }}
                className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 cursor-pointer active:scale-[0.96] relative ${
                  notificationsOpen ? "bg-muted text-foreground" : ""
                }`}
                title="Notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[15px] h-3.5 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold leading-none shadow-xs animate-in zoom-in-50 duration-150">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <SaptixNotificationDropdown
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDismiss={dismiss}
                onOpenSettings={() => {
                  setNotificationsOpen(false);
                  setProfileModalOpen(true);
                }}
              />
            </div>


            {/* User Profile & Single Sign-Out Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-muted/80 transition-all duration-150 border border-border/40 hover:border-border cursor-pointer active:scale-[0.97]"
              >
                <div className="size-7 rounded-lg bg-gradient-to-tr from-primary to-primary/60 text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
                  {userInitials}
                </div>
                <div className="hidden md:flex flex-col items-start text-left leading-tight">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[90px]">
                    {userName}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SSO
                  </span>
                </div>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <div className="font-semibold text-xs text-foreground">{userName}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{userEmail}</div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <ShieldCheck className="size-3" />
                        Cross-Stake Single Sign-On Active
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/70 transition-colors cursor-pointer text-left font-medium"
                    >
                      <User className="size-3.5 text-primary" />
                      Profile & Settings
                    </button>

                    <a
                      href="https://account.saptix.tech"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <Shield className="size-3.5 text-muted-foreground" />
                      Account & Security Portal
                    </a>

                    <a
                      href="https://auth.saptix.tech/health"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="size-3.5 text-muted-foreground" />
                        SSO Auth Gateway Health
                      </div>
                      <ExternalLink className="size-3 text-muted-foreground/60" />
                    </a>

                    <div className="my-1 border-t border-border/60" />

                    <button
                      type="button"
                      onClick={handleGlobalLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer font-medium active:scale-[0.98]"
                    >
                      <LogOut className="size-3.5 text-rose-500" />
                      Sign Out (Global Single Sign-Out)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Standalone Enterprise Command Palette Modal */}
      <GlobalCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onToggleTheme={toggleTheme}
        onCycleColor={cycleColor}
        onLogout={handleGlobalLogout}
        appName={appName}
      />

      {/* Universal Ecosystem Profile & User Settings Modal (auth.saptix.tech) */}
      <SaptixProfileSettingsModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
