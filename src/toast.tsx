import * as React from "react";
import { cn } from "@/lib/utils";
import { IconX, IconCheck, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "warning";
  duration?: number;
}

interface ToastContextType {
  toasts: ToastData[];
  toast: (data: Omit<ToastData, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, data.duration ?? 4000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function Toaster({ toasts, dismiss }: { toasts: ToastData[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const variantStyles = {
          default: "border-[#262738] bg-[#14141d]",
          success: "border-emerald-500/40 bg-emerald-500/10",
          destructive: "border-red-500/40 bg-red-500/10",
          warning: "border-amber-500/40 bg-amber-500/10",
        };
        const Icon = t.variant === "success" ? IconCheck
          : t.variant === "destructive" ? IconAlertTriangle
          : t.variant === "warning" ? IconAlertTriangle
          : IconInfoCircle;

        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 shadow-2xl animate-fade-in text-xs",
              variantStyles[t.variant ?? "default"]
            )}
          >
            <Icon className={cn(
              "w-4 h-4 shrink-0 mt-0.5",
              t.variant === "success" ? "text-emerald-400"
                : t.variant === "destructive" ? "text-red-400"
                : t.variant === "warning" ? "text-amber-400"
                : "text-indigo-400"
            )} stroke={1.75} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white">{t.title}</div>
              {t.description && <div className="text-[#8e8ea8] mt-0.5">{t.description}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-[#64748b] hover:text-white shrink-0">
              <IconX className="w-3.5 h-3.5" stroke={1.75} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
