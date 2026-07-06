import React, { useState, useEffect } from "react";
import { Search, X, Plus, Clock, Repeat, TrendingUp } from "lucide-react";
import { EXERCISE_DB, MUSCLE_GROUPS, MUSCLE_COLORS } from "../data/exercises";
import ExerciseHistory from "./ExerciseHistory";

export default function ExerciseSelector({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState("Pecho");
  const [customType, setCustomType] = useState("reps");
  const [historyExercise, setHistoryExercise] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = EXERCISE_DB.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || ex.muscle === filter;
    return matchSearch && matchFilter;
  });

  const handleCustomAdd = () => {
    if (!customName.trim()) return;
    onSelect({
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      muscle: customMuscle,
      type: customType,
    });
    setCustomName("");
    setShowCustomForm(false);
    onClose();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[100] flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div className="flex-1" />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
      <div
        className="relative bg-slate-900 rounded-t-[1.75rem] flex flex-col h-[92vh] animate-slide-up-sheet shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3">
          <h2 className="text-xl font-bold text-slate-100">Añadir Ejercicio</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-slate-800/80 rounded-full text-slate-400 active:scale-90 transition-transform"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar ejercicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-lime-500/50 transition-colors text-[15px] placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Muscle filter chips */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex overflow-x-auto gap-2 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {MUSCLE_GROUPS.map((m) => (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-[13px] font-bold transition-all press-scale ${
                  filter === m
                    ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20"
                    : "bg-slate-800/60 text-slate-400"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              className="gradient-card p-4 rounded-2xl flex items-center gap-3.5 group"
            >
              <button
                onClick={() => {
                  onSelect(ex);
                  onClose();
                }}
                className="flex items-center gap-3.5 flex-1 min-w-0 press-scale text-left"
              >
                {/* Foto o icono SVG */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: `${MUSCLE_COLORS[ex.muscle]}15` }}
                >
                  {ex.image ? (
                    <img
                      src={ex.image}
                      alt={ex.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={MUSCLE_COLORS[ex.muscle]}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={ex.icon} />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-200 truncate">
                    {ex.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: MUSCLE_COLORS[ex.muscle] }}
                    >
                      {ex.muscle}
                    </span>
                    <span className="text-slate-700">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      {ex.type === "time" ? (
                        <Clock size={10} />
                      ) : (
                        <Repeat size={10} />
                      )}
                      {ex.type === "time" ? "Tiempo" : "Reps"}
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHistoryExercise(ex);
                }}
                className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-500 press-scale hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors flex-shrink-0"
                title="Ver progreso"
              >
                <TrendingUp size={14} />
              </button>

              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-lime-500 flex-shrink-0">
                <Plus size={16} strokeWidth={3} />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-medium">
              No se encontraron ejercicios
            </div>
          )}

          {/* Custom exercise button */}
          <div className="pt-4">
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-4 border border-dashed border-slate-700 text-slate-400 rounded-2xl flex items-center justify-center gap-2 font-semibold press-scale text-sm"
              >
                <Plus size={18} /> Crear ejercicio personalizado
              </button>
            ) : (
              <div className="gradient-card p-5 rounded-2xl space-y-4 animate-scale-in">
                <h3 className="text-sm font-bold text-slate-200">
                  Nuevo Ejercicio
                </h3>
                <input
                  type="text"
                  placeholder="Nombre del ejercicio"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-slate-100 focus:outline-none focus:border-lime-500/50 text-[15px]"
                />
                <div className="flex gap-2">
                  <select
                    value={customMuscle}
                    onChange={(e) => setCustomMuscle(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-3 px-3 text-slate-200 text-sm focus:outline-none"
                  >
                    {MUSCLE_GROUPS.filter((m) => m !== "Todos").map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-3 px-3 text-slate-200 text-sm focus:outline-none"
                  >
                    <option value="reps">Repeticiones</option>
                    <option value="time">Tiempo</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCustomForm(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-400 font-semibold text-sm press-scale"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCustomAdd}
                    className="flex-1 py-3 rounded-xl gradient-lime-btn text-slate-950 font-bold text-sm press-scale"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExerciseHistory
        exercise={historyExercise}
        isOpen={!!historyExercise}
        onClose={() => setHistoryExercise(null)}
      />
    </div>
  );
}
