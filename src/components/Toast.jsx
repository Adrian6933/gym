import React, { useEffect } from "react";
import { create } from "zustand";
import { CheckCircle2, Flame, Trophy, Zap, Info, X } from "lucide-react";

// ===== Store de notificaciones Toast =====
let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = ++toastId;
    const newToast = {
      id,
      type: "info",
      duration: 2800,
      ...toast,
    };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-dismiss
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().dismiss(id);
      }, newToast.duration);
    }
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Hook de conveniencia para disparar toasts desde cualquier componente
export const useToast = () => {
  const addToast = useToastStore((s) => s.addToast);
  return {
    success: (title, message) => addToast({ type: "success", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
    flame: (title, message) => addToast({ type: "flame", title, message }),
    trophy: (title, message) => addToast({ type: "trophy", title, message }),
    zap: (title, message) => addToast({ type: "zap", title, message }),
  };
};

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    color: "var(--accent-color)",
    colorRgb: "var(--accent-color-rgb)",
    label: "text-[var(--accent-color)]",
  },
  flame: {
    icon: Flame,
    color: "#f97316",
    colorRgb: "249, 115, 22",
    label: "text-orange-500",
  },
  trophy: {
    icon: Trophy,
    color: "#eab308",
    colorRgb: "234, 179, 8",
    label: "text-yellow-500",
  },
  zap: {
    icon: Zap,
    color: "#06b6d4",
    colorRgb: "6, 182, 212",
    label: "text-cyan-500",
  },
  info: {
    icon: Info,
    color: "#64748b",
    colorRgb: "100, 116, 139",
    label: "text-slate-400",
  },
};

function ToastItem({ toast, onDismiss }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      className="gradient-glass rounded-2xl px-4 py-3 flex items-start gap-3 max-w-[92vw] w-full animate-slide-down shadow-xl pointer-events-auto"
      style={{
        border: `1px solid rgba(${style.colorRgb}, 0.25)`,
        boxShadow: `0 8px 30px -8px rgba(${style.colorRgb}, 0.3), 0 2px 8px rgba(0,0,0,0.4)`,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `rgba(${style.colorRgb}, 0.15)` }}
      >
        <Icon size={18} style={{ color: style.color }} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className={`text-sm font-black ${style.label} leading-tight`}>
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] safe-top px-3 pt-2 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}
