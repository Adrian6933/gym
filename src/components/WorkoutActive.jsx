import React, { useState, useEffect, useCallback } from "react";
import { useGymStore, getExerciseCalories } from "../store/useGymStore";
import {
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Timer from "./Timer";
import ExerciseSelector from "./ExerciseSelector";
import RoutineManager from "./RoutineManager";
import WorkoutSummarySheet from "./WorkoutSummarySheet";
import OneRMCalculator from "./OneRMCalculator";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./Toast";
import { MUSCLE_COLORS, MUSCLE_IMAGES } from "../data/exercises";
import PRConfetti from "./workout/PRConfetti";
import ExerciseTimerMode from "./workout/ExerciseTimerMode";
import ExerciseRepsMode from "./workout/ExerciseRepsMode";
import PlateCalculatorModal from "./workout/PlateCalculatorModal";

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
    updateExerciseNotes,
    settings,
  } = useGymStore();
  const [timerActive, setTimerActive] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [prTrigger, setPrTrigger] = useState(0);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  // Referencia estable para que el useEffect del Timer no reciba un callback nuevo en cada render
  const handleTimerDone = useCallback(() => setTimerActive(false), []);

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
    // Solo depende de startTime (fijo durante todo el entrenamiento): meter
    // el objeto activeWorkout completo reiniciaría el intervalo en cada
    // actualización del store (cada serie marcada), causando saltos en el contador.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setTimerKey((k) => k + 1);
    setTimerActive(true);
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
      setType: "warmup",
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
        key={timerKey}
        isActive={timerActive}
        durationSeconds={settings?.restDuration || 90}
        onClose={() => setTimerActive(false)}
        onComplete={handleTimerDone}
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
                  loading="lazy"
                  decoding="async"
                  className="max-h-[260px] max-w-[260px] object-contain animate-pulse"
                />
              )}
            </div>

            {/* Exercise title */}
            <div className="p-4 border-b border-white/5 relative z-10 bg-slate-900/40 backdrop-blur-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {currentEx.image && (
                    <img
                      src={currentEx.image}
                      alt={currentEx.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-lg"
                    />
                  )}
                  <div className="min-w-0">
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
                    <h2 className="text-xl font-bold text-slate-100 truncate">
                      {currentEx.name}
                    </h2>
                  </div>
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
                  onChange={(e) =>
                    updateExerciseNotes(currentExerciseIndex, e.target.value)
                  }
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
            onClick={() => setConfirmCancelOpen(true)}
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

      <ConfirmDialog
        open={confirmCancelOpen}
        title="¿Cancelar entrenamiento?"
        message="No se guardará ningún progreso de esta sesión."
        onConfirm={() => {
          cancelWorkout();
          window.location.href = "/";
        }}
        onCancel={() => setConfirmCancelOpen(false)}
      />
    </>
  );
}