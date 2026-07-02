import React, { useState } from "react";
import { evaluateAchievements, TIER_STYLES } from "../data/achievements";
import { useGymStore, calculateStreak, calculateRecordStreak } from "../store/useGymStore";
import { calculateTotalVolume } from "../data/achievements";
import { Lock, Award } from "lucide-react";

export default function AchievementsPanel() {
  const [expanded, setExpanded] = useState(false);

  const history = useGymStore((s) => s.history);
  const routines = useGymStore((s) => s.routines);
  const personalRecords = useGymStore((s) => s.personalRecords);
  const userLevel = useGymStore((s) => s.userLevel);
  const settings = useGymStore((s) => s.settings);

  const streak = calculateStreak(history);
  const recordStreak = calculateRecordStreak(history);
  const totalVolume = calculateTotalVolume(history);

  const ctx = {
    history,
    routines,
    personalRecords,
    userLevel,
    streak,
    recordStreak,
    totalVolume,
    weeklyWorkouts: history.filter((w) => {
      const d = new Date(w.endTime);
      const monday = new Date();
      const daysToMonday = monday.getDay() === 0 ? 6 : monday.getDay() - 1;
      monday.setDate(monday.getDate() - daysToMonday);
      monday.setHours(0, 0, 0, 0);
      return d >= monday;
    }).length,
    weeklyGoal: settings?.weeklyGoal || 4,
  };

  const evaluated = evaluateAchievements(ctx);
  const unlocked = evaluated.filter((a) => a.unlocked);
  const locked = evaluated.filter((a) => !a.unlocked);
  const progress = evaluated.length > 0
    ? Math.round((unlocked.length / evaluated.length) * 100)
    : 0;

  // Mostrar desbloqueados primero y luego los próximos 4 bloqueados
  const visible = expanded
    ? [...unlocked, ...locked]
    : [...unlocked.slice(-4), ...locked.slice(0, 4)].slice(0, 8);

  return (
    <div className="gradient-card rounded-2xl p-4 space-y-3.5 animate-slide-up delay-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Award size={14} className="text-amber-500" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            Logros
          </h3>
        </div>
        <span className="text-[10px] font-black text-amber-500">
          {unlocked.length}/{evaluated.length}
        </span>
      </div>

      {/* Barra de progreso de logros */}
      <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grid de badges */}
      <div className="grid grid-cols-4 gap-2.5">
        {visible.map((a) => {
          const tier = TIER_STYLES[a.tier] || TIER_STYLES.bronze;
          return (
            <div
              key={a.id}
              title={`${a.name} — ${a.desc}`}
              className={`relative flex flex-col items-center gap-1 group ${a.unlocked ? "" : "opacity-45"}`}
            >
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${a.unlocked ? "scale-100 hover:scale-110" : "grayscale"}`}
                style={{
                  backgroundColor: a.unlocked ? tier.bg : "rgba(148,163,184,0.05)",
                  border: `1px solid ${a.unlocked ? tier.border : "rgba(148,163,184,0.1)"}`,
                  boxShadow: a.unlocked ? `0 0 14px -3px ${tier.glow}` : "none",
                }}
              >
                {a.unlocked ? (
                  <span className="leading-none">{a.icon}</span>
                ) : (
                  <Lock size={15} className="text-slate-600" />
                )}
                {/* Punto de rareza */}
                {a.unlocked && (
                  <span
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-color)]"
                    style={{ backgroundColor: tier.glow.replace("0.35", "1").replace("0.4", "1").replace("0.45", "1") }}
                  />
                )}
              </div>
              <span className="text-[8.5px] font-bold text-slate-400 text-center leading-tight truncate w-full">
                {a.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Botón expandir/contraer */}
      {evaluated.length > 8 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 rounded-xl bg-slate-900/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider press-scale transition-colors hover:text-slate-300"
        >
          {expanded ? "Ver menos" : `Ver todos (${evaluated.length})`}
        </button>
      )}
    </div>
  );
}
