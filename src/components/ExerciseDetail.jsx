import React, { useEffect } from "react";
import { X, Clock, Repeat, Dumbbell, Lightbulb, ListChecks } from "lucide-react";
import { MUSCLE_COLORS, DIFFICULTY_COLORS } from "../data/exercises";
import BodyFigure from "./BodyFigure";

/**
 * ExerciseDetail — Ficha completa de un ejercicio: foto, mapa muscular,
 * descripción, pasos de ejecución y consejos de técnica.
 * Props: exercise (objeto de EXERCISE_DB), isOpen, onClose.
 */
export default function ExerciseDetail({ exercise, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !exercise) return null;

  const color = MUSCLE_COLORS[exercise.muscle] || "var(--accent-color)";
  const diffColor = DIFFICULTY_COLORS[exercise.difficulty] || "#94a3b8";

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[110] flex flex-col justify-end animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Sheet */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
      <div
        className="relative bg-slate-900 rounded-t-[1.75rem] max-h-[92vh] flex flex-col animate-slide-up-sheet shadow-[0_-20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero: foto con overlay */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden">
          {exercise.image ? (
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${color}12` }}
            >
              <Dumbbell size={48} style={{ color }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full text-white active:scale-90 transition-transform border border-white/10"
            aria-label="Cerrar ficha de ejercicio"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Título sobre la imagen */}
          <div className="absolute bottom-3 left-5 right-5">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${color}26`, color }}
              >
                {exercise.muscle}
              </span>
              {exercise.difficulty && (
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: `${diffColor}26`, color: diffColor }}
                >
                  {exercise.difficulty}
                </span>
              )}
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/10 text-slate-300 flex items-center gap-1">
                {exercise.type === "time" ? <Clock size={9} /> : <Repeat size={9} />}
                {exercise.type === "time" ? "Por tiempo" : "Por reps"}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              {exercise.name}
            </h2>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 space-y-5 no-scrollbar">
          {/* Mapa muscular + equipamiento */}
          <div className="gradient-card rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-shrink-0 py-1">
              <BodyFigure muscle={exercise.muscle} width={120} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                Músculo objetivo
              </p>
              <p className="text-base font-black" style={{ color }}>
                {exercise.muscle}
              </p>
              {exercise.equipment && (
                <>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-3 mb-1">
                    Material
                  </p>
                  <p className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                    <Dumbbell size={13} className="text-slate-500" />
                    {exercise.equipment}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Descripción */}
          {exercise.description && (
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {exercise.description}
            </p>
          )}

          {/* Pasos */}
          {exercise.steps && exercise.steps.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
                <ListChecks size={14} style={{ color }} />
                Cómo se hace
              </h3>
              <ol className="space-y-2.5">
                {exercise.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${color}1f`, color }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium flex-1">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Consejos */}
          {exercise.tips && exercise.tips.length > 0 && (
            <div className="gradient-card-lime rounded-2xl p-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-lime-500 flex items-center gap-1.5 mb-2.5">
                <Lightbulb size={14} />
                Consejos de técnica
              </h3>
              <ul className="space-y-2">
                {exercise.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-lime-500 font-black text-xs mt-0.5">✓</span>
                    <p className="text-[13px] text-slate-300 leading-relaxed font-medium flex-1">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
