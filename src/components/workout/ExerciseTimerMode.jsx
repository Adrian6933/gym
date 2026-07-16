import React, { useState, useEffect } from "react";
import { useGymStore } from "../../store/useGymStore";
import { MUSCLE_COLORS } from "../../data/exercises";
import { Play, Pause, RotateCcw, Check } from "lucide-react";

export default function ExerciseTimerMode({ exercise, exerciseIndex }) {
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
  }, [isRunning, timeLeft, set.completed, exerciseIndex, toggleSetComplete]);

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