import React, { useState, useMemo, useEffect } from "react";
import { X, TrendingUp, Trophy, Activity, Target, Calendar, Share2 } from "lucide-react";
import { useGymStore } from "../store/useGymStore";
import { MUSCLE_COLORS } from "../data/exercises";

function calculate1RM(weight, reps) {
  if (!weight || !reps || reps < 1) return 0;
  return weight * (1 + reps / 30);
}

function getStrengthLevel(exerciseName, weight, gender) {
  if (!weight) return { level: "Sin datos", color: "#64748b" };
  const isFemale = gender === "female";
  const w = parseFloat(weight);

  const ratios = {
    "Press de Banca": isFemale ? [0.25, 0.5, 0.75, 1.0] : [0.5, 0.75, 1.25, 1.5],
    "Sentadilla Libre": isFemale ? [0.5, 1.0, 1.25, 1.75] : [1.0, 1.25, 1.75, 2.25],
    "Peso Muerto": isFemale ? [0.75, 1.0, 1.5, 2.0] : [1.0, 1.5, 2.25, 2.75],
    "Press Militar": isFemale ? [0.2, 0.3, 0.5, 0.7] : [0.35, 0.55, 0.75, 0.95],
  };

  const bw = isFemale ? 60 : 75;
  const ratio = w / bw;
  const levels = ratios[exerciseName];

  if (!levels) {
    if (ratio < 0.5) return { level: "Principiante", color: "#84cc16" };
    if (ratio < 1) return { level: "Intermedio", color: "#06b6d4" };
    if (ratio < 1.5) return { level: "Avanzado", color: "#a855f7" };
    return { level: "Élite", color: "#f59e0b" };
  }

  if (ratio < levels[0]) return { level: "Principiante", color: "#84cc16" };
  if (ratio < levels[1]) return { level: "Intermedio", color: "#06b6d4" };
  if (ratio < levels[2]) return { level: "Avanzado", color: "#a855f7" };
  if (ratio < levels[3]) return { level: "Élite", color: "#f59e0b" };
  return { level: "Leyenda", color: "#f43f5e" };
}

function MiniChart({ data, color, height = 120 }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-600 text-xs font-medium">
        Necesitas al menos 2 sesiones para ver tu progreso
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100 / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = i * width;
      const y = 100 - ((d.value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={areaPoints}
          fill={`url(#grad-${color.replace("#", "")})`}
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = i * width;
          const y = 100 - ((d.value - min) / range) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.2"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="absolute top-0 left-0 text-[10px] text-slate-500 font-bold">
        {max.toFixed(max < 10 ? 1 : 0)}
      </div>
      <div className="absolute bottom-0 left-0 text-[10px] text-slate-500 font-bold">
        {min.toFixed(min < 10 ? 1 : 0)}
      </div>
    </div>
  );
}

function BarChart({ data, color, maxValue, height = 120 }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="flex items-end gap-1.5" style={{ height: `${height}px` }}>
      {data.map((d, i) => {
        const h = (d.value / maxValue) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${Math.max(h, d.value > 0 ? 4 : 1)}%`,
                backgroundColor: color,
                boxShadow: d.value > 0 ? `0 0 8px ${color}40` : "none",
              }}
            />
            <span className="text-[8px] text-slate-500 font-bold">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ExerciseHistory({ exercise, isOpen, onClose }) {
  const { history, settings } = useGymStore();
  const [period, setPeriod] = useState("3m");
  const [activeTab, setActiveTab] = useState("summary");

  const exerciseId = exercise?.id;
  const exerciseName = exercise?.name;
  const exerciseMuscle = exercise?.muscle;

  const periodDays = { "1m": 30, "3m": 90, "6m": 180, "1y": 365, "all": null };
  const cutoffTs = periodDays[period] ? Date.now() - periodDays[period] * 86400000 : 0;

  const allLogs = useMemo(() => {
    if (!exerciseId) return [];
    const logs = [];
    history.forEach((w) => {
      if (cutoffTs && w.endTime < cutoffTs) return;
      w.exercises?.forEach((ex) => {
        if (ex.id !== exerciseId) return;
        const completedSets = (ex.sets || []).filter((s) => s.completed);
        if (completedSets.length === 0) return;
        const maxW = Math.max(...completedSets.map((s) => parseFloat(s.weight) || 0));
        const maxR = Math.max(...completedSets.map((s) => parseInt(s.reps) || 0));
        const vol = completedSets.reduce(
          (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0),
          0
        );
        const topSet1RM = Math.max(
          ...completedSets.map((s) => calculate1RM(parseFloat(s.weight) || 0, parseInt(s.reps) || 0))
        );
        logs.push({
          date: w.endTime,
          dateStr: new Date(w.endTime).toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
          maxWeight: maxW,
          maxReps: maxR,
          topSet1RM,
          totalVolume: vol,
          setsCount: completedSets.length,
          routineName: w.name,
          routineEmoji: w.emoji,
        });
      });
    });
    return logs.sort((a, b) => a.date - b.date);
  }, [history, exerciseId, cutoffTs]);

  const stats = useMemo(() => {
    if (allLogs.length === 0 || !exerciseName) {
      return {
        maxWeight: 0,
        maxReps: 0,
        top1RM: 0,
        totalVolume: 0,
        sessions: 0,
        firstDate: null,
        lastDate: null,
        strengthLevel: { level: "Sin datos", color: "#64748b" },
      };
    }
    const maxW = Math.max(...allLogs.map((l) => l.maxWeight));
    const maxR = Math.max(...allLogs.map((l) => l.maxReps));
    const top1RM = Math.max(...allLogs.map((l) => l.topSet1RM));
    const totalVol = allLogs.reduce((acc, l) => acc + l.totalVolume, 0);
    const strength = getStrengthLevel(exerciseName, maxW, settings?.gender || "male");
    return {
      maxWeight: maxW,
      maxReps: maxR,
      top1RM,
      totalVolume: totalVol,
      sessions: allLogs.length,
      firstDate: allLogs[0].date,
      lastDate: allLogs[allLogs.length - 1].date,
      strengthLevel: strength,
    };
  }, [allLogs, exerciseName, settings?.gender]);

  const weightData = allLogs.map((l) => ({ value: l.maxWeight, label: l.dateStr }));
  const volumeData = allLogs.map((l) => ({ value: l.totalVolume, label: l.dateStr }));
  const oneRmData = allLogs.map((l) => ({ value: l.topSet1RM, label: l.dateStr }));

  const color = MUSCLE_COLORS[exerciseMuscle] || "var(--accent-color)";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[150] flex flex-col bg-[#0a0a0f] animate-fade-in"
      onClick={onClose}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
      <div
        className="relative flex-1 overflow-y-auto animate-slide-up-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 safe-top"
          style={{ backgroundColor: `${color}15`, backdropFilter: "blur(20px)" }}
        >
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center text-slate-200 press-scale"
            >
              <X size={20} />
            </button>
            {exercise.image && (
              <img
                src={exercise.image}
                alt={exercise.name}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color }}
              >
                {exercise.muscle}
              </p>
              <h1 className="text-base font-black text-slate-100 truncate">
                {exercise.name}
              </h1>
            </div>
            <button
              className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center text-slate-400 press-scale"
              title="Compartir"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5 px-4">
            {[
              { id: "summary", label: "Resumen" },
              { id: "weights", label: "Peso" },
              { id: "volume", label: "Volumen" },
              { id: "history", label: "Historial" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2.5 text-xs font-bold transition-all relative ${
                  activeTab === t.id ? "text-slate-100" : "text-slate-500"
                }`}
              >
                {t.label}
                {activeTab === t.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="px-4 pt-4 pb-28 space-y-4">
          {allLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}15` }}
              >
                <TrendingUp size={36} strokeWidth={1.5} style={{ color }} />
              </div>
              <h3 className="text-lg font-bold text-slate-300 mb-2">
                Sin historial aún
              </h3>
              <p className="text-sm text-slate-500 max-w-[240px]">
                Completa tu primer entrenamiento con este ejercicio para ver tu progreso aquí.
              </p>
            </div>
          ) : (
            <>
              {/* Selector de período */}
              {activeTab !== "history" && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: "1m", label: "1M" },
                    { id: "3m", label: "3M" },
                    { id: "6m", label: "6M" },
                    { id: "1y", label: "1A" },
                    { id: "all", label: "Todo" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPeriod(p.id)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all press-scale ${
                        period === p.id
                          ? "text-slate-950"
                          : "bg-slate-800/50 text-slate-500"
                      }`}
                      style={period === p.id ? { backgroundColor: color } : {}}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              {/* TAB: Resumen */}
              {activeTab === "summary" && (
                <>
                  {/* Strength Level Card */}
                  <div
                    className="gradient-card rounded-2xl p-5 relative overflow-hidden"
                    style={{ borderLeft: `3px solid ${stats.strengthLevel.color}` }}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Nivel de Fuerza
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h2
                        className="text-3xl font-black tracking-tight"
                        style={{ color: stats.strengthLevel.color }}
                      >
                        {stats.strengthLevel.level}
                      </h2>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                      Basado en tu peso máximo de {stats.maxWeight} kg
                    </p>
                  </div>

                  {/* Grid de récords */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="gradient-card rounded-2xl p-4">
                      <Trophy size={16} className="text-yellow-500 mb-2" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Peso Máximo
                      </p>
                      <p className="text-2xl font-black text-slate-100 mt-1 tabular-nums">
                        {stats.maxWeight}
                        <span className="text-xs font-bold text-slate-500 ml-1">kg</span>
                      </p>
                    </div>
                    <div className="gradient-card rounded-2xl p-4">
                      <Target size={16} className="text-cyan-500 mb-2" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        1RM Estimado
                      </p>
                      <p className="text-2xl font-black text-slate-100 mt-1 tabular-nums">
                        {stats.top1RM.toFixed(1)}
                        <span className="text-xs font-bold text-slate-500 ml-1">kg</span>
                      </p>
                    </div>
                    <div className="gradient-card rounded-2xl p-4">
                      <Activity size={16} className="text-orange-500 mb-2" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Volumen Total
                      </p>
                      <p className="text-2xl font-black text-slate-100 mt-1 tabular-nums">
                        {stats.totalVolume > 999
                          ? `${(stats.totalVolume / 1000).toFixed(1)}k`
                          : stats.totalVolume}
                        <span className="text-xs font-bold text-slate-500 ml-1">kg</span>
                      </p>
                    </div>
                    <div className="gradient-card rounded-2xl p-4">
                      <Calendar size={16} className="text-purple-500 mb-2" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Sesiones
                      </p>
                      <p className="text-2xl font-black text-slate-100 mt-1 tabular-nums">
                        {stats.sessions}
                      </p>
                    </div>
                  </div>

                  {/* Gráfica de peso */}
                  <div className="gradient-card rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <TrendingUp size={13} style={{ color }} />
                        Peso Máximo por Sesión
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {weightData.length} sesiones
                      </span>
                    </div>
                    <MiniChart data={weightData} color={color} height={140} />
                  </div>

                  {/* Gráfica de 1RM */}
                  <div className="gradient-card rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Target size={13} style={{ color }} />
                      1RM Estimado
                    </h3>
                    <MiniChart data={oneRmData} color={color} height={140} />
                    <p className="text-[10px] text-slate-600 italic">
                      Calculado con fórmula Epley: peso × (1 + reps/30)
                    </p>
                  </div>
                </>
              )}

              {/* TAB: Peso */}
              {activeTab === "weights" && (
                <div className="gradient-card rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Trophy size={13} className="text-yellow-500" />
                    Peso Máximo por Sesión
                  </h3>
                  <BarChart
                    data={weightData}
                    color={color}
                    maxValue={stats.maxWeight}
                    height={180}
                  />
                </div>
              )}

              {/* TAB: Volumen */}
              {activeTab === "volume" && (
                <div className="gradient-card rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity size={13} className="text-orange-500" />
                    Volumen Total por Sesión
                  </h3>
                  <BarChart
                    data={volumeData}
                    color="#f97316"
                    maxValue={Math.max(...volumeData.map((d) => d.value))}
                    height={180}
                  />
                </div>
              )}

              {/* TAB: Historial */}
              {activeTab === "history" && (
                <div className="space-y-2.5">
                  {[...allLogs].reverse().map((log, i) => (
                    <div
                      key={i}
                      className="gradient-card rounded-2xl p-4 animate-slide-up"
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <div className="flex items-start justify-between mb-2.5">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {new Date(log.date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                          <p className="text-sm font-black text-slate-100 mt-0.5 flex items-center gap-1.5">
                            <span>{log.routineEmoji}</span>
                            <span className="truncate">{log.routineName}</span>
                          </p>
                        </div>
                        <div
                          className="px-2 py-1 rounded-lg text-[10px] font-black"
                          style={{
                            backgroundColor: `${color}15`,
                            color,
                          }}
                        >
                          {log.setsCount} sets
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-950/40 rounded-lg py-1.5">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">
                            Max
                          </p>
                          <p className="text-sm font-black text-slate-200">
                            {log.maxWeight}kg
                          </p>
                        </div>
                        <div className="bg-slate-950/40 rounded-lg py-1.5">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">
                            1RM
                          </p>
                          <p className="text-sm font-black text-slate-200">
                            {log.topSet1RM.toFixed(0)}
                          </p>
                        </div>
                        <div className="bg-slate-950/40 rounded-lg py-1.5">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">
                            Vol
                          </p>
                          <p className="text-sm font-black text-slate-200">
                            {log.totalVolume > 999
                              ? `${(log.totalVolume / 1000).toFixed(1)}k`
                              : log.totalVolume}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
