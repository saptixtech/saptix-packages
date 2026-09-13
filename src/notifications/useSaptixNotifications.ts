'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SaptixNotification {
  id: string;
  user_id: string;
  organization_id?: string | null;
  stake: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'security';
  title: string;
  message: string;
  link_url?: string | null;
  read: boolean;
  read_at?: string | null;
  created_at: string;
}

const AUTH_BASE = 'https://auth.saptix.tech/api/auth';

export function useSaptixNotifications() {
  const [notifications, setNotifications] = useState<SaptixNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${AUTH_BASE}/notifications?limit=30`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // Unauthenticated or expired session
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(typeof data.unread_count === 'number' ? data.unread_count : 0);
      }
    } catch (_) {
      // Silently fail on network/CORS issues in dev or offline
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch(`${AUTH_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      // Broadcast update across tabs
      bcRef.current?.postMessage({ type: 'NOTIF_READ', id });
    } catch (_) {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
    );
    setUnreadCount(0);

    try {
      await fetch(`${AUTH_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      bcRef.current?.postMessage({ type: 'NOTIF_READ_ALL' });
    } catch (_) {}
  }, []);

  const dismiss = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target && !target.read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((n) => n.id !== id);
    });

    try {
      await fetch(`${AUTH_BASE}/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      bcRef.current?.postMessage({ type: 'NOTIF_DISMISSED', id });
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    fetchNotifications();

    // Broadcast channel setup
    try {
      const bc = new BroadcastChannel('saptix_notifications');
      bcRef.current = bc;
      bc.onmessage = (event) => {
        if (event.data?.type === 'NOTIF_READ') {
          setNotifications((prev) =>
            prev.map((n) => (n.id === event.data.id ? { ...n, read: true } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } else if (event.data?.type === 'NOTIF_READ_ALL') {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadCount(0);
        } else if (event.data?.type === 'NOTIF_DISMISSED') {
          setNotifications((prev) => prev.filter((n) => n.id !== event.data.id));
        } else if (event.data?.type === 'NOTIF_NEW') {
          fetchNotifications();
        }
      };
    } catch (_) {}

    // Polling interval (45s) when window is active
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    }, 45000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (bcRef.current) {
        bcRef.current.close();
        bcRef.current = null;
      }
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    dismiss,
  };
}
