"use client";

import { useState, useEffect, useCallback } from 'react';

export interface SaptixUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string | null;
  phone?: string | null;
  job_title?: string | null;
  timezone?: string | null;
  bio?: string | null;
  organization_id?: string | null;
  organization_name?: string | null;
  preferences?: {
    theme?: string;
    emailNotifications?: boolean;
    twoFactorEnabled?: boolean;
    [key: string]: any;
  } | null;
  is_active?: boolean;
  last_login_at?: string | null;
  created_at?: string | null;
}

export interface SaptixSessionItem {
  id: string;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  expires_at: string;
  is_current?: boolean;
}

export function useSaptixProfile() {
  const [user, setUser] = useState<SaptixUser | null>(null);
  const [sessions, setSessions] = useState<SaptixSessionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authHost = 'https://auth.saptix.tech';

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${authHost}/api/auth/profile`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        }
      } else {
        // Fallback: extract from token cookie client-side if network restricted
        const cookie = typeof document !== 'undefined' ? document.cookie : '';
        const match = cookie.match(/saptix_token=([^;]+)/);
        if (match) {
          try {
            const payload = JSON.parse(atob(match[1].split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            setUser({
              id: payload.id || 'usr-saptix-active',
              email: payload.email || 'user@saptix.com',
              name: payload.name || 'Saptix User',
              role: payload.role || 'client',
              organization_name: 'SapTix Enterprise'
            });
          } catch (_) {}
        }
      }
    } catch (err: any) {
      console.warn('Profile fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${authHost}/api/auth/sessions`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.sessions)) {
          setSessions(data.sessions);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchSessions();
  }, [fetchProfile, fetchSessions]);

  const updateProfile = async (formData: Partial<SaptixUser>) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${authHost}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, ...(data.user || formData) } as SaptixUser));
        setSuccess('Profile updated successfully across the Saptix ecosystem.');
        return { ok: true, user: data.user };
      } else {
        setError(data.error || 'Failed to update profile');
        return { ok: false, error: data.error };
      }
    } catch (err: any) {
      setError(err.message || 'Network error updating profile');
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${authHost}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Password updated successfully. Your new credentials are now active.');
        return { ok: true };
      } else {
        setError(data.error || 'Failed to change password');
        return { ok: false, error: data.error };
      }
    } catch (err: any) {
      setError(err.message || 'Error updating password');
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  const updatePreferences = async (newPrefs: Record<string, any>) => {
    try {
      const res = await fetch(`${authHost}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ preferences: newPrefs }),
      });
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, preferences: { ...(prev.preferences || {}), ...newPrefs } } : null);
        setSuccess('Preferences updated.');
      }
    } catch (_) {}
  };

  const revokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${authHost}/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setSuccess('Session revoked successfully.');
      }
    } catch (_) {}
  };

  return {
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
    refresh: fetchProfile,
  };
}
