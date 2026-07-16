import React, { useState, useRef, useCallback } from "react";
import {
  useGymStore,
  getExerciseCalories,
  getRoutineStats,
} from "../store/useGymStore";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Repeat,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ExerciseSelector from "./ExerciseSelector";
import { MUSCLE_COLORS } from "../data/exercises";

export default function RoutineEditor({ routineId, onBack }) {
  const {
    routines,
    addExerciseToRoutine,
    removeExerciseFromRoutine,
    updateExerciseInRoutine,
    reorderExercises,
    settings,
  } = useGymStore();
  const routine = routines.find((r) => r.id === routineId);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);

  // === Drag & drop de ejercicios (mobile-first, pointer events) ===
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const cardRefs = useRef([]);
  const pointerY = useRef(0);

  const handlePointerDown = useCallback(
    (e, idx) => {
      // Solo botón principal/touch
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      pointerY.current = e.clientY;
      setDragIndex(idx);
      setDragOverIndex(idx);
      const move = (ev) => {
        pointerY.current = ev.clientY;
        // Determinar sobre qué tarjeta está el puntero
        let target = null;
        for (let i = 0; i < cardRefs.current.length; i++) {
          const el = cardRefs.current[i];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (ev.clientY >= rect.top && ev.clientY <= rect.bottom) {
            target = i;
            break;
          }
        }
        setDragOverIndex(target);
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        setDragIndex((curDrag) => {
          setDragOverIndex((curOver) => {
            if (
              curDrag !== null &&
              curOver !== null &&
              curDrag !== curOver
            ) {
              reorderExercises(routineId, curDrag, curOver);
            }
            return null;
          });
          return null;
        });
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
    [routineId, reorderExercises],
  );

  if (!routine) return null;

  const handleAddExercise = (exercise) => {
    addExerciseToRoutine(routineId, exercise);
  };

  const toggleExpand = (idx) => {
    setExpandedExercise(expandedExercise === idx ? null : idx);
  };

  const stats = getRoutineStats(routine, settings?.restDuration || 90);

  return (
    <>
      <div className="min-h-[100dvh] pb-28 relative overflow-hidden bg-hero-weights">
        {/* Decoración de fondo */}
        <svg className="absolute top-32 -right-8 w-28 h-28 text-lime-500/[0.02] animate-float pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>

        {/* Header */}
        <div className="sticky top-0 z-30 gradient-glass safe-top">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-300 press-scale"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                Editar rutina
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <h1 className="text-base font-black text-slate-100 truncate">
                  {routine.emoji} {routine.name}
                </h1>
                {routine.exercises.length > 0 && (
                  <>
                    <span className="text-slate-700 font-bold text-xs">·</span>
                    <span
                      className="text-xs text-orange-500 font-black"
                      title="Calorías estimadas"
                    >
                      🔥 ~{stats.calories} kcal
                    </span>
                    <span className="text-slate-700 font-bold text-xs">·</span>
                    <span
                      className="text-xs text-cyan-500 font-black"
                      title="Duración estimada"
                    >
                      ⏱ ~{stats.duration} min
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Exercises list */}
        <div className="px-4 pt-4 space-y-3">
          {routine.exercises.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-slate-500 font-medium mb-2">
                Sin ejercicios todavía
              </p>
              <p className="text-xs text-slate-600">
                Toca el botón de abajo para añadir
              </p>
            </div>
          )}

          {routine.exercises.map((ex, idx) => {
            const kcal = getExerciseCalories(ex, settings?.restDuration || 90);
            const isDragging = dragIndex === idx;
            const isDragOver = dragOverIndex === idx && dragIndex !== idx;
            return (
              <div
                key={`${ex.id}-${idx}`}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`gradient-card rounded-2xl overflow-hidden animate-slide-up transition-all ${
                  isDragging
                    ? "opacity-50 scale-[0.98] ring-2 ring-lime-500/60"
                    : isDragOver
                      ? "ring-2 ring-lime-500/30 -translate-y-0.5"
                      : ""
                }`}
              >
                {/* Exercise header */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full flex items-center gap-3 p-4 text-left press-scale"
                >
                  <span
                    onPointerDown={(e) => handlePointerDown(e, idx)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" && idx > 0) {
                        e.preventDefault();
                        reorderExercises(routineId, idx, idx - 1);
                      } else if (
                        e.key === "ArrowDown" &&
                        idx < routine.exercises.length - 1
                      ) {
                        e.preventDefault();
                        reorderExercises(routineId, idx, idx + 1);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Reordenar ${ex.name}. Usa flechas arriba y abajo para moverlo.`}
                    className="touch-none cursor-grab active:cursor-grabbing flex-shrink-0 p-1 -m-1 rounded-lg text-slate-700 hover:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                    title="Arrastra para reordenar (o flechas ↓↑ con teclado)"
                  >
                    <GripVertical size={16} />
                  </span>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: MUSCLE_COLORS[ex.muscle]
                        ? `${MUSCLE_COLORS[ex.muscle]}15`
                        : "rgba(var(--accent-color-rgb), 0.15)",
                    }}
                  >
                    {ex.type === "time" ? (
                      <Clock
                        size={16}
                        style={{
                          color:
                            MUSCLE_COLORS[ex.muscle] || "var(--accent-color)",
                        }}
                      />
                    ) : (
                      <Repeat
                        size={16}
                        style={{
                          color:
                            MUSCLE_COLORS[ex.muscle] || "var(--accent-color)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {ex.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-bold">
                      <span>{ex.targetSets || 3} series</span>
                      <span>·</span>
                      <span>
                        {ex.type === "time"
                          ? `${ex.targetDuration || 30}s`
                          : `${ex.targetReps || 12} reps`}
                      </span>
                      {ex.targetWeight ? (
                        <>
                          <span>·</span>
                          <span>{ex.targetWeight}kg</span>
                        </>
                      ) : null}
                      <span>·</span>
                      <span className="text-orange-500 font-black">
                        🔥 ~{kcal} kcal
                      </span>
                    </div>
                  </div>
                  {expandedExercise === idx ? (
                    <ChevronUp
                      size={16}
                      className="text-slate-500 flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-slate-500 flex-shrink-0"
                    />
                  )}
                </button>

                {/* Expanded config */}
                {expandedExercise === idx && (
                  <div className="px-4 pb-4 pt-1 space-y-3 animate-scale-in border-t border-slate-800/40">
                    {/* Sets */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        Series
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateExerciseInRoutine(routineId, idx, {
                              targetSets: Math.max(1, (ex.targetSets || 3) - 1),
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
                        >
                          -
                        </button>
                        <span className="text-lg font-bold text-slate-100 w-6 text-center">
                          {ex.targetSets || 3}
                        </span>
                        <button
                          onClick={() =>
                            updateExerciseInRoutine(routineId, idx, {
                              targetSets: (ex.targetSets || 3) + 1,
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Reps or Duration */}
                    {ex.type === "reps" ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">
                          Repeticiones
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateExerciseInRoutine(routineId, idx, {
                                targetReps: Math.max(
                                  1,
                                  (ex.targetReps || 12) - 1,
                                ),
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
                          >
                            -
                          </button>
                          <span className="text-lg font-bold text-slate-100 w-6 text-center">
                            {ex.targetReps || 12}
                          </span>
                          <button
                            onClick={() =>
                              updateExerciseInRoutine(routineId, idx, {
                                targetReps: (ex.targetReps || 12) + 1,
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">
                          Duración (s)
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateExerciseInRoutine(routineId, idx, {
                                targetDuration: Math.max(
                                  5,
                                  (ex.targetDuration || 30) - 5,
                                ),
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
                          >
                            -
                          </button>
                          <span className="text-lg font-bold text-slate-100 w-8 text-center">
                            {ex.targetDuration || 30}
                          </span>
                          <button
                            onClick={() =>
                              updateExerciseInRoutine(routineId, idx, {
                                targetDuration: (ex.targetDuration || 30) + 5,
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Weight */}
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`routine-weight-${ex.id}`}
                        className="text-xs text-slate-400 font-medium"
                      >
                        Peso (kg)
                      </label>
                      <input
                        id={`routine-weight-${ex.id}`}
                        type="text"
                        inputMode="decimal"
                        value={ex.targetWeight || ""}
                        onChange={(e) =>
                          updateExerciseInRoutine(routineId, idx, {
                            targetWeight: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-center text-slate-100 font-bold focus:outline-none focus:border-lime-500/50"
                      />
                    </div>

                    {/* Type toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        Tipo
                      </span>
                      <div className="flex bg-slate-800 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateExerciseInRoutine(routineId, idx, {
                              type: "reps",
                            })
                          }
                          className={`px-4 py-2 text-xs font-bold transition-colors ${ex.type === "reps" ? "bg-lime-500 text-slate-950" : "text-slate-400"}`}
                        >
                          Reps
                        </button>
                        <button
                          onClick={() =>
                            updateExerciseInRoutine(routineId, idx, {
                              type: "time",
                            })
                          }
                          className={`px-4 py-2 text-xs font-bold transition-colors ${ex.type === "time" ? "bg-lime-500 text-slate-950" : "text-slate-400"}`}
                        >
                          Tiempo
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => {
                        removeExerciseFromRoutine(routineId, idx);
                        setExpandedExercise(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 press-scale mt-1"
                    >
                      <Trash2 size={14} /> Eliminar ejercicio
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add exercise button */}
          <button
            onClick={() => setSelectorOpen(true)}
            className="w-full py-5 border border-dashed border-slate-700 text-lime-500 rounded-2xl flex items-center justify-center gap-2 font-bold press-scale text-sm mt-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            Añadir Ejercicio
          </button>
        </div>
      </div>

      <ExerciseSelector
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleAddExercise}
      />
    </>
  );
}
