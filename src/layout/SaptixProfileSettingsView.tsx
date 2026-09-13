"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Key, ShieldCheck, Laptop, Globe, 
  Check, AlertCircle, RefreshCw, Lock, Mail, Building, Phone, Clock
} from 'lucide-react';
import { useSaptixProfile } from './useSaptixProfile';

export interface SaptixProfileSettingsViewProps {
  embedded?: boolean;
  defaultTab?: 'profile' | 'security' | 'sessions' | 'preferences';
  onClose?: () => void;
}

export function SaptixProfileSettingsView({
  embedded = false,
  defaultTab = 'profile',
  onClose
}: SaptixProfileSettingsViewProps) {
  const {
    user,
    sessions,
    loading,
    saving,
    error,
    success,
    updateProfile,
    changePassword,
    updatePreferences,
    revokeSession,
    refresh
  } = useSaptixProfile();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions' | 'preferences'>(defaultTab);

  // Form states
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMismatch, setPassMismatch] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setJobTitle(user.job_title || '');
      setPhone(user.phone || '');
      setTimezone(user.timezone || 'UTC');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      job_title: jobTitle,
      phone,
      timezone,
      bio,
      avatar_url: avatarUrl || null,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMismatch(true);
      return;
    }
    setPassMismatch(false);
    const res = await changePassword(currentPassword, newPassword);
    if (res.ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const getInitials = (n: string) => {
    if (!n) return 'SX';
    return n.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`w-full ${embedded ? '' : 'max-w-5xl mx-auto p-4 sm:p-6 space-y-6'}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border/70 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base shadow-xs">
            {getInitials(name || user?.name || '')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {name || user?.name || 'User Profile & Settings'}
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                {user?.role || 'Active SSO'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 font-mono">
              <span>{user?.email || 'Federated Account'}</span>
              <span>•</span>
              <span>{user?.organization_name || 'SapTix Enterprise'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted/60 text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Identity
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-all cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Alert Notices */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/60 overflow-x-auto">
        {[
          { id: 'profile', label: 'Identity & Profile', icon: User },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'sessions', label: `Active Sessions (${sessions.length || 1})`, icon: Laptop },
          { id: 'preferences', label: 'Preferences & Workspaces', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Identity & Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-5">
            <div className="border-b border-border/50 pb-4">
              <h2 className="text-sm font-semibold text-foreground">Personal Information & Role</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Managed centrally by <span className="font-mono text-primary">auth.saptix.tech</span> and synced across all enterprise stakes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email Address (SSO Primary)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border/50 bg-muted/40 text-xs text-muted-foreground font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Job Title / Architecture Role</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Lead Solutions Architect"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Direct Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Timezone</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New York (EST/EDT)</option>
                    <option value="America/Los_Angeles">America/Los Angeles (PST/PDT)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST +09:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-foreground mb-1.5">Professional Bio & Enterprise Notes</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief description of enterprise responsibilities, SAP modules, and team clearance."
                  className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <form onSubmit={handlePasswordSubmit} className="p-6 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-4">
            <div className="border-b border-border/50 pb-3">
              <h2 className="text-sm font-semibold text-foreground">Change Master SSO Password</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Updates password hash securely in <span className="font-mono text-primary">auth.saptix.tech</span>.
              </p>
            </div>

            {passMismatch && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                New password and confirmation do not match.
              </p>
            )}

            <div className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">New Password (min 8 characters)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !currentPassword || !newPassword}
                className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Security status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Cross-Stake Wildcard SSO</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Federated cookie active across all *.saptix.tech subdomains.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">Active</span>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-muted/20 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">MFA / TOTP Policy</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Enforced for Admin and Enterprise architect roles.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">Enforced</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-4">
          <div className="border-b border-border/50 pb-3">
            <h2 className="text-sm font-semibold text-foreground">Active Federated Sessions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live sessions tracked in <span className="font-mono text-primary">auth.sessions</span>. Revoking a session terminates access immediately.
            </p>
          </div>

          <div className="divide-y divide-border/60">
            {sessions.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No active secondary sessions found.</p>
            ) : (
              sessions.map((sess) => (
                <div key={sess.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground font-mono">{sess.ip_address || '127.0.0.1'}</span>
                        {sess.is_current && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-md mt-0.5">
                        {sess.user_agent || 'Web Browser'} • Expires {new Date(sess.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {!sess.is_current && (
                    <button
                      type="button"
                      onClick={() => revokeSession(sess.id)}
                      className="text-xs text-destructive hover:underline font-medium cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Preferences & Workspaces */}
      {activeTab === 'preferences' && (
        <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-5">
          <div className="border-b border-border/50 pb-3">
            <h2 className="text-sm font-semibold text-foreground">Interface Preferences & Connected Workspaces</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Global theme and quick links to connected ecosystem portals.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div>
                <p className="text-xs font-semibold text-foreground">Color Mode & Theme</p>
                <p className="text-[11px] text-muted-foreground">Switches between Dark and Light mode across all Saptix stakes.</p>
              </div>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border/50">
                {['system', 'dark', 'light'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updatePreferences({ theme: t })}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md capitalize cursor-pointer transition-all ${
                      user?.preferences?.theme === t ? 'bg-background text-foreground shadow-2xs font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-foreground mb-2">Connected Saptix Portals</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Account Portal', url: 'https://account.saptix.tech' },
                  { name: 'AI Gateway', url: 'https://gate.saptix.tech' },
                  { name: 'Spectra ERP', url: 'https://spectra.saptix.tech' },
                  { name: 'Modeler Studio', url: 'https://modeler.saptix.tech' },
                  { name: 'Agent Studio', url: 'https://agent.saptix.tech' },
                  { name: 'Lead OS', url: 'https://lead.saptix.tech' },
                ].map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    className="p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/50 text-xs font-medium text-foreground flex items-center justify-between transition-colors"
                  >
                    <span>{app.name}</span>
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
