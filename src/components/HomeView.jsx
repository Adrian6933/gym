import React from "react";
import {
  useGymStore,
  calculateStreak,
  calculateRecordStreak,
  getWeeklyConsistency,
  getWeeklyStats,
} from "../store/useGymStore";
import { ChevronRight, Calendar, Trophy, Zap, Activity, Sun, Moon, MoonStar } from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import BottomNav from "./BottomNav";

const MOTIVATIONAL_QUOTES = [
  "¡A por el récord de hoy! 🏋️",
  "La consistencia es la clave del éxito. 🔑",
  "Cada repetición te acerca a tu meta. 🎯",
  "Tu único rival es el que fuiste ayer. 💪",
  "El dolor es temporal, el orgullo es para siempre. 🔥",
  "Sin prisa, pero sin pausa. 🚀",
  "El éxito comienza con la decisión de intentarlo. ⚡",
];

function DecorDumbbell({ className }) {
  return (
    <svg className={`pointer-events-none opacity-[0.03] ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="10" width="3" height="4" rx="1" />
      <rect x="19" y="10" width="3" height="4" rx="1" />
      <rect x="4" y="8" width="16" height="8" rx="1.5" />
      <rect x="6" y="9" width="12" height="6" rx="1" />
    </svg>
  );
}

export default function HomeView() {
  const { activeWorkout, history, settings, updateSettings, routines, weeklySchedule, setWeeklySchedule, startWorkout, userLevel } = useGymStore();
  const [selectedDayIndex, setSelectedDayIndex] = React.useState(null);

  React.useEffect(() => {
    if (selectedDayIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedDayIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDayIndex]);

  const streak = calculateStreak(history);
  const recordStreak = calculateRecordStreak(history);
  const consistency = getWeeklyConsistency(history);
  const { volume, count, duration } = getWeeklyStats(history);

  const goal = settings?.weeklyGoal || 4;
  const themeMode = settings?.themeMode || "dark";

  const DAYS_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const todayNum = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const todayIndex = todayNum === 0 ? 6 : todayNum - 1; // 0 is Monday, 6 is Sunday

  const handleSelectRoutine = (dayIdx, routineId) => {
    setWeeklySchedule(dayIdx, routineId);
    setSelectedDayIndex(null);
  };

  const getLevelTitle = (lvl) => {
    if (lvl < 5) return "Recluta del Gym";
    if (lvl < 10) return "Iniciado Fitness";
    if (lvl < 15) return "Guerrero de Hierro";
    if (lvl < 20) return "Bestia del Powerlifting";
    if (lvl < 30) return "Titán de la Fuerza";
    if (lvl < 50) return "Semidiós del Acero";
    return "Leyenda del Olimpo 🏆";
  };

  const quote =
    MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  const toggleThemeMode = () => {
    let nextMode = "dark";
    if (themeMode === "dark") nextMode = "amoled";
    else if (themeMode === "amoled") nextMode = "light";
    else nextMode = "dark";
    updateSettings({ themeMode: nextMode });
  };

  return (
    <>
      <div className="px-4 pt-5 pb-28 space-y-6 bg-hero-gym">
        {/* Header, Motivation & Toggle */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col space-y-1 flex-1">
            <ProfileHeader />
            <div className="flex items-center gap-1.5 pl-1.5 mt-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Rango:
              </span>
              <span className="text-[9px] text-[var(--accent-color)] font-black uppercase tracking-wider">
                {getLevelTitle(userLevel || 1)}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium italic pl-1.5 mt-1.5">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
          {/* Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center press-scale mt-1 shadow-md text-[var(--accent-color)]"
            title="Cambiar modo de pantalla"
            aria-label="Cambiar modo de pantalla"
          >
            {themeMode === "light" ? <Sun size={17} /> : themeMode === "amoled" ? <MoonStar size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Active workout banner */}
        {activeWorkout && (
          <a
            href="/workout"
            className="block gradient-card-lime rounded-2xl p-4 press-scale animate-pulse-glow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] font-bold text-lime-500 uppercase tracking-widest">
                  Entrenamiento en curso
                </p>
                <p className="text-base font-bold text-slate-100 mt-0.5">
                  {activeWorkout.emoji} {activeWorkout.name}
                </p>
              </div>
              <ChevronRight size={20} className="text-lime-500" />
            </div>
          </a>
        )}

        {/* Racha / Streak Widget */}
        <div className="gradient-card rounded-2xl p-4.5 flex items-center justify-between relative overflow-hidden border-l-4 border-orange-500">
          <div className="absolute top-[-30%] right-[-10%] w-[30vw] h-[30vw] bg-orange-500/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl animate-fire-pulse">
              🔥
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                Racha Activa
              </p>
              <p className="text-lg font-black text-slate-100 tracking-tight mt-0.5">
                {streak === 0
                  ? "¡Empieza tu racha!"
                  : `${streak} día${streak !== 1 ? "s" : ""} seguidos`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-955/80 px-3 py-2 rounded-xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-500">Récord</span>
            <span className="text-xs font-black text-orange-500">
              {recordStreak}d
            </span>
          </div>
        </div>

        {/* Consistency Calendar (7 Days) */}
        <div className="gradient-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} className="text-lime-500" />
            <p className="text-xs font-bold uppercase tracking-wider">
              Consistencia Semanal
            </p>
          </div>
          <div className="flex justify-between items-center px-1">
            {["L", "M", "X", "J", "V", "S", "D"].map((day, index) => {
              const active = consistency[index];
              const todayNum = new Date().getDay();
              const isToday = todayNum === (index === 6 ? 0 : index + 1);
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span
                    className={`text-[10px] font-bold ${isToday ? "text-lime-500" : "text-slate-500"}`}
                  >
                    {day}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      active
                        ? "bg-gradient-to-br from-lime-500 to-lime-600 text-[#0a0a0f] shadow-lg shadow-lime-500/20"
                        : isToday
                          ? "border border-lime-500/50 text-lime-500 animate-pulse bg-lime-500/5"
                          : "bg-slate-955 border border-slate-700 text-slate-500"
                    }`}
                  >
                    {active ? "✓" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Planificación Semanal */}
        <div className="gradient-card rounded-2xl p-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} className="text-lime-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Planificación Semanal
              </h3>
            </div>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Pulsa para planificar</span>
          </div>

          <div className="space-y-2">
            {DAYS_NAMES.map((dayName, idx) => {
              const routineId = weeklySchedule[idx];
              const routine = routines.find((r) => r.id === routineId);
              const isToday = todayIndex === idx;

              return (
                // Div (no button) porque contiene un <button> "Entrenar" anidado;
                // el rol+teclado propio evita anidar elementos interactivos inválidos.
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedDayIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedDayIndex(idx);
                    }
                  }}
                  className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl border transition-all cursor-pointer ${
                    isToday
                      ? "bg-slate-950/40 border-lime-500/25 hover:border-lime-500/40 shadow-sm"
                      : "bg-slate-950/20 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isToday ? "var(--accent-color)" : "transparent" }}
                    />
                    <span className={`text-xs font-black w-18 ${isToday ? "text-slate-200" : "text-slate-400"}`}>
                      {dayName}
                    </span>
                    {routine ? (
                      <span className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-sm">
                          {routine.emoji}
                        </span>
                        <span className="truncate max-w-[120px]">{routine.name}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-650 font-bold italic">Descanso 💤</span>
                    )}
                  </div>

                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real (evita reabrir el modal al pulsar el botón/chevron internos) */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {routine && isToday && (
                      <button
                        onClick={() => {
                          startWorkout(routine);
                          window.location.href = "/workout";
                        }}
                        className="px-2.5 py-1 bg-lime-500 hover:bg-lime-600 text-[#0a0a0f] text-[10px] font-black rounded-lg shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-1 uppercase tracking-wider"
                      >
                        Entrenar
                      </button>
                    )}
                    <ChevronRight size={14} className="text-slate-600" onClick={() => setSelectedDayIndex(idx)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selector de Rutina para el Planificador */}
        {selectedDayIndex !== null && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
          <div
            className="fixed inset-0 bg-slate-800/40 backdrop-blur-md flex items-end justify-center z-[100] animate-fade-in"
            onClick={() => setSelectedDayIndex(null)}
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
            <div
              className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-[2.5rem] p-6 space-y-5 animate-slide-up-sheet safe-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-slate-100 tracking-tight">
                    Planificar {DAYS_NAMES[selectedDayIndex]}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Elige una rutina para este día
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDayIndex(null)}
                  className="text-xs text-slate-500 font-bold"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
                {/* Botón de descanso */}
                <button
                  onClick={() => handleSelectRoutine(selectedDayIndex, null)}
                  className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-between border transition-all text-left ${
                    !weeklySchedule[selectedDayIndex]
                      ? "bg-slate-800 border-lime-500/30 text-slate-200"
                      : "bg-slate-955 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💤</span>
                    <span className="text-xs font-black">Día de Descanso</span>
                  </div>
                  {!weeklySchedule[selectedDayIndex] && (
                    <span className="w-2 h-2 rounded-full bg-lime-500" />
                  )}
                </button>

                {routines.map((routine) => {
                  const isSelected = weeklySchedule[selectedDayIndex] === routine.id;
                  return (
                    <button
                      key={routine.id}
                      onClick={() => handleSelectRoutine(selectedDayIndex, routine.id)}
                      className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-between border transition-all text-left ${
                        isSelected
                          ? "bg-slate-800 border-lime-500/30 text-slate-200"
                          : "bg-slate-955 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{routine.emoji}</span>
                        <span className="text-xs font-black">{routine.name}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-lime-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setSelectedDayIndex(null)}
                className="w-full py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider press-scale"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Volumen */}
          <div className="gradient-card rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
            <DecorDumbbell className="absolute -bottom-4 -right-4 w-20 h-20 animate-drift" />
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Volumen Semanal
              </p>
              <Activity size={14} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-200 mt-2">
                {volume.toLocaleString()}{" "}
                <span className="text-xs font-bold text-slate-500">
                  {settings.weightUnit || "kg"}
                </span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Acumulado de entrenos
              </p>
            </div>
          </div>

          {/* Metas Sesiones */}
          <div className="gradient-card rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
            <DecorDumbbell className="absolute -top-4 -left-4 w-16 h-16 animate-float-slow" />
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Objetivo Semanal
              </p>
              <Trophy size={14} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-200 mt-2">
                {count}{" "}
                <span className="text-xs font-bold text-slate-500">
                  / {goal} días
                </span>
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="gradient-lime-btn h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (count / goal) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tiempo */}
          <div className="gradient-card rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
            <DecorDumbbell className="absolute -bottom-6 -right-6 w-24 h-24 animate-float" />
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Tiempo Activo
              </p>
              <Zap size={14} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-200 mt-2">
                {duration}{" "}
                <span className="text-xs font-bold text-slate-500">min</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Tiempo bajo tensión
              </p>
            </div>
          </div>

          {/* PRs */}
          <div className="gradient-card rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
            <DecorDumbbell className="absolute top-0 right-0 w-20 h-20 animate-float-delayed" />
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Récords Personales
              </p>
              <Zap size={14} className="text-pink-500" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-200 mt-2">
                {
                  Object.keys(useGymStore.getState().personalRecords || {})
                    .length
                }{" "}
                <span className="text-xs font-bold text-slate-500">PRs</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Marcas máximas
              </p>
            </div>
          </div>
        </div>

        {/* Quick action to go to Workouts */}
        <a
          href="/workout"
          className="w-full py-4 rounded-2xl gradient-lime-btn text-slate-950 font-black text-center text-sm press-scale shadow-lg block uppercase tracking-wider"
        >
          Ir a Entrenar / Ver Rutinas
        </a>
      </div>
      <BottomNav />
    </>
  );
}
