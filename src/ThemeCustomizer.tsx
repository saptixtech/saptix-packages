"use client";

import React, { useState, useEffect, useCallback } from "react";

const COLOR_PRESETS = {
  teal:    { label: "Teal",    oklch: "oklch(0.7 0.14 180)",  fg: "oklch(0.145 0 0)",  swatch: "#0d9488" },
  cyan:    { label: "Cyan",    oklch: "oklch(0.7 0.14 200)",  fg: "oklch(0.145 0 0)",  swatch: "#06b6d4" },
  mint:    { label: "Mint",    oklch: "oklch(0.7 0.15 160)",  fg: "oklch(0.145 0 0)",  swatch: "#34d399" },
  sky:     { label: "Sky",     oklch: "oklch(0.68 0.16 225)", fg: "oklch(0.145 0 0)",  swatch: "#38bdf8" },
  blue:    { label: "Blue",    oklch: "oklch(0.62 0.18 260)", fg: "oklch(0.985 0 0)",  swatch: "#3b82f6" },
  indigo:  { label: "Indigo",  oklch: "oklch(0.6 0.2 275)",   fg: "oklch(0.985 0 0)",  swatch: "#6366f1" },
  violet:  { label: "Violet",  oklch: "oklch(0.65 0.22 300)", fg: "oklch(0.985 0 0)",  swatch: "#8b5cf6" },
  royal:   { label: "Royal",   oklch: "oklch(0.55 0.22 280)", fg: "oklch(0.985 0 0)",  swatch: "#4f46e5" },
  rose:    { label: "Rose",    oklch: "oklch(0.65 0.22 15)",  fg: "oklch(0.985 0 0)",  swatch: "#f43f5e" },
  amber:   { label: "Amber",   oklch: "oklch(0.75 0.18 65)",  fg: "oklch(0.145 0 0)",  swatch: "#f59e0b" },
  emerald: { label: "Emerald", oklch: "oklch(0.62 0.17 155)", fg: "oklch(0.985 0 0)",  swatch: "#10b981" },
};

const FONT_OPTIONS = {
  inter:   { label: "Inter",              css: "'Inter','Plus Jakarta Sans',sans-serif" },
  geist:   { label: "Geist",              css: "'Geist','Geist Sans',-apple-system,sans-serif" },
  roboto:  { label: "Roboto",             css: "'Roboto',sans-serif" },
  outfit:  { label: "Outfit",             css: "'Outfit',sans-serif" },
  jakarta: { label: "Plus Jakarta Sans",  css: "'Plus Jakarta Sans',sans-serif" },
};

const RADIUS_OPTIONS = { "6px": "0.375rem", "10px": "0.625rem", "16px": "1.0rem" };

type ThemeConfig = { mode: string; color: string; font: string; radius: string; };

const DEFAULT_CONFIG: ThemeConfig = { mode: "dark", color: "teal", font: "inter", radius: "10px" };

function loadConfig(): ThemeConfig {
  try {
    const raw = localStorage.getItem("saptix-theme-config");
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}

function applyConfig(cfg: ThemeConfig) {
  const doc = document.documentElement;
  if (cfg.mode === "dark") {
    doc.classList.add("dark"); doc.classList.remove("light"); doc.setAttribute("data-theme", "dark");
  } else {
    doc.classList.remove("dark"); doc.classList.add("light"); doc.setAttribute("data-theme", "light");
  }
  const preset = COLOR_PRESETS[cfg.color as keyof typeof COLOR_PRESETS] || COLOR_PRESETS.teal;
  doc.style.setProperty("--primary", preset.oklch);
  doc.style.setProperty("--primary-foreground", preset.fg);
  doc.style.setProperty("--ring", preset.oklch);
  doc.style.setProperty("--brand", preset.oklch);
  doc.style.setProperty("--brand-foreground", preset.fg);
  doc.style.setProperty("--sidebar-primary", preset.oklch);
  doc.style.setProperty("--sidebar-primary-foreground", preset.fg);
  doc.style.setProperty("--sidebar-ring", preset.oklch);
  doc.setAttribute("data-color-preset", cfg.color);
  const fontOpt = FONT_OPTIONS[cfg.font as keyof typeof FONT_OPTIONS] || FONT_OPTIONS.inter;
  doc.style.setProperty("--font-sans", fontOpt.css);
  doc.setAttribute("data-font", cfg.font);
  const radiusVal = RADIUS_OPTIONS[cfg.radius as keyof typeof RADIUS_OPTIONS] || "0.625rem";
  doc.style.setProperty("--radius", radiusVal);
  doc.setAttribute("data-radius", cfg.radius);
  localStorage.setItem("saptix-theme-config", JSON.stringify(cfg));
}

export function ThemeCustomizer() {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [open, setOpen] = useState(false);

  useEffect(() => { const cfg = loadConfig(); setConfig(cfg); applyConfig(cfg); }, []);

  const update = useCallback((partial: Partial<ThemeConfig>) => {
    setConfig(prev => { const next = { ...prev, ...partial }; applyConfig(next); return next; });
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Open theme customizer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-80 max-h-[80vh] overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-2xl animate-scale-in p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Theme Customizer</h3>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none">&times;</button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mode</label>
        <div className="flex gap-2">
          {["light", "dark"].map(m => (
            <button key={m} onClick={() => update({ mode: m })}
              className={`flex-1 text-xs py-2 rounded-lg border transition-all capitalize ${config.mode === m ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(COLOR_PRESETS).map(([key, val]) => (
            <button key={key} onClick={() => update({ color: key })} title={val.label}
              className={`w-7 h-7 rounded-full border-2 transition-all ${config.color === key ? "border-foreground scale-110 ring-2 ring-primary/30" : "border-transparent hover:scale-105"}`}
              style={{ backgroundColor: val.swatch }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Font</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(FONT_OPTIONS).map(([key, val]) => (
            <button key={key} onClick={() => update({ font: key })}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${config.font === key ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >{val.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Radius</label>
        <div className="flex gap-2">
          {Object.keys(RADIUS_OPTIONS).map(r => (
            <button key={r} onClick={() => update({ radius: r })}
              className={`flex-1 text-xs py-2 rounded-lg border transition-all ${config.radius === r ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >{r}</button>
          ))}
        </div>
      </div>

      <button onClick={() => update(DEFAULT_CONFIG)}
        className="w-full text-xs py-2 rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-all">
        Reset to Defaults
      </button>
    </div>
  );
}

export default ThemeCustomizer;
