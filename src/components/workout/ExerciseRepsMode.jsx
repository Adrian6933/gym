import React, { useState } from "react";
import { useGymStore } from "../../store/useGymStore";
import { Plus, Trash2, Check } from "lucide-react";
import { sanitizeNumericInput } from "./sanitizeNumericInput";

export default function ExerciseRepsMode({
  exercise,
  exerciseIndex,
  onSetComplete,
  onOpenCalculator,
  onPrBeaten,
}) {
  const { addSet, removeSet, updateSet, toggleSetComplete, settings, personalRecords } = useGymStore();
  const [expPopup, setExpPopup] = useState(null);

  const handleCheck = (setIdx) => {
    const set = exercise.sets[setIdx];

    // Si la serie está sugerida y no se ha modificado, usamos los valores sugeridos al completarla
    if (set.isSuggested && !set.completed) {
      if (!set.weight && exercise.targetWeight) updateSet(exerciseIndex, setIdx, "weight", String(exercise.targetWeight));
      if (!set.reps && exercise.targetReps) updateSet(exerciseIndex, setIdx, "reps", String(exercise.targetReps));
    }

    toggleSetComplete(exerciseIndex, setIdx);

    const isNowCompleted = !set.completed;
    if (isNowCompleted) {
      if (navigator.vibrate) navigator.vibrate(30);
      const popupKey = Date.now();
      setExpPopup({ setIdx, key: popupKey });
      setTimeout(() => {
        setExpPopup((current) => (current?.key === popupKey ? null : current));
      }, 1000);
      if (onSetComplete) onSetComplete();

      // Comprobar PR
      const pr = personalRecords[exercise.id];
      const currentWeight = parseFloat(set.weight || (set.isSuggested ? exercise.targetWeight : 0)) || 0;
      const currentReps = parseInt(set.reps || (set.isSuggested ? exercise.targetReps : 0)) || 0;
      const currentVolume = currentWeight * currentReps;

      const isNewWeightPR = currentWeight > 0 && (!pr || currentWeight > (pr.maxWeight || 0));
      const isNewVolumePR = currentVolume > 0 && (!pr || currentVolume > (pr.maxVolume || 0));

      if (isNewWeightPR || isNewVolumePR) {
        if (onPrBeaten) onPrBeaten();
      }
    }
  };

  const showRpe = settings?.enableRpeRir;

  const SET_TYPE_CYCLE = ["normal", "warmup", "dropset", "failure"];
  const SET_TYPE_BADGE = {
    normal: null,
    warmup: { label: "W", color: "#f59e0b" },
    dropset: { label: "D", color: "#a855f7" },
    failure: { label: "F", color: "#ef4444" },
  };

  const handleCycleSetType = (setIdx) => {
    const current = exercise.sets[setIdx].setType || "normal";
    const next =
      SET_TYPE_CYCLE[
        (SET_TYPE_CYCLE.indexOf(current) + 1) % SET_TYPE_CYCLE.length
      ];
    updateSet(exerciseIndex, setIdx, "setType", next === "normal" ? undefined : next);
  };

  return (
    <div className="space-y-2 animate-fade-in relative z-10">
      {/* Table header */}
      <div className="flex text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 py-2">
        <div className="w-9 text-center">Set</div>
        <div className="flex-1 text-center">Kg</div>
        <div className="flex-1 text-center">Reps</div>
        {showRpe && <div className="w-14 text-center">RPE</div>}
        <div className="w-[3.5rem] text-center">✓</div>
      </div>

      {/* Set rows */}
      {exercise.sets.map((set, setIdx) => (
        <div
          key={set.id}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition-colors ${set.completed ? "bg-lime-500/5" : ""}`}
        >
          <div className="w-9 flex justify-center">
            <button
              type="button"
              onClick={() => handleCycleSetType(setIdx)}
              disabled={set.completed}
              title="Toca para marcar como calentamiento / dropset / al fallo"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 text-[11px] font-bold text-slate-450 disabled:opacity-60 press-scale"
              style={
                SET_TYPE_BADGE[set.setType || "normal"]
                  ? {
                      backgroundColor: `${SET_TYPE_BADGE[set.setType].color}20`,
                      color: SET_TYPE_BADGE[set.setType].color,
                    }
                  : undefined
              }
            >
              {SET_TYPE_BADGE[set.setType || "normal"]?.label || setIdx + 1}
            </button>
          </div>

          {/* Kg Input with Plate Calculator trigger */}
          <div className="flex-1 relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder={String(exercise.targetWeight || "-")}
              value={set.weight}
              onChange={(e) =>
                updateSet(
                  exerciseIndex,
                  setIdx,
                  "weight",
                  sanitizeNumericInput(e.target.value, { maxValue: 999 }),
                )
              }
              disabled={set.completed}
              className={`w-full bg-slate-900/85 border border-slate-800 text-center text-lg font-bold py-3 pr-8 rounded-xl focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/30 disabled:opacity-40 transition-all placeholder:text-slate-700 ${
                set.completed
                  ? "text-lime-500"
                  : set.isSuggested
                    ? "text-slate-400 font-medium italic"
                    : "text-slate-100"
              }`}
            />
            {!set.completed && (
              <button
                type="button"
                onClick={() =>
                  onOpenCalculator(set.weight || exercise.targetWeight || 0)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-lime-500 transition-colors press-scale"
                title="Calcular discos"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-1">
            <input
              type="text"
              inputMode="decimal"
              placeholder={String(exercise.targetReps || "-")}
              value={set.reps}
              onChange={(e) =>
                updateSet(
                  exerciseIndex,
                  setIdx,
                  "reps",
                  sanitizeNumericInput(e.target.value, { maxValue: 300, allowDecimal: false }),
                )
              }
              disabled={set.completed}
              className={`w-full bg-slate-900/85 border border-slate-800 text-center text-lg font-bold py-3 rounded-xl focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/30 disabled:opacity-40 transition-all placeholder:text-slate-700 ${
                set.completed
                  ? "text-lime-500"
                  : set.isSuggested
                    ? "text-slate-400 font-medium italic"
                    : "text-slate-100"
              }`}
            />
          </div>

          {/* RPE Selector */}
          {showRpe && (
            <div className="w-14">
              <select
                value={set.rpe || ""}
                disabled={set.completed}
                onChange={(e) =>
                  updateSet(exerciseIndex, setIdx, "rpe", e.target.value)
                }
                className="w-full bg-slate-900/85 border border-slate-800 text-center text-sm font-bold py-3.5 rounded-xl focus:outline-none focus:border-lime-500/60 focus:ring-1 focus:ring-lime-500/30 disabled:opacity-40 transition-all text-slate-200"
              >
                <option value="">-</option>
                {Array.from({ length: 10 }, (_, i) => 10 - i).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="w-[3.5rem] flex justify-center relative">
            <button
              onClick={() => handleCheck(setIdx)}
              className={`w-[2.75rem] h-[2.75rem] flex items-center justify-center rounded-xl transition-all active:scale-90 ${
                set.completed
                  ? "bg-lime-500 text-slate-950 shadow-[0_3px_12px_rgba(132,204,22,0.35)]"
                  : "bg-slate-800/80 text-slate-600 border border-slate-700"
              }`}
            >
              <Check size={22} strokeWidth={set.completed ? 3.5 : 2} />
            </button>
            {expPopup?.setIdx === setIdx && (
              <span
                key={expPopup.key}
                className="absolute -top-1 left-1/2 -translate-x-1/2 text-[11px] font-black text-lime-400 pointer-events-none animate-float-up-fade"
              >
                +10 EXP
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Add/Remove set */}
      <div className="flex gap-2 pt-2 px-2">
        <button
          onClick={() => addSet(exerciseIndex)}
          className="flex-1 py-3 text-xs font-bold text-slate-400 bg-slate-900/40 rounded-xl press-scale flex items-center justify-center gap-1.5"
        >
          <Plus size={14} strokeWidth={3} /> Serie
        </button>
        {exercise.sets.length > 1 && (
          <button
            onClick={() => removeSet(exerciseIndex, exercise.sets.length - 1)}
            className="py-3 px-4 text-xs font-bold text-red-400/60 bg-slate-900/40 rounded-xl press-scale flex items-center justify-center gap-1"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}