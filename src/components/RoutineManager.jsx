import React, { useState, useEffect } from "react";
import { useGymStore, getRoutineStats } from "../store/useGymStore";
import { Play, Plus, Trash2, Edit3, Sparkles, X, Copy } from "lucide-react";
import BottomNav from "./BottomNav";
import RoutineEditor from "./RoutineEditor";
import { ROUTINE_TEMPLATES } from "../data/routineTemplates";

const ROUTINE_EMOJIS = [
  "🔥",
  "⚡",
  "💪",
  "🏋️",
  "🦵",
  "🎯",
  "💎",
  "🚀",
  "⭐",
  "🌟",
];
const ROUTINE_COLORS = [
  "#84cc16",
  "#06b6d4",
  "#f43f5e",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#10b981",
  "#f97316",
];

export default function RoutineManager() {
  const { routines, startWorkout, addRoutine, deleteRoutine, settings } =
    useGymStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🔥");
  const [newColor, setNewColor] = useState("#84cc16");
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (!showCreateForm && !showTemplates) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (showCreateForm) setShowCreateForm(false);
      else if (showTemplates) setShowTemplates(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCreateForm, showTemplates]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    addRoutine({
      name: newName.trim(),
      emoji: newEmoji,
      color: newColor,
      exercises: [],
    });
    setNewName("");
    setShowCreateForm(false);
  };

  const handleUseTemplate = (template) => {
    addRoutine({
      name: template.name,
      emoji: template.emoji,
      color: template.color,
      exercises: template.exercises.map((ex) => ({ ...ex })),
    });
    setShowTemplates(false);
  };

  const handleStartWorkout = (routine) => {
    if (routine.exercises.length === 0) {
      setEditingRoutineId(routine.id);
      return;
    }
    startWorkout(routine);
  };

  const handleDuplicate = (routine) => {
    addRoutine({
      name: `${routine.name} (copia)`,
      emoji: routine.emoji,
      color: routine.color,
      exercises: routine.exercises.map((ex) => ({ ...ex })),
    });
  };

  if (editingRoutineId) {
    return (
      <RoutineEditor
        routineId={editingRoutineId}
        onBack={() => setEditingRoutineId(null)}
      />
    );
  }

  return (
    <>
      <div className="px-4 pt-6 pb-28 space-y-6 relative overflow-hidden bg-hero-weights">
        {/* Decoración de fondo */}
        <svg className="absolute top-40 -right-8 w-28 h-28 text-lime-500/[0.02] animate-float pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>
        <svg className="absolute bottom-48 -left-6 w-24 h-24 text-lime-500/[0.02] animate-float-delayed pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>

        {/* Title */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            Mis Rutinas
          </h2>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {routines.length} rutinas
          </span>
        </div>

        {/* Vertical List of Routine Cards */}
        <div className="space-y-4">
          {routines.map((routine, idx) => {
            const stats = getRoutineStats(
              routine,
              settings?.restDuration || 90,
            );
            return (
              <div
                key={routine.id}
                className="gradient-card rounded-[2rem] p-5 relative overflow-hidden border border-white/5 animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Glow Accent */}
                <div
                  className="absolute top-[-30%] right-[-10%] w-[35vw] h-[35vw] rounded-full blur-[45px] pointer-events-none opacity-[0.06]"
                  style={{ backgroundColor: routine.color }}
                />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${routine.color}15` }}
                    >
                      {routine.emoji}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-100 tracking-tight leading-tight">
                        {routine.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <p className="text-xs text-slate-500 font-bold">
                          {routine.exercises.length} ejercicio
                          {routine.exercises.length !== 1 ? "s" : ""}
                        </p>
                        {routine.exercises.length > 0 && (
                          <>
                            <span className="text-slate-700 font-bold text-xs">
                              ·
                            </span>
                            <span
                              className="text-[10px] text-orange-500 font-black flex items-center gap-0.5"
                              title="Calorías estimadas"
                            >
                              🔥 ~{stats.calories} kcal
                            </span>
                            <span className="text-slate-700 font-bold text-xs">
                              ·
                            </span>
                            <span
                              className="text-[10px] text-cyan-500 font-black"
                              title="Duración estimada"
                            >
                              ⏱ ~{stats.duration} min
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingRoutineId(routine.id)}
                      className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 active:scale-90 transition-transform border border-white/5"
                      title="Editar rutina"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(routine)}
                      className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 active:scale-90 transition-transform border border-white/5"
                      title="Duplicar rutina"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingId(
                          deletingId === routine.id ? null : routine.id,
                        )
                      }
                      className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 active:scale-90 transition-transform border border-white/5"
                      title="Eliminar rutina"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Exercise tags shortlist */}
                {routine.exercises.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {routine.exercises.map((ex, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5 text-slate-400 font-semibold"
                      >
                        {ex.name}
                      </span>
                    ))}
                  </div>
                )}

                {deletingId === routine.id && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col justify-center items-center p-4 z-25 space-y-3 animate-scale-in">
                    <p className="text-xs font-bold text-slate-300 text-center">
                      ¿Eliminar esta rutina?
                    </p>
                    <div className="flex gap-2.5 w-full max-w-[200px]">
                      <button
                        onClick={() => {
                          deleteRoutine(routine.id);
                          setDeletingId(null);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Start training button */}
                <button
                  onClick={() => handleStartWorkout(routine)}
                  className="w-full py-3.5 rounded-2xl text-slate-950 font-black flex items-center justify-center gap-2 press-scale text-sm tracking-tight shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${routine.color} 0%, ${routine.color}dd 100%)`,
                    boxShadow: `0 4px 15px -3px ${routine.color}30`,
                  }}
                >
                  <Play size={15} className="fill-current" />
                  {routine.exercises.length === 0
                    ? "Configurar Rutina"
                    : "Entrenar"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Add routine buttons */}
        {!showCreateForm ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="py-5 border border-dashed border-slate-800 hover:border-lime-500/30 text-slate-500 hover:text-slate-400 rounded-3xl flex flex-col items-center justify-center gap-2 font-bold press-scale bg-slate-900/10"
            >
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-lime-500 shadow-md">
                <Plus size={20} />
              </div>
              <span className="text-xs uppercase tracking-wider">
                Nueva Rutina
              </span>
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="py-5 border border-dashed border-slate-800 hover:border-cyan-500/30 text-slate-500 hover:text-slate-400 rounded-3xl flex flex-col items-center justify-center gap-2 font-bold press-scale bg-slate-900/10"
            >
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-500 shadow-md">
                <Sparkles size={20} />
              </div>
              <span className="text-xs uppercase tracking-wider">
                Usar Plantilla
              </span>
            </button>
          </div>
        ) : (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
          <div
            className="fixed inset-0 bg-slate-800/40 backdrop-blur-md flex items-end justify-center z-[100] animate-fade-in"
            onClick={() => setShowCreateForm(false)}
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
            <div
              className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-[2.5rem] p-6 space-y-5 animate-slide-up-sheet safe-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-100 tracking-tight">
                  Crear Nueva Rutina
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs text-slate-500 font-bold"
                >
                  Cerrar
                </button>
              </div>

              <input
                type="text"
                placeholder="Nombre de la rutina (ej. Empuje Fuerza)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-slate-100 focus:outline-none focus:border-lime-500/50 text-sm"
                // eslint-disable-next-line jsx-a11y/no-autofocus -- foco correcto al abrir el sheet por acción explícita del usuario (patrón WAI-ARIA recomendado para diálogos)
                autoFocus
              />

              {/* Emoji selector */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Selecciona Icono
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {ROUTINE_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setNewEmoji(e)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all press-scale ${
                        newEmoji === e
                          ? "bg-slate-800 ring-2 ring-lime-500 scale-105 shadow-md"
                          : "bg-slate-950/80"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selector */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Selecciona Color
                </p>
                <div className="flex gap-3 flex-wrap">
                  {ROUTINE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-8 h-8 rounded-full transition-all press-scale ${
                        newColor === c
                          ? "ring-2 ring-offset-2 ring-offset-[var(--color-slate-900)] ring-lime-500 scale-105"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider press-scale"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 py-3.5 rounded-2xl gradient-lime-btn text-slate-950 font-black text-xs uppercase tracking-wider press-scale shadow-lg shadow-lime-500/10"
                >
                  Crear Rutina
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTemplates && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
        <div
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-end justify-center animate-fade-in"
          onClick={() => setShowTemplates(false)}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
          <div
            className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-[2.5rem] p-6 space-y-4 animate-slide-up-sheet safe-bottom max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-100 tracking-tight">
                Plantillas de Rutina
              </h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="w-9 h-9 flex items-center justify-center bg-slate-800/80 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2.5">
              {ROUTINE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => handleUseTemplate(tpl)}
                  className="w-full gradient-card p-4 rounded-2xl flex items-center gap-3.5 press-scale text-left"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${tpl.color}15` }}
                  >
                    {tpl.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate-200 truncate">
                      {tpl.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {tpl.exercises.length} ejercicios
                    </p>
                  </div>
                  <Plus size={16} className="text-lime-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
