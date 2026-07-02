import React, { useState, useEffect } from "react";
import { useGymStore, getExerciseCalories } from "../store/useGymStore";
import {
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Clock,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import Timer from "./Timer";
import ExerciseSelector from "./ExerciseSelector";
import BottomNav from "./BottomNav";
import RoutineManager from "./RoutineManager";
import WorkoutSummarySheet from "./WorkoutSummarySheet";
import OneRMCalculator from "./OneRMCalculator";
import { useToast } from "./Toast";
import { MUSCLE_COLORS, MUSCLE_IMAGES } from "../data/exercises";

function PRConfetti({ trigger }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#84cc16", "#06b6d4", "#f43f5e", "#f59e0b", "#a855f7", "#f97316"];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.85,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 16 - 6,
      radius: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      if (active) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [trigger]);

  if (!trigger) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function ExerciseTimerMode({ exercise, exerciseIndex }) {
  const { toggleSetComplete } = useGymStore();
  const set = exercise.sets[0];
  const duration = parseInt(exercise.targetDuration) || 30;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      if (!set.completed) toggleSetComplete(exerciseIndex, 0);
      return;
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, timeLeft]);

  const reset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = duration > 0 ? timeLeft / duration : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex flex-col items-center gap-6 py-6 animate-scale-in relative z-10">
      <div className="relative w-48 h-48">
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className="stroke-slate-800/40"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={
              set.completed
                ? "var(--accent-color)"
                : MUSCLE_COLORS[exercise.muscle] || "var(--accent-color)"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono text-4xl font-black tabular-nums ${set.completed ? "text-lime-500" : "text-slate-100"}`}
          >
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          {set.completed && (
            <span className="text-lime-500 text-xs font-bold mt-1">
              Completado
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 press-scale"
        >
          <RotateCcw size={22} />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center press-scale shadow-lg ${
            isRunning
              ? "bg-orange-500 shadow-orange-500/20"
              : "gradient-lime-btn shadow-lime-500/20"
          }`}
        >
          {isRunning ? (
            <Pause size={28} className="text-white" />
          ) : (
            <Play size={28} className="text-slate-950 ml-0.5" />
          )}
        </button>
        <button
          onClick={() => {
            if (!set.completed) toggleSetComplete(exerciseIndex, 0);
          }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center press-scale transition-colors ${
            set.completed
              ? "bg-lime-500 text-slate-950"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          <Check size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function ExerciseRepsMode({
  exercise,
  exerciseIndex,
  onSetComplete,
  onOpenCalculator,
  onPrBeaten,
}) {
  const { addSet, removeSet, updateSet, toggleSetComplete, settings, personalRecords } = useGymStore();

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
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 text-[11px] font-bold text-slate-450">
              {setIdx + 1}
            </span>
          </div>

          {/* Kg Input with Plate Calculator trigger */}
          <div className="flex-1 relative">
            <input
              type="text"
              inputMode="decimal"
              placeholder={String(exercise.targetWeight || "-")}
              value={set.weight}
              onChange={(e) =>
                updateSet(exerciseIndex, setIdx, "weight", e.target.value)
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
                updateSet(exerciseIndex, setIdx, "reps", e.target.value)
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

          <div className="w-[3.5rem] flex justify-center">
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

function PlateCalculatorModal({ isOpen, initialWeight, onClose }) {
  const [weight, setWeight] = useState(parseFloat(initialWeight) || 60);
  const [barWeight, setBarWeight] = useState(20);

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
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
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Peso Objetivo (Total)
              </label>
              <div className="flex items-center gap-2">
                <input
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
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Peso de la Barra
            </label>
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
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Distribución (Un lado)
            </label>
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

export default function WorkoutActive() {
  const {
    activeWorkout,
    currentExerciseIndex,
    nextExercise,
    prevExercise,
    goToExercise,
    finishWorkout,
    cancelWorkout,
    startWorkout,
    settings,
  } = useGymStore();
  const [timerActive, setTimerActive] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [prTrigger, setPrTrigger] = useState(0);

  // Plate Calculator state
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcWeight, setCalcWeight] = useState(60);

  // 1RM Calculator state
  const [oneRMOpen, setOneRMOpen] = useState(false);

  // Resumen de entrenamiento finalizado
  const [summary, setSummary] = useState(null);
  const toast = useToast();

  // Elapsed time counter
  useEffect(() => {
    if (!activeWorkout) return;
    const t = setInterval(
      () =>
        setElapsed(Math.floor((Date.now() - activeWorkout.startTime) / 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, [activeWorkout?.startTime]);

  if (!activeWorkout) {
    return <RoutineManager />;
  }

  const currentEx = activeWorkout.exercises[currentExerciseIndex];
  const totalExercises = activeWorkout.exercises.length;
  const completedSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0,
  );
  const totalSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0,
  );
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const elapsedMins = Math.floor(elapsed / 60);
  const elapsedSecs = elapsed % 60;

  // Live calories estimate based on completed sets
  const liveCalories = activeWorkout.exercises.reduce((acc, ex) => {
    const completedSetsInEx = ex.sets.filter((s) => s.completed).length;
    if (completedSetsInEx === 0) return acc;
    const totalKcal = getExerciseCalories(ex, settings?.restDuration || 90);
    const setsLength = ex.sets.length;
    return acc + Math.round((completedSetsInEx / setsLength) * totalKcal);
  }, 0);

  const handleSetComplete = () => {
    setTimerActive(false);
    setTimeout(() => setTimerActive(true), 50);
  };

  const handleOpenCalculator = (initialWeight) => {
    setCalcWeight(parseFloat(initialWeight) || 60);
    setCalcOpen(true);
  };

  const handleAddExercise = (exercise) => {
    const history = useGymStore.getState().history;
    let lastExLog = null;
    for (const workout of history) {
      const foundEx = workout.exercises?.find((e) => e.id === exercise.id);
      if (foundEx && foundEx.sets?.some((s) => s.completed)) {
        lastExLog = foundEx;
        break;
      }
    }

    let sets = [];
    if (lastExLog && lastExLog.sets && lastExLog.sets.length > 0) {
      const completedSets = lastExLog.sets.filter(
        (s) => s.completed || (s.weight && s.reps),
      );
      const setsToUse =
        completedSets.length > 0 ? completedSets : lastExLog.sets;
      sets = setsToUse.map((s, i) => ({
        id: `${Date.now()}-${i}`,
        reps: s.reps ? String(s.reps) : "",
        weight: s.weight ? String(s.weight) : "",
        duration: s.duration ? String(s.duration) : "",
        completed: false,
        isSuggested: true,
      }));
    } else {
      sets = Array.from({ length: exercise.targetSets || 3 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        reps: "",
        weight: exercise.targetWeight ? String(exercise.targetWeight) : "",
        duration: exercise.targetDuration
          ? String(exercise.targetDuration)
          : "",
        completed: false,
      }));
    }

    const updatedWorkout = {
      ...activeWorkout,
      exercises: [
        ...activeWorkout.exercises,
        {
          ...exercise,
          sets,
        },
      ],
    };
    startWorkout(updatedWorkout);
  };

  const handleInsertWarmup = (warmupSets) => {
    if (!activeWorkout) return;
    const newExercises = JSON.parse(JSON.stringify(activeWorkout.exercises));
    const ex = newExercises[currentExerciseIndex];
    const warmupObjs = warmupSets.map((s, i) => ({
      id: `${Date.now()}-w${i}`,
      reps: String(s.reps),
      weight: String(s.weight),
      duration: "",
      completed: false,
      isWarmup: true,
    }));
    ex.sets = [...warmupObjs, ...ex.sets];
    const updatedWorkout = {
      ...activeWorkout,
      exercises: newExercises,
    };
    startWorkout(updatedWorkout);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleFinish = async () => {
    // Capturar estadísticas del entreno antes de finalizar
    const durationSecs = Math.floor(
      (Date.now() - activeWorkout.startTime) / 1000,
    );
    const totalVolume = activeWorkout.exercises.reduce((acc, ex) => {
      return (
        acc +
        ex.sets.reduce((sAcc, s) => {
          if (s.completed && s.weight && s.reps) {
            return sAcc + parseFloat(s.weight) * parseInt(s.reps);
          }
          return sAcc;
        }, 0)
      );
    }, 0);
    const setsCompleted = activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0,
    );
    const calories = activeWorkout.exercises.reduce(
      (acc, ex) => acc + getExerciseCalories(ex, settings?.restDuration || 90),
      0,
    );

    // PRs batidos en este entreno
    const beforePRs = { ...useGymStore.getState().personalRecords };
    const prsBeaten = activeWorkout.exercises.reduce((acc, ex) => {
      const pr = beforePRs[ex.id];
      const beat = ex.sets.some((s) => {
        if (!s.completed || !s.weight || !s.reps) return false;
        const w = parseFloat(s.weight);
        const vol = w * parseInt(s.reps);
        return (
          (!pr || w > (pr.maxWeight || 0)) ||
          (!pr || vol > (pr.maxVolume || 0))
        );
      });
      return acc + (beat ? 1 : 0);
    }, 0);

    // EXP estimada (igual a la fórmula del store)
    const expEarned = 150 + setsCompleted * 10 + prsBeaten * 50;

    // Guardar el resumen para mostrar el sheet
    setSummary({
      duration: durationSecs,
      totalVolume: Math.round(totalVolume),
      setsCompleted,
      calories,
      prsBeaten,
      expEarned,
      routineName: activeWorkout.name,
      routineEmoji: activeWorkout.emoji,
      weightUnit: settings?.weightUnit || "kg",
    });

    // Vibración de celebración
    if (navigator.vibrate) {
      navigator.vibrate(prsBeaten > 0 ? [100, 50, 100, 50, 200] : [80, 40, 120]);
    }

    // Toast de feedback
    if (prsBeaten > 0) {
      toast.trophy(
        "¡Nuevo Récord Personal!",
        `Has batido ${prsBeaten} marca${prsBeaten !== 1 ? "s" : ""} 💪`,
      );
    } else {
      toast.success(
        "¡Buen trabajo! 💪",
        `+${expEarned} EXP ganadas`,
      );
    }

    // Finalizar el entreno en el store
    await finishWorkout();
  };

  const handleCloseSummary = () => {
    setSummary(null);
    window.location.href = "/history";
  };

  return (
    <>
      <PRConfetti trigger={prTrigger} />

      <Timer
        isActive={timerActive}
        durationSeconds={settings?.restDuration || 90}
        onClose={() => setTimerActive(false)}
        onComplete={() => setTimerActive(false)}
      />

      <PlateCalculatorModal
        isOpen={calcOpen}
        initialWeight={calcWeight}
        onClose={() => setCalcOpen(false)}
      />

      <OneRMCalculator
        isOpen={oneRMOpen}
        onClose={() => setOneRMOpen(false)}
        onInsertWarmup={handleInsertWarmup}
        defaultWeight={parseFloat(activeWorkout?.exercises?.[currentExerciseIndex]?.sets?.[0]?.weight) || 60}
        defaultReps={5}
        increment={settings?.weightIncrement || 2.5}
      />

      <WorkoutSummarySheet
        isOpen={!!summary}
        summary={summary}
        onClose={handleCloseSummary}
      />

        <div className="min-h-[100dvh] pb-8 flex flex-col relative overflow-hidden bg-hero-weights">
        {/* Decoración de fondo */}
        <svg className="fixed bottom-24 right-[-5%] w-40 h-40 text-lime-500/[0.02] animate-spin-slow pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
          <path d="M6.5 6.5 17.5 17.5" />
        </svg>
        <svg className="fixed top-1/3 left-[-8%] w-32 h-32 text-lime-500/[0.015] animate-float-slow pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>

        {/* Top bar */}
        <div className="sticky top-0 z-40 gradient-glass safe-top">
          <div className="px-4 py-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[11px] font-bold text-lime-500 uppercase tracking-widest">
                  {activeWorkout.emoji} Entrenando
                </p>
                <h1 className="text-lg font-bold text-slate-100 leading-tight">
                  {activeWorkout.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold text-slate-100 tabular-nums">
                  {elapsedMins}:{elapsedSecs.toString().padStart(2, "0")}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-bold">
                    {completedSets}/{totalSets} series
                  </span>
                  {liveCalories > 0 && (
                    <>
                      <span className="text-slate-700 font-bold text-[10px]">
                        ·
                      </span>
                      <span className="text-[10px] text-orange-500 font-black">
                        🔥 {liveCalories} kcal
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exercise dots */}
        <div className="flex justify-center gap-1.5 py-3 px-4">
          {activeWorkout.exercises.map((ex, idx) => {
            const allDone = ex.sets.every((s) => s.completed);
            return (
              <button
                key={idx}
                onClick={() => goToExercise(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 press-scale ${
                  idx === currentExerciseIndex
                    ? "w-8 bg-lime-500"
                    : allDone
                      ? "w-3 bg-lime-500/40"
                      : "w-3 bg-slate-700"
                }`}
              />
            );
          })}
        </div>

        {/* Current exercise */}
        <div className="flex-1 px-4">
          <div className="gradient-card rounded-2xl overflow-hidden relative min-h-[360px] flex flex-col justify-between">
            {/* Muscle illustration background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.06] blur-[2px] select-none p-6">
              {MUSCLE_IMAGES[currentEx.muscle] && (
                <img
                  src={MUSCLE_IMAGES[currentEx.muscle]}
                  alt={currentEx.muscle}
                  className="max-h-[260px] max-w-[260px] object-contain animate-pulse"
                />
              )}
            </div>

            {/* Exercise title */}
            <div className="p-4 border-b border-white/5 relative z-10 bg-slate-900/40 backdrop-blur-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1 font-black"
                    style={{
                      color:
                        MUSCLE_COLORS[currentEx.muscle] ||
                        "var(--accent-color)",
                    }}
                  >
                    {currentEx.muscle} · 🔥 ~
                    {getExerciseCalories(
                      currentEx,
                      settings?.restDuration || 90,
                    )}{" "}
                    kcal
                  </p>
                  <h2 className="text-xl font-bold text-slate-100">
                    {currentEx.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {currentEx.type !== "time" && (
                    <button
                      onClick={() => setOneRMOpen(true)}
                      className="w-9 h-9 rounded-xl bg-[var(--accent-color)]/15 flex items-center justify-center text-[var(--accent-color)] press-scale hover:bg-[var(--accent-color)]/25 transition-colors"
                      title="Calculadora 1RM + Calentamiento"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="8" y1="10" x2="10" y2="10" />
                        <line x1="13" y1="10" x2="16" y2="10" />
                        <line x1="8" y1="14" x2="10" y2="14" />
                        <line x1="13" y1="14" x2="16" y2="14" />
                        <line x1="8" y1="18" x2="16" y2="18" />
                      </svg>
                    </button>
                  )}
                  <span className="text-xs font-bold text-slate-500">
                    {currentExerciseIndex + 1}/{totalExercises}
                  </span>
                </div>
              </div>
              
              {/* Notas de Ejercicio */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="📝 Añadir nota sobre la máquina, sensaciones..."
                  value={currentEx.notes || ""}
                  onChange={(e) => {
                    const updatedExercises = [...activeWorkout.exercises];
                    updatedExercises[currentExerciseIndex].notes = e.target.value;
                    useGymStore.setState({
                      activeWorkout: { ...activeWorkout, exercises: updatedExercises }
                    });
                  }}
                  className="input-accent w-full bg-slate-950/40 border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-300 placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            {/* Exercise content */}
            <div className="p-3 flex-1 flex flex-col justify-center relative z-10">
              {currentEx.type === "time" ? (
                <ExerciseTimerMode
                  key={`${currentEx.id}-${currentExerciseIndex}`}
                  exercise={currentEx}
                  exerciseIndex={currentExerciseIndex}
                />
              ) : (
                <ExerciseRepsMode
                  exercise={currentEx}
                  exerciseIndex={currentExerciseIndex}
                  onSetComplete={handleSetComplete}
                  onOpenCalculator={handleOpenCalculator}
                  onPrBeaten={() => setPrTrigger((p) => p + 1)}
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={prevExercise}
              disabled={currentExerciseIndex === 0}
              className="flex-1 py-4 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 font-bold flex items-center justify-center gap-2 press-scale disabled:opacity-30 disabled:pointer-events-none text-sm"
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            {currentExerciseIndex < totalExercises - 1 ? (
              <button
                onClick={nextExercise}
                className="flex-1 py-4 rounded-xl gradient-lime-btn text-slate-950 font-bold flex items-center justify-center gap-2 press-scale shadow-lg shadow-lime-500/15 text-sm"
              >
                Siguiente <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-1 py-4 rounded-xl gradient-lime-btn text-slate-950 font-bold flex items-center justify-center gap-2 press-scale shadow-lg shadow-lime-500/15 text-sm animate-pulse-glow"
              >
                <Check size={18} strokeWidth={3} /> Terminar
              </button>
            )}
          </div>

          {/* Add exercise */}
          <button
            onClick={() => setSelectorOpen(true)}
            className="w-full py-3.5 mt-3 border border-dashed border-slate-800 text-slate-500 rounded-xl flex items-center justify-center gap-2 font-semibold press-scale text-xs"
          >
            <Plus size={16} /> Añadir ejercicio
          </button>

          {/* Cancel */}
          <button
            onClick={() => {
              if (confirm("¿Cancelar entrenamiento? No se guardará.")) {
                cancelWorkout();
                window.location.href = "/";
              }
            }}
            className="w-full py-3 mt-3 text-red-500/60 text-xs font-semibold press-scale"
          >
            Cancelar entrenamiento
          </button>
        </div>
      </div>

      <ExerciseSelector
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleAddExercise}
      />
    </>
  );
}
