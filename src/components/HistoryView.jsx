import React, { useState } from "react";
import { useGymStore, getExerciseCalories } from "../store/useGymStore";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Flame,
  Trophy,
} from "lucide-react";
import BottomNav from "./BottomNav";

export default function HistoryView() {
  const { history, deleteHistoryEntry, clearHistory } = useGymStore();
  const [expandedIdx, setExpandedIdx] = useState(null);

  const sortedHistory = [...history].reverse();

  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Hoy";
    if (d.toDateString() === yesterday.toDateString()) return "Ayer";
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const calcDuration = (start, end) => {
    const mins = Math.round((end - start) / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const calcVolume = (exercises) => {
    let total = 0;
    exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed && s.weight && s.reps) {
          total += parseFloat(s.weight) * parseInt(s.reps);
        }
      });
    });
    return total;
  };

  const calcCompletedSets = (exercises) => {
    return exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0,
    );
  };

  const calcWorkoutCalories = (exercises) => {
    return exercises.reduce((acc, ex) => acc + getExerciseCalories(ex), 0);
  };

  return (
    <>
      <div className="px-4 pt-5 pb-24 min-h-[100dvh] bg-hero-stats">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Historial
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {history.length} entrenamiento{history.length !== 1 ? "s" : ""}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm("¿Borrar todo el historial?")) clearHistory();
              }}
              className="text-xs text-red-400/50 font-medium px-3 py-2 rounded-lg press-scale"
            >
              Borrar todo
            </button>
          )}
        </div>

        {sortedHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in relative overflow-hidden">
            {/* Decoración de fondo */}
            <svg className="absolute top-4 right-4 w-24 h-24 text-lime-500/[0.03] animate-float pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="2" y="10" width="3" height="4" rx="1" />
              <rect x="19" y="10" width="3" height="4" rx="1" />
              <rect x="4" y="8" width="16" height="8" rx="1.5" />
              <rect x="6" y="9" width="12" height="6" rx="1" />
            </svg>
            <svg className="absolute bottom-8 left-2 w-20 h-20 text-lime-500/[0.03] animate-float-delayed pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="2" y="10" width="3" height="4" rx="1" />
              <rect x="19" y="10" width="3" height="4" rx="1" />
              <rect x="4" y="8" width="16" height="8" rx="1.5" />
              <rect x="6" y="9" width="12" height="6" rx="1" />
            </svg>
            <div className="w-24 h-24 rounded-[2rem] gradient-card flex items-center justify-center mb-6 text-slate-700 relative z-10 border border-white/5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-slate-600">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-300 mb-2 relative z-10 tracking-tight">
              Sin entrenamientos
            </h3>
            <p className="text-sm text-slate-500 max-w-[240px] relative z-10 leading-relaxed">
              Completa tu primer entrenamiento y todo tu progreso aparecerá aquí.
            </p>
            <a href="/workout" className="mt-6 px-6 py-3 rounded-2xl gradient-lime-btn text-slate-950 font-black text-sm press-scale shadow-lg shadow-lime-500/15 relative z-10">
              Ir a Entrenar
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedHistory.map((w, idx) => {
              const vol = calcVolume(w.exercises);
              const sets = calcCompletedSets(w.exercises);
              const isExpanded = expandedIdx === idx;

              return (
                <div
                  key={idx}
                  className={`gradient-card rounded-2xl overflow-hidden animate-slide-up delay-${Math.min(idx + 1, 5)}`}
                >
                  <button
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="w-full text-left p-4 press-scale"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                          style={{
                            backgroundColor: `${w.color || "#84cc16"}15`,
                          }}
                        >
                          {w.emoji || "💪"}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-100">
                            {w.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {formatDate(w.startTime)} ·{" "}
                            {formatTime(w.startTime)}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-slate-500 mt-1" />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-slate-500 mt-1"
                        />
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-600" />
                        <span className="text-xs text-slate-400 font-medium">
                          {calcDuration(w.startTime, w.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Dumbbell size={12} className="text-slate-600" />
                        <span className="text-xs text-slate-400 font-medium">
                          {sets} series
                        </span>
                      </div>
                      {vol > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Flame size={12} className="text-slate-600" />
                          <span className="text-xs text-slate-400 font-medium">
                            {vol.toLocaleString()} kg
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Flame size={12} className="text-orange-500" />
                        <span className="text-xs text-orange-400 font-black">
                          ~{calcWorkoutCalories(w.exercises)} kcal
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3 animate-scale-in">
                      {w.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="space-y-1">
                          <p className="text-xs font-bold text-slate-300">
                            {ex.name}
                          </p>
                          {ex.notes && (
                            <p className="text-[10px] text-slate-500 italic pl-6">
                              Nota: {ex.notes}
                            </p>
                          )}
                          <div className="space-y-1">
                            {ex.sets
                              .filter((s) => s.completed)
                              .map((s, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center gap-3 text-xs text-slate-500"
                                >
                                  <span className="w-6 text-center font-bold text-slate-600">
                                    {sIdx + 1}
                                  </span>
                                  {s.weight && <span>{s.weight} kg</span>}
                                  {s.reps && <span>× {s.reps} reps</span>}
                                  {s.duration && <span>{s.duration}s</span>}
                                  {s.rpe && (
                                    <span className="inline-flex items-center px-1 rounded bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-wider scale-95">
                                      RPE {s.rpe}
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryEntry(history.length - 1 - idx);
                          setExpandedIdx(null);
                        }}
                        className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400/70 text-xs font-bold flex items-center justify-center gap-1.5 press-scale mt-2"
                      >
                        <Trash2 size={13} /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
