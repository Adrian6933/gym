import React, { useState, useEffect } from "react";

export default function PlateCalculatorModal({ isOpen, initialWeight, onClose }) {
  const [weight, setWeight] = useState(parseFloat(initialWeight) || 60);
  const [barWeight, setBarWeight] = useState(20);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const calculatePlates = (target, bar) => {
    const platesDb = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5];
    const perSide = (target - bar) / 2;
    if (perSide <= 0) return [];

    let current = perSide;
    const res = [];
    platesDb.forEach((p) => {
      const qty = Math.floor(current / p);
      if (qty > 0) {
        res.push({ weight: p, qty });
        current = Math.round((current - qty * p) * 100) / 100;
      }
    });
    return res;
  };

  const plates = calculatePlates(weight, barWeight);

  const PLATE_STYLES = {
    25: { bg: "bg-red-600", height: "h-24", width: "w-5.5", label: "25" },
    20: { bg: "bg-blue-600", height: "h-22", width: "w-5", label: "20" },
    15: {
      bg: "bg-yellow-500 text-slate-950",
      height: "h-20",
      width: "w-5",
      label: "15",
    },
    10: { bg: "bg-green-600", height: "h-18", width: "w-5", label: "10" },
    5: {
      bg: "bg-slate-300 text-slate-950",
      height: "h-16",
      width: "w-4.5",
      label: "5",
    },
    2.5: { bg: "bg-red-800", height: "h-13", width: "w-4", label: "2.5" },
    1.25: { bg: "bg-blue-800", height: "h-11", width: "w-3.5", label: "1.25" },
    0.5: { bg: "bg-slate-700", height: "h-9", width: "w-3", label: "0.5" },
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
      <div
        className="relative z-10 w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-6 space-y-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">
            Calculadora de Discos
          </h3>
          <button
            onClick={onClose}
            className="text-xs text-slate-500 font-bold press-scale"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label
                htmlFor="plate-calc-weight"
                className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1"
              >
                Peso Objetivo (Total)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="plate-calc-weight"
                  type="number"
                  step="0.5"
                  value={weight || ""}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-slate-100 font-black text-lg focus:outline-none focus:border-lime-500/50"
                />
                <span className="text-slate-400 font-bold text-sm">kg</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Peso de la Barra
            </span>
            <div className="flex gap-2">
              {[20, 15, 10, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setBarWeight(w)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all press-scale ${
                    barWeight === w
                      ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/20"
                      : "bg-slate-950 border border-slate-850 text-slate-400"
                  }`}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Distribución (Un lado)
            </span>
            {plates.length === 0 ? (
              <div className="py-8 bg-slate-950/30 rounded-2xl border border-slate-800/80 flex items-center justify-center text-slate-550 text-xs font-semibold">
                {weight <= barWeight
                  ? "Barra sola o peso insuficiente"
                  : "Cargando distribución..."}
              </div>
            ) : (
              <div className="relative flex items-center justify-center py-10 bg-slate-955/40 rounded-2xl border border-slate-850 overflow-hidden">
                <div className="absolute left-0 right-0 h-2 bg-slate-700 z-0" />
                <div className="absolute left-4 w-3.5 h-12 bg-slate-550 border border-slate-650 rounded-sm z-0" />

                <div className="flex items-center gap-1 z-10 pl-10">
                  {plates.map((p, idx) => {
                    const style = PLATE_STYLES[p.weight] || {
                      bg: "bg-slate-600",
                      height: "h-14",
                      width: "w-4",
                      label: String(p.weight),
                    };
                    return Array.from({ length: p.qty }).map((_, qIdx) => (
                      <div
                        key={`${idx}-${qIdx}`}
                        className={`rounded-md flex items-center justify-center font-black text-[9px] text-white shadow-md border border-black/25 ${style.bg} ${style.height} ${style.width}`}
                      >
                        {style.label}
                      </div>
                    ));
                  })}
                  <div className="w-2.5 h-14 bg-slate-400 border border-slate-500 rounded-sm flex items-center justify-center text-[7px] text-slate-900 font-bold select-none z-10 shadow-md">
                    🔒
                  </div>
                </div>
              </div>
            )}
          </div>

          {plates.length > 0 && (
            <div className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Añadir a cada lado:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {plates.map((p) => (
                  <span
                    key={p.weight}
                    className="text-[11px] font-bold text-slate-300 bg-slate-850/80 px-2.5 py-1.5 rounded-lg border border-white/5"
                  >
                    {p.qty}x {p.weight} kg
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}