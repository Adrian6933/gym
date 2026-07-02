import React from "react";
import { useGymStore } from "../store/useGymStore";
import {
  LogOut,
  Trash2,
  Timer,
  Weight,
  Hash,
  Repeat,
  Palette,
  Target,
  Dumbbell,
} from "lucide-react";
import BottomNav from "./BottomNav";

export default function SettingsView() {
  const { settings, updateSettings, user, logout, clearHistory, userLevel, userExp } =
    useGymStore();

  const THEMES = [
    { id: "lime", color: "#84cc16", name: "Lime Pulse" },
    { id: "cyan", color: "#06b6d4", name: "Cyan Volt" },
    { id: "rose", color: "#f43f5e", name: "Sunset Rose" },
    { id: "amber", color: "#f59e0b", name: "Amber Gold" },
    { id: "purple", color: "#a855f7", name: "Purple Cyber" },
    { id: "volcano", color: "#f97316", name: "Orange Volcano" },
    { id: "cyberpunk", color: "#00f0ff", name: "Cyberpunk Glow" },
  ];

  const getLevelTitle = (lvl) => {
    if (lvl < 5) return "Recluta del Gym";
    if (lvl < 10) return "Iniciado Fitness";
    if (lvl < 15) return "Guerrero de Hierro";
    if (lvl < 20) return "Bestia del Powerlifting";
    if (lvl < 30) return "Titán de la Fuerza";
    if (lvl < 50) return "Semidiós del Acero";
    return "Leyenda del Olimpo 🏆";
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleClearAll = () => {
    if (
      confirm("¿Eliminar todos los datos? Esta acción no se puede deshacer.")
    ) {
      localStorage.removeItem("fitpulse-storage");
      window.location.href = "/login";
    }
  };

  return (
    <>
      <div className="px-4 pt-5 pb-24 min-h-[100dvh] relative overflow-hidden bg-hero-settings">
        {/* Decoración de fondo */}
        <svg className="absolute top-20 -right-6 w-24 h-24 text-lime-500/[0.02] animate-float-delayed pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>
        <svg className="absolute bottom-32 -left-8 w-20 h-20 text-lime-500/[0.02] animate-float pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>

        <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-6">
          Ajustes
        </h1>

        {/* Profile */}
        {user && (
          <div className="gradient-card rounded-2xl p-5 mb-6 animate-slide-up delay-1">
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-lime-500/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-700 flex items-center justify-center text-slate-950 font-black text-xl">
                  {user.name?.[0]?.toUpperCase() || "A"}
                </div>
              )}
              <div>
                <p className="text-base font-bold text-slate-100">
                  {user.name}
                </p>
                {user.email && (
                  <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gamification Progress Card */}
        <div className="gradient-card rounded-2xl p-5 mb-6 animate-slide-up delay-2">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl shadow-md">
              🏆
            </div>
            <div>
              <p className="text-base font-black text-slate-100 tracking-tight">Progreso de Nivel</p>
              <p className="text-[10px] text-[var(--accent-color)] font-black uppercase tracking-wider">
                {getLevelTitle(userLevel || 1)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-400">Nivel {userLevel || 1}</span>
              <span className="text-xs font-mono font-black text-[var(--accent-color)]">{userExp || 0} / {(userLevel || 1) * 100} EXP</span>
            </div>
            
            <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-lime-btn rounded-full transition-all duration-550 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, ((userExp || 0) / ((userLevel || 1) * 100)) * 100))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Ganas EXP completando entrenamientos (+150 por rutina), finalizando series (+10 c/u) y batiendo récords personales (+50 por PR).
            </p>
          </div>
        </div>

        {/* Theme settings */}
        <div className="gradient-card rounded-2xl p-5 mb-4 space-y-5 animate-slide-up delay-2">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                <Palette size={16} className="text-pink-400" />
              </div>
              <p className="text-sm font-bold text-slate-200">Tema Visual</p>
            </div>
            <div className="flex flex-wrap gap-3.5 items-center justify-start">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ theme: theme.id })}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all press-scale ${settings.theme === theme.id ? "ring-2 ring-offset-2 ring-offset-[var(--bg-color)]" : "opacity-75 hover:opacity-100"}`}
                  style={theme.id === "cyberpunk" ? {
                    background: "linear-gradient(135deg, #00f0ff 0%, #ff0055 100%)",
                    "--tw-ring-color": "#00f0ff",
                  } : {
                    backgroundColor: theme.color,
                    "--tw-ring-color": theme.color,
                  }}
                  title={theme.name}
                >
                  {settings.theme === theme.id && (
                    <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Mode selection toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <span className="text-xs">
                  {settings.themeMode === "light" ? "☀️" : settings.themeMode === "amoled" ? "🕶️" : "🌙"}
                </span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Modo de pantalla
              </p>
            </div>
            <div className="flex bg-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => updateSettings({ themeMode: "light" })}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${settings.themeMode === "light" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                Claro
              </button>
              <button
                onClick={() => updateSettings({ themeMode: "dark" })}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${settings.themeMode === "dark" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                Oscuro
              </button>
              <button
                onClick={() => updateSettings({ themeMode: "amoled" })}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${settings.themeMode === "amoled" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                AMOLED
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Gender selection toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <span className="text-xs">
                  {settings.gender === "female" ? "👩" : "👨"}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-200 font-medium">
                  Género del Modelo
                </p>
                <p className="text-[10px] text-slate-500">
                  Para el mapa muscular
                </p>
              </div>
            </div>
            <div className="flex bg-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => updateSettings({ gender: "male" })}
                className={`px-4 py-2 text-xs font-bold transition-colors ${settings.gender !== "female" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                Hombre
              </button>
              <button
                onClick={() => updateSettings({ gender: "female" })}
                className={`px-4 py-2 text-xs font-bold transition-colors ${settings.gender === "female" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                Mujer
              </button>
            </div>
          </div>
        </div>

        {/* Workout settings */}
        <div className="gradient-card rounded-2xl p-5 mb-4 space-y-6 animate-slide-up delay-3">
          <h3 className="text-sm font-bold text-slate-200">Entrenamiento</h3>

          {/* RPE / RIR Tracking Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                <span className="text-xs">🎯</span>
              </div>
              <div>
                <p className="text-sm text-slate-200 font-medium">
                  Registro RPE / RIR
                </p>
                <p className="text-[10px] text-slate-500">
                  Registrar la intensidad percibida (1 al 10)
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ enableRpeRir: !settings.enableRpeRir })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors press-scale flex items-center ${settings.enableRpeRir ? "bg-[var(--accent-color)] justify-end" : "bg-slate-800 justify-start"}`}
            >
              <div className={`w-5 h-5 rounded-full ${settings.enableRpeRir ? "bg-slate-950" : "bg-slate-550"} transition-all`} />
            </button>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Rest duration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <Timer size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-medium">
                    Descanso entre series
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {settings.restDuration}s
                  </p>
                </div>
              </div>
            </div>
            <input
              type="range"
              min="15"
              max="300"
              step="15"
              value={settings.restDuration}
              onChange={(e) =>
                updateSettings({ restDuration: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-lime-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-lime-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1.5 font-medium">
              <span>15s</span>
              <span>5 min</span>
            </div>
          </div>

          {/* Weight unit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                <Weight size={16} className="text-orange-400" />
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Unidad de peso
              </p>
            </div>
            <div className="flex bg-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => updateSettings({ weightUnit: "kg" })}
                className={`px-5 py-2 text-xs font-bold transition-colors ${settings.weightUnit === "kg" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                kg
              </button>
              <button
                onClick={() => updateSettings({ weightUnit: "lbs" })}
                className={`px-5 py-2 text-xs font-bold transition-colors ${settings.weightUnit === "lbs" ? "bg-[var(--accent-color)] text-slate-950" : "text-slate-400"}`}
              >
                lbs
              </button>
            </div>
          </div>

          {/* Weight increment step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Dumbbell size={16} className="text-amber-400" />
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Incremento de peso
              </p>
            </div>
            <select
              value={settings.weightIncrement || 2.5}
              onChange={(e) =>
                updateSettings({ weightIncrement: parseFloat(e.target.value) })
              }
              className="bg-slate-800 border-none text-slate-200 font-bold text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
            >
              <option value="0.5">0.5 {settings.weightUnit}</option>
              <option value="1">1 {settings.weightUnit}</option>
              <option value="1.25">1.25 {settings.weightUnit}</option>
              <option value="2.5">2.5 {settings.weightUnit}</option>
              <option value="5">5 {settings.weightUnit}</option>
            </select>
          </div>

          {/* Weekly goal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Target size={16} className="text-emerald-400" />
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Meta semanal (días)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateSettings({
                    weeklyGoal: Math.max(1, (settings.weeklyGoal || 4) - 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale font-bold"
              >
                -
              </button>
              <span className="text-lg font-bold text-slate-100 w-6 text-center">
                {settings.weeklyGoal || 4}
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    weeklyGoal: Math.min(7, (settings.weeklyGoal || 4) + 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Default sets */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <Hash size={16} className="text-purple-400" />
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Series por defecto
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateSettings({
                    defaultSets: Math.max(1, settings.defaultSets - 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale font-bold"
              >
                -
              </button>
              <span className="text-lg font-bold text-slate-100 w-6 text-center">
                {settings.defaultSets}
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    defaultSets: Math.min(10, settings.defaultSets + 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Default reps */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Repeat size={16} className="text-cyan-400" />
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Repeticiones por defecto
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateSettings({
                    defaultReps: Math.max(1, settings.defaultReps - 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale font-bold"
              >
                -
              </button>
              <span className="text-lg font-bold text-slate-100 w-6 text-center">
                {settings.defaultReps}
              </span>
              <button
                onClick={() =>
                  updateSettings({
                    defaultReps: Math.min(50, settings.defaultReps + 1),
                  })
                }
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 press-scale font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="gradient-card rounded-2xl p-5 space-y-3 animate-slide-up delay-3">
          <h3 className="text-sm font-bold text-slate-200">Cuenta</h3>

          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-xl bg-slate-800/80 text-slate-300 font-semibold flex items-center justify-center gap-2 press-scale text-sm"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>

          <button
            onClick={handleClearAll}
            className="w-full py-3.5 rounded-xl bg-red-500/10 text-red-400 font-semibold flex items-center justify-center gap-2 press-scale text-sm"
          >
            <Trash2 size={16} /> Borrar todos los datos
          </button>
        </div>

        {/* App info */}
        <div className="text-center mt-8">
          <p className="text-sm font-bold text-slate-600">
            Fit<span className="text-lime-500/50">Pulse</span>
          </p>
          <p className="text-[10px] text-slate-700 mt-0.5">v2.0.0</p>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
