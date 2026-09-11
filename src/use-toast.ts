'use client';

import * as React from 'react';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
}

type ToastListener = (toasts: ToastData[]) => void;

let toastsState: ToastData[] = [];
const listeners = new Set<ToastListener>();

function notify() {
  listeners.forEach((listener) => listener([...toastsState]));
}

export function toast({
  title,
  description,
  variant = 'default',
}: Omit<ToastData, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastData = { id, title, description, variant };
  toastsState = [...toastsState, newToast];
  notify();

  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    notify();
  }, 4000);

  return id;
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>(toastsState);

  React.useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const dismiss = (id: string) => {
    toastsState = toastsState.filter((t) => t.id !== id);
    notify();
  };

  return {
    toasts,
    toast,
    dismiss,
  };
}
