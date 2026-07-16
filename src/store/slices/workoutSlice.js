import { supabase } from "../../db/supabase";
import { useToastStore } from "../../components/Toast";

// ===== ACCIONES DE ENTRENAMIENTO ACTIVO =====
export const createWorkoutSlice = (set, get) => ({
  activeWorkout:
    typeof window !== "undefined"
      ? (() => {
          try {
            const saved = sessionStorage.getItem("fitpulse-active-workout");
            return saved ? JSON.parse(saved) : null;
          } catch {
            return null;
          }
        })()
      : null,
  currentExerciseIndex:
    typeof window !== "undefined"
      ? (() => {
          try {
            return Number(
              sessionStorage.getItem("fitpulse-active-exercise-index"),
            ) || 0;
          } catch {
            return 0;
          }
        })()
      : 0,

  startWorkout: (routine) => {
    const history = get().history;
    const exercisesWithSuggestions = routine.exercises.map((ex) => {
      let lastExLog = null;
      for (const workout of history) {
        const foundEx = workout.exercises?.find((e) => e.id === ex.id);
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
        const setsToUse = completedSets.length > 0 ? completedSets : lastExLog.sets;
        sets = setsToUse.map((s, i) => ({
          id: `${Date.now()}-${i}`,
          reps: s.reps ? String(s.reps) : "",
          weight: s.weight ? String(s.weight) : "",
          duration: s.duration ? String(s.duration) : "",
          completed: false,
          isSuggested: true,
        }));
      } else {
        sets = Array.from({ length: ex.targetSets || 3 }, (_, i) => ({
          id: `${Date.now()}-${i}`,
          reps: "",
          weight: ex.targetWeight ? String(ex.targetWeight) : "",
          duration: ex.targetDuration ? String(ex.targetDuration) : "",
          completed: false,
        }));
      }

      return {
        ...ex,
        sets,
      };
    });

    const newWorkout = {
      routineId: routine.id,
      name: routine.name,
      emoji: routine.emoji,
      color: routine.color,
      startTime: Date.now(),
      exercises: exercisesWithSuggestions,
    };
    set({
      activeWorkout: newWorkout,
      currentExerciseIndex: 0,
    });
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "fitpulse-active-workout",
        JSON.stringify(newWorkout),
      );
      sessionStorage.setItem("fitpulse-active-exercise-index", "0");
    }
  },

  nextExercise: () =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const maxIdx = state.activeWorkout.exercises.length - 1;
      const newIdx = Math.min(state.currentExerciseIndex + 1, maxIdx);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "fitpulse-active-exercise-index",
          String(newIdx),
        );
      }
      return { currentExerciseIndex: newIdx };
    }),

  prevExercise: () =>
    set((state) => {
      const newIdx = Math.max(state.currentExerciseIndex - 1, 0);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "fitpulse-active-exercise-index",
          String(newIdx),
        );
      }
      return { currentExerciseIndex: newIdx };
    }),

  goToExercise: (index) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fitpulse-active-exercise-index", String(index));
    }
    set({ currentExerciseIndex: index });
  },

  addSet: (exerciseIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const newExercises = JSON.parse(
        JSON.stringify(state.activeWorkout.exercises),
      );
      const ex = newExercises[exerciseIndex];
      ex.sets.push({
        id: `${Date.now()}`,
        reps: "",
        weight: ex.targetWeight ? String(ex.targetWeight) : "",
        duration: ex.targetDuration ? String(ex.targetDuration) : "",
        completed: false,
      });
      return {
        activeWorkout: { ...state.activeWorkout, exercises: newExercises },
      };
    }),

  removeSet: (exerciseIndex, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const newExercises = JSON.parse(
        JSON.stringify(state.activeWorkout.exercises),
      );
      if (newExercises[exerciseIndex].sets.length <= 1) return state;
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      return {
        activeWorkout: { ...state.activeWorkout, exercises: newExercises },
      };
    }),

  updateSet: (exerciseIndex, setIndex, field, value) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const newExercises = JSON.parse(
        JSON.stringify(state.activeWorkout.exercises),
      );
      newExercises[exerciseIndex].sets[setIndex][field] = value;
      // Desmarcar sugerencia al ser editada
      newExercises[exerciseIndex].sets[setIndex].isSuggested = false;
      return {
        activeWorkout: { ...state.activeWorkout, exercises: newExercises },
      };
    }),

  updateExerciseNotes: (exerciseIndex, notes) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const newExercises = [...state.activeWorkout.exercises];
      newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], notes };
      return {
        activeWorkout: { ...state.activeWorkout, exercises: newExercises },
      };
    }),

  toggleSetComplete: (exerciseIndex, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const newExercises = JSON.parse(
        JSON.stringify(state.activeWorkout.exercises),
      );
      const setObj = newExercises[exerciseIndex].sets[setIndex];
      setObj.completed = !setObj.completed;
      if (setObj.completed && setObj.isSuggested) {
        setObj.isSuggested = false;
      }
      return {
        activeWorkout: { ...state.activeWorkout, exercises: newExercises },
      };
    }),

  finishWorkout: async () => {
    const activeWorkout = get().activeWorkout;
    const user = get().user;
    if (!activeWorkout || !user) return;

    const endTime = Date.now();
    const workout = {
      ...activeWorkout,
      endTime,
    };

    // Calcular PRs
    const newPRs = { ...get().personalRecords };
    const prsToUpsert = [];
    let prsBeaten = 0;
    let completedSetsCount = 0;

    workout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          completedSetsCount++;
          if (s.weight && s.reps) {
            const w = parseFloat(s.weight);
            const r = parseInt(s.reps);
            const vol = w * r;
            const current = newPRs[ex.id];

            let isNewMaxWeight = false;
            let isNewMaxVolume = false;

            if (!current || w > (current.maxWeight || 0)) {
              newPRs[ex.id] = {
                ...newPRs[ex.id],
                maxWeight: w,
                maxWeightDate: endTime,
                exerciseName: ex.name,
              };
              isNewMaxWeight = true;
            }
            if (!current || vol > (current.maxVolume || 0)) {
              newPRs[ex.id] = {
                ...newPRs[ex.id],
                maxVolume: vol,
                maxVolumeDate: endTime,
                exerciseName: ex.name,
              };
              isNewMaxVolume = true;
            }

            if (isNewMaxWeight || isNewMaxVolume) {
              prsBeaten++;
            }
          }
        }
      });

      // Si se superó alguna marca, preparamos la actualización para Supabase
      if (newPRs[ex.id]) {
        prsToUpsert.push({
          user_id: user.id,
          exercise_id: ex.id,
          max_weight: newPRs[ex.id].maxWeight || null,
          max_weight_date: newPRs[ex.id].maxWeightDate || null,
          max_volume: newPRs[ex.id].maxVolume || null,
          max_volume_date: newPRs[ex.id].maxVolumeDate || null,
          exercise_name: newPRs[ex.id].exerciseName,
        });
      }
    });

    // Guardar el entreno en Supabase (con 1 reintento ante fallo transitorio)
    const insertWorkout = () =>
      supabase
        .from("workouts_history")
        .insert({
          user_id: user.id,
          routine_id: workout.routineId,
          name: workout.name,
          emoji: workout.emoji,
          color: workout.color,
          start_time: workout.startTime,
          end_time: workout.endTime,
          exercises: workout.exercises,
        })
        .select()
        .single();

    let { data: dbWorkout, error: workoutError } = await insertWorkout();
    if (workoutError) {
      ({ data: dbWorkout, error: workoutError } = await insertWorkout());
    }

    if (workoutError) {
      console.error("Error saving workout history:", workoutError);
      useToastStore.getState().addToast({
        type: "info",
        title: "No se pudo guardar el entrenamiento",
        message:
          "Revisa tu conexión. Tu progreso local no se ha perdido, pero no se sincronizó.",
        duration: 5000,
      });
    } else if (dbWorkout) {
      workout.id = dbWorkout.id;
    }

    // Guardar PRs en Supabase si hay alguno (con 1 reintento)
    if (prsToUpsert.length > 0) {
      let { error: prsError } = await supabase
        .from("personal_records")
        .upsert(prsToUpsert);
      if (prsError) {
        ({ error: prsError } = await supabase
          .from("personal_records")
          .upsert(prsToUpsert));
      }
      if (prsError) {
        console.error("Error saving personal records:", prsError);
        useToastStore.getState().addToast({
          type: "info",
          title: "No se pudieron guardar tus récords",
          message:
            "El entrenamiento se guardó, pero los PRs no se sincronizaron. Se reintentará más tarde.",
          duration: 5000,
        });
      }
    }

    // Calcular EXP y otorgarla
    const earnedExp = 150 + completedSetsCount * 10 + prsBeaten * 50;
    await get().addExp(earnedExp);

    set((state) => ({
      history: [workout, ...state.history],
      activeWorkout: null,
      currentExerciseIndex: 0,
      personalRecords: newPRs,
      lastWorkoutExpEarned: earnedExp,
    }));
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("fitpulse-active-workout");
      sessionStorage.removeItem("fitpulse-active-exercise-index");
    }
  },

  cancelWorkout: () => {
    set({ activeWorkout: null, currentExerciseIndex: 0 });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("fitpulse-active-workout");
      sessionStorage.removeItem("fitpulse-active-exercise-index");
    }
  },

  getLastWorkoutForExercise: (exerciseId) => {
    const history = get().history;
    for (const workout of history) {
      const exercise = workout.exercises?.find((ex) => ex.id === exerciseId);
      if (exercise && exercise.sets?.some((s) => s.completed)) {
        return exercise;
      }
    }
    return null;
  },
});