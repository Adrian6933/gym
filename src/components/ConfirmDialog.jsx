import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  danger = true,
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    confirmBtnRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-5 animate-fade-in"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- stopPropagation solo evita el cierre por click en el backdrop, no es una interacción real */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-sm bg-slate-900 border border-white/10 rounded-[1.75rem] p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${danger ? "bg-red-500/15 text-red-400" : "bg-[var(--accent-color)]/15 text-[var(--accent-color)]"}`}
          >
            <AlertTriangle size={26} />
          </div>
          <h3
            id="confirm-dialog-title"
            className="text-base font-black text-slate-100 tracking-tight"
          >
            {title}
          </h3>
          {message && (
            <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 font-bold text-sm press-scale"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-sm press-scale ${danger ? "bg-red-500 text-white" : "gradient-lime-btn text-slate-950"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
