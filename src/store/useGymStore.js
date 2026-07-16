import { create } from "zustand";
import { getLocalDateString, getMondayOfWeek } from "../utils/dates";
import { createSessionSlice } from "./slices/sessionSlice";
import { createRoutinesSlice } from "./slices/routinesSlice";
import { createWorkoutSlice } from "./slices/workoutSlice";
import { createHistorySlice } from "./slices/historySlice";
import { createBodyMetricsSlice } from "./slices/bodyMetricsSlice";

// ===== AUXILIARES DE ESTADÍSTICAS (v3.5) =====
export const calculateStreak = (history) => {
  if (!history || history.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(
      history.map((w) => getLocalDateString(new Date(w.endTime))),
    ),
  ).sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) return 0;

  const todayStr = getLocalDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(
    uniqueDates[0] === todayStr ? todayStr : yesterdayStr,
  );

  while (true) {
    const dateStr = getLocalDateString(currentDate);
    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const calculateRecordStreak = (history) => {
  if (!history || history.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(
      history.map((w) => getLocalDateString(new Date(w.endTime || w.startTime))),
    ),
  ).sort((a, b) => a.localeCompare(b));

  if (uniqueDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);

    const diffTime = Math.abs(currDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  // Asegurar que el récord sea al menos igual a la racha actual
  const current = calculateStreak(history);
  return Math.max(maxStreak, current);
};

export const getExerciseCalories = (ex, restDuration = 90) => {
  if (!ex) return 0;
  const sets = ex.targetSets || ex.sets?.length || 3;

  if (ex.type === "time") {
    const duration =
      ex.targetDuration ||
      (ex.sets?.[0]?.duration ? parseInt(ex.sets[0].duration) : 30);
    const mins = duration / 60;
    if (ex.muscle === "Cardio") return Math.round(mins * 10 * sets);
    if (ex.muscle === "Core") return Math.round(mins * 7 * sets);
    return Math.round(mins * 6 * sets);
  } else {
    let factor = 5.0;
    const muscle = ex.muscle;
    if (muscle === "Pecho" || muscle === "Espalda" || muscle === "Pierna") {
      factor = 6.0;
    } else if (muscle === "Hombro" || muscle === "Core") {
      factor = 4.5;
    } else if (muscle === "Bíceps" || muscle === "Tríceps") {
      factor = 3.5;
    } else if (muscle === "Cardio") {
      factor = 8.0;
    }

    // El descanso entre series también quema algo (metabolismo elevado post-esfuerzo)
    const restMins = ((sets - 1) * restDuration) / 60;
    const restCalories = restMins * 1.2;
    return Math.round(sets * factor + restCalories);
  }
};

export const getRoutineStats = (routine, restDuration = 90) => {
  if (!routine || !routine.exercises || routine.exercises.length === 0) {
    return { calories: 0, duration: 0 };
  }

  let totalCalories = 0;
  let totalDurationMins = 0;

  routine.exercises.forEach((ex) => {
    totalCalories += getExerciseCalories(ex, restDuration);
    const sets = ex.targetSets || 3;
    if (ex.type === "time") {
      const duration = ex.targetDuration || 30;
      totalDurationMins +=
        (duration * sets) / 60 + ((sets - 1) * restDuration) / 60;
    } else {
      totalDurationMins += (sets * 45) / 60 + ((sets - 1) * restDuration) / 60;
    }
  });

  totalDurationMins += (routine.exercises.length - 1) * 1.5;

  return {
    calories: totalCalories,
    duration: Math.max(5, Math.round(totalDurationMins)),
  };
};

export const getWeeklyConsistency = (history) => {
  const consistency = Array(7).fill(false);
  if (!history) return consistency;

  const monday = getMondayOfWeek();

  history.forEach((w) => {
    const wDate = new Date(w.endTime);
    if (wDate >= monday) {
      let dayIndex = wDate.getDay() - 1;
      if (dayIndex === -1) dayIndex = 6;
      consistency[dayIndex] = true;
    }
  });

  return consistency;
};

export const getWeeklyStats = (history) => {
  let volume = 0;
  let count = 0;
  let duration = 0;

  const monday = getMondayOfWeek();

  history.forEach((w) => {
    const wDate = new Date(w.endTime);
    if (wDate >= monday) {
      count++;
      duration += Math.max(1, Math.round((w.endTime - w.startTime) / 60000));

      if (w.exercises) {
        w.exercises.forEach((ex) => {
          if (ex.sets) {
            ex.sets.forEach((s) => {
              if (s.completed && s.weight && s.reps) {
                const w = parseFloat(s.weight);
                const r = parseInt(s.reps, 10);
                if (!isNaN(w) && !isNaN(r)) volume += w * r;
              }
            });
          }
        });
      }
    }
  });

  return { volume, count, duration };
};

export const useGymStore = create((...a) => ({
  ...createSessionSlice(...a),
  ...createRoutinesSlice(...a),
  ...createWorkoutSlice(...a),
  ...createHistorySlice(...a),
  ...createBodyMetricsSlice(...a),
}));

// Sync automático activeWorkout -> sessionStorage en cada cambio (evita perder
// reps/pesos/notas al refrescar a mitad de un set)
if (typeof window !== "undefined") {
  useGymStore.subscribe((state, prevState) => {
    if (state.activeWorkout !== prevState.activeWorkout) {
      if (state.activeWorkout) {
        sessionStorage.setItem(
          "fitpulse-active-workout",
          JSON.stringify(state.activeWorkout),
        );
      } else {
        sessionStorage.removeItem("fitpulse-active-workout");
      }
    }
  });
}