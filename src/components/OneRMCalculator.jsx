import React, { useState, useEffect } from "react";
import { X, Calculator, Flame, Target, Plus } from "lucide-react";

const FORMULAS = {
  epley: { name: "Epley", fn: (w, r) => (r === 1 ? w : w * (1 + r / 30)) },
  brzycki: { name: "Brzycki", fn: (w, r) => (r >= 37 ? w : w * 36 / (37 - r)) },
  lander: { name: "Lander", fn: (w, r) => (100 * w) / (101.3 - 2.67123 * r) },
  lombardi: { name: "Lombardi", fn: (w, r) => w * Math.pow(r, 0.1) },
  oconner: { name: "O'Conner", fn: (w, r) => w * (1 + 0.025 * r) },
};

const DEFAULT_WARMUP = [
  { percentage: 50, reps: 8 },
  { percentage: 70, reps: 5 },
  { percentage: 85, reps: 3 },
];

function roundToIncrement(weight, increment) {
  if (!increment || increment <= 0) return weight;
  return Math.round(weight / increment) * increment;
}

export default function OneRMCalculator({
  isOpen,
  onClose,
  onInsertWarmup,
  defaultWeight = 60,
  defaultReps = 5,
  increment = 2.5,
}) {
  const [weight, setWeight] = useState(defaultWeight);
  const [reps, setReps] = useState(defaultReps);
  const [formula, setFormula] = useState("epley");
  const [warmupSets, setWarmupSets] = useState(DEFAULT_WARMUP);
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    if (isOpen) {
      setWeight(defaultWeight);
      setReps(defaultReps);
    }
  }, [isOpen, defaultWeight, defaultReps]);

  const oneRM = FORMULAS[formula].fn(parseFloat(weight) || 0, parseInt(reps) || 1);

  const percentages = [90, 95, 100, 105, 110];
  const projectedWeights = percentages.map((p) => ({
    pct: p,
    weight: roundToIncrement((oneRM * p) / 100, increment),
  }));

  const warmupCalculated = warmupSets.map((s) => ({
    ...s,
    weight: roundToIncrement((oneRM * s.percentage) / 100, increment),
  }));

  const handleInsert = () => {
    if (onInsertWarmup) {
      onInsertWarmup(warmupCalculated);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        className="relative z-10 w-full max-w-md bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2rem] p-6 pb-8 animate-slide-up-sheet safe-bottom shadow-[0_-20px_60px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/15 flex items-center justify-center">
              <Calculator size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100 tracking-tight">
                Calculadora 1RM
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                One Rep Max + Calentamiento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 press-scale"
          >
            <X size={16} />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Peso Levantado
            </label>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                step="0.5"
                value={weight || ""}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="bg-transparent text-2xl font-black text-slate-100 w-full focus:outline-none tabular-nums"
              />
              <span className="text-sm font-bold text-slate-500">kg</span>
            </div>
          </div>
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Repeticiones
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={reps || ""}
              onChange={(e) => setReps(parseInt(e.target.value) || 1)}
              className="bg-transparent text-2xl font-black text-slate-100 w-full focus:outline-none tabular-nums"
            />
          </div>
        </div>

        {/* Selector de fórmula */}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Fórmula
          </label>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {Object.entries(FORMULAS).map(([key, f]) => (
              <button
                key={key}
                onClick={() => setFormula(key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all press-scale ${
                  formula === key
                    ? "bg-[var(--accent-color)] text-slate-950"
                    : "bg-slate-800/50 text-slate-500"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado 1RM */}
        <div className="gradient-card-lime rounded-2xl p-5 mb-4 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target size={14} className="text-[var(--accent-color)]" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Tu 1RM Estimado
            </p>
          </div>
          <p className="text-5xl font-black text-slate-100 tabular-nums tracking-tight">
            {oneRM > 0 ? oneRM.toFixed(1) : "0.0"}
            <span className="text-lg font-bold text-slate-500 ml-2">kg</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
            Peso máximo que podrías levantar 1 vez
          </p>
        </div>

        {/* Tabla de porcentajes */}
        <div className="gradient-card rounded-2xl p-4 mb-4">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">
            Porcentajes de trabajo
          </h3>
          <div className="space-y-1.5">
            {projectedWeights.map((p) => (
              <div
                key={p.pct}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-950/40"
              >
                <span className="text-xs font-bold text-slate-400">{p.pct}%</span>
                <span className="text-sm font-black text-slate-100 tabular-nums">
                  {p.weight} kg
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sets de calentamiento */}
        <div className="gradient-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Flame size={12} className="text-orange-500" />
              Sets de Calentamiento
            </h3>
            <button
              onClick={() => setWarmupSets([...warmupSets, { percentage: 60, reps: 5 }])}
              className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 press-scale"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {warmupCalculated.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-slate-950/40 rounded-xl p-2.5"
              >
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="20"
                    max="100"
                    value={s.percentage}
                    onChange={(e) => {
                      const updated = [...warmupSets];
                      updated[i].percentage = parseInt(e.target.value) || 0;
                      setWarmupSets(updated);
                    }}
                    className="w-12 bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-center text-xs font-black text-slate-200 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                  <span className="text-slate-700">×</span>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={s.reps}
                    onChange={(e) => {
                      const updated = [...warmupSets];
                      updated[i].reps = parseInt(e.target.value) || 1;
                      setWarmupSets(updated);
                    }}
                    className="w-12 bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-center text-xs font-black text-slate-200 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-bold">reps</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[var(--accent-color)] tabular-nums">
                    {s.weight}kg
                  </p>
                </div>
                {warmupSets.length > 1 && (
                  <button
                    onClick={() => {
                      const updated = warmupSets.filter((_, idx) => idx !== i);
                      setWarmupSets(updated);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center text-red-400 press-scale"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botón insertar */}
        {onInsertWarmup && (
          <button
            onClick={handleInsert}
            className="w-full py-4 rounded-2xl gradient-lime-btn text-slate-950 font-black text-sm uppercase tracking-wider press-scale shadow-lg shadow-[var(--accent-color)]/20 animate-pulse-glow"
          >
            Insertar {warmupCalculated.length} sets
          </button>
        )}
      </div>
    </div>
  );
}
