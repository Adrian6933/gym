import { supabase } from "../../db/supabase";

// ===== ACCIONES DE RUTINAS =====
export const createRoutinesSlice = (set, get) => ({
  routines: [],

  addRoutine: async (routine) => {
    const routineId = `routine-${Date.now()}`;
    const newRoutine = {
      ...routine,
      id: routineId,
      exercises: routine.exercises || [],
    };

    set((state) => ({
      routines: [...state.routines, newRoutine],
    }));

    const user = get().user;
    if (user) {
      await supabase.from("routines").insert({
        id: routineId,
        user_id: user.id,
        name: newRoutine.name,
        emoji: newRoutine.emoji,
        color: newRoutine.color,
        exercises: newRoutine.exercises,
      });
    }
  },

  updateRoutine: async (routineId, updates) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === routineId ? { ...r, ...updates } : r,
      ),
    }));

    const updated = get().routines.find((r) => r.id === routineId);
    if (updated) {
      await supabase
        .from("routines")
        .update({
          name: updated.name,
          emoji: updated.emoji,
          color: updated.color,
          exercises: updated.exercises,
        })
        .eq("id", routineId);
    }
  },

  deleteRoutine: async (id) => {
    set((state) => ({
      routines: state.routines.filter((r) => r.id !== id),
    }));

    await supabase.from("routines").delete().eq("id", id);
  },

  addExerciseToRoutine: async (routineId, exercise) => {
    const settings = get().settings;
    const newEx = {
      ...exercise,
      targetSets: settings.defaultSets,
      targetReps: exercise.type === "reps" ? settings.defaultReps : undefined,
      targetDuration:
        exercise.type === "time" ? settings.defaultDuration : undefined,
      targetWeight: 0,
    };

    set((state) => ({
      routines: state.routines.map((r) => {
        if (r.id !== routineId) return r;
        return { ...r, exercises: [...r.exercises, newEx] };
      }),
    }));

    const updated = get().routines.find((r) => r.id === routineId);
    if (updated) {
      await supabase
        .from("routines")
        .update({ exercises: updated.exercises })
        .eq("id", routineId);
    }
  },

  removeExerciseFromRoutine: async (routineId, exerciseIndex) => {
    set((state) => ({
      routines: state.routines.map((r) => {
        if (r.id !== routineId) return r;
        const newExercises = [...r.exercises];
        newExercises.splice(exerciseIndex, 1);
        return { ...r, exercises: newExercises };
      }),
    }));

    const updated = get().routines.find((r) => r.id === routineId);
    if (updated) {
      await supabase
        .from("routines")
        .update({ exercises: updated.exercises })
        .eq("id", routineId);
    }
  },

  updateExerciseInRoutine: async (routineId, exerciseIndex, updates) => {
    set((state) => ({
      routines: state.routines.map((r) => {
        if (r.id !== routineId) return r;
        const newExercises = [...r.exercises];
        newExercises[exerciseIndex] = {
          ...newExercises[exerciseIndex],
          ...updates,
        };
        return { ...r, exercises: newExercises };
      }),
    }));

    const updated = get().routines.find((r) => r.id === routineId);
    if (updated) {
      await supabase
        .from("routines")
        .update({ exercises: updated.exercises })
        .eq("id", routineId);
    }
  },

  reorderExercises: async (routineId, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    set((state) => ({
      routines: state.routines.map((r) => {
        if (r.id !== routineId) return r;
        const newExercises = [...r.exercises];
        const [moved] = newExercises.splice(fromIndex, 1);
        newExercises.splice(toIndex, 0, moved);
        return { ...r, exercises: newExercises };
      }),
    }));

    const updated = get().routines.find((r) => r.id === routineId);
    if (updated) {
      await supabase
        .from("routines")
        .update({ exercises: updated.exercises })
        .eq("id", routineId);
    }
  },
});