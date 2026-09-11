"use client";
import { useState, useCallback, useEffect, ReactNode } from "react";
import { DatabaseIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SampleDataManagerProps<T extends { id: string }> {
  storageKey: string;
  initialData: T[];
  children: (api: {
    data: T[];
    addItem: (item: T) => void;
    updateItem: (id: string, updates: Partial<T>) => void;
    deleteItem: (id: string) => void;
    resetData: () => void;
  }) => ReactNode;
}

export function SampleDataManager<T extends { id: string }>({
  storageKey,
  initialData,
  children,
}: SampleDataManagerProps<T>) {
  const [data, setData] = useState<T[]>(() => {
    if (typeof window === "undefined") return initialData;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T[]) : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  }, [data, storageKey]);

  const addItem    = useCallback((item: T) => setData((d) => [item, ...d]), []);
  const updateItem = useCallback((id: string, updates: Partial<T>) =>
    setData((d) => d.map((i) => (i.id === id ? { ...i, ...updates } : i))), []);
  const deleteItem = useCallback((id: string) =>
    setData((d) => d.filter((i) => i.id !== id)), []);
  const resetData  = useCallback(() => {
    setData(initialData);
    try { localStorage.removeItem(storageKey); } catch {}
  }, [initialData, storageKey]);

  return <>{children({ data, addItem, updateItem, deleteItem, resetData })}</>;
}

interface ResetSampleDataButtonProps {
  onReset: () => void;
}

export function ResetSampleDataButton({ onReset }: ResetSampleDataButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Reset to sample data?</span>
        <Button
          variant="destructive"
          size="sm"
          className="h-7 text-xs"
          onClick={() => { onReset(); setConfirming(false); }}
        >
          Reset
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      onClick={() => setConfirming(true)}
    >
      <DatabaseIcon className="h-3.5 w-3.5" />
      <RefreshCwIcon className="h-3.5 w-3.5" />
      Reset Sample Data
    </Button>
  );
}