'use client';

import React, { useState, useEffect } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { LogoSvg } from "../layout/LogoSvg";

interface LoginPageProps {
  subdomain: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  showGoogleSSO?: boolean;
  showRegisterLink?: boolean;
  registerHref?: string;
  onGoogleLogin?: () => void;
}

export default function LoginPage({
  subdomain,
  onSubmit,
  showGoogleSSO = false,
  showRegisterLink = false,
  registerHref = "/register",
  onGoogleLogin,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loggedOutNotice, setLoggedOutNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("logged_out") === "1") {
        setLoggedOutNotice(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoggedOutNotice(false);
    setIsLoading(true);
    try {
      await onSubmit(email, password);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-primary/95 via-primary to-primary/80 relative overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-12 right-12 w-80 h-80 rounded-full bg-white/20 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Top Logo */}
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-2 shadow-lg">
              <LogoSvg className="size-full text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Saptix Enterprise</span>
          </div>

          {/* Center Pitch */}
          <div className="space-y-6 my-auto max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-mono">
              <Sparkles className="size-3.5" />
              <span>Unified Single Sign-On</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              One identity across the entire Saptix ecosystem.
            </h1>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Seamlessly navigate SAP Modeler, Spectra ERP, Agent Swarms, and Cognitive Chat with zero-trust token replication.
            </p>

            <div className="space-y-2.5 pt-4">
              <div className="flex items-center gap-2.5 text-xs text-primary-foreground/90">
                <CheckCircle2 className="size-4 shrink-0 text-white" />
                <span>Global Single Sign-Out across all *.saptix.tech stakes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-primary-foreground/90">
                <CheckCircle2 className="size-4 shrink-0 text-white" />
                <span>PostgreSQL 16 multi-schema referential integrity</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-primary-foreground/90">
                <CheckCircle2 className="size-4 shrink-0 text-white" />
                <span>Enterprise grade RFC / BAPI Cloud Connector</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="flex items-center justify-between pt-6 border-t border-white/15 text-[11px] text-primary-foreground/70 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-white" />
              <span>SOC2 Type II Certified</span>
            </div>
            <span>ISO 27001</span>
            <span>SAP Clean Core</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-[58%] relative">
        {/* Subtle Ambient Mesh Gradient */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="w-full max-w-md space-y-7 relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 p-2.5">
              <LogoSvg className="size-full text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{subdomain}.saptix.tech</h1>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Enter your enterprise credentials to access <span className="font-semibold text-foreground">{subdomain}</span>
            </p>
          </div>

          {/* Logged Out Notice */}
          {loggedOutNotice && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 animate-in fade-in-50 duration-200">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>You have been successfully signed out from all Saptix stakes.</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive flex items-center gap-2.5 animate-in fade-in-50 duration-200">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 animate-in fade-in-50 duration-200">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Authenticated successfully. Redirecting to your workspace...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground">
                Enterprise Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@saptix.com"
                  required
                  autoFocus
                  className="flex h-11 w-full rounded-xl border border-input bg-card/60 px-3 pl-10.5 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-foreground">
                  Password
                </label>
                <a
                  href="https://account.saptix.tech/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-card/60 px-3 pl-10.5 pr-10.5 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 transition-all duration-150 cursor-pointer"
            >
              {isLoading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Sign in to {subdomain}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Google SSO Option */}
          {showGoogleSSO && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/70" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                  <span className="bg-background px-2.5 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onGoogleLogin}
                className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-input bg-card/60 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150 cursor-pointer"
              >
                <svg className="size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google Workspace SSO
              </button>
            </>
          )}

          {/* Register Link */}
          {showRegisterLink && (
            <p className="text-center text-xs text-muted-foreground">
              Need access?{" "}
              <a href={registerHref} className="font-semibold text-primary hover:underline">
                Request an Enterprise Trial
              </a>
            </p>
          )}

          {/* Footer */}
          <div className="pt-4 text-center border-t border-border/50">
            <p className="text-[11px] text-muted-foreground font-mono">
              Protected by Saptix Zero-Trust Enterprise Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
