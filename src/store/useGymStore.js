import { create } from "zustand";
import { supabase } from "../db/supabase";

// ===== AUXILIARES DE ESTADÍSTICAS (v3.5) =====
export const calculateStreak = (history) => {
  if (!history || history.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(
      history.map((w) => {
        const date = new Date(w.endTime);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }),
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
      history.map((w) => {
        const date = new Date(w.endTime || w.startTime);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }),
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
    return Math.round(sets * factor);
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

function getLocalDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const getWeeklyConsistency = (history) => {
  const consistency = Array(7).fill(false);
  if (!history) return consistency;

  const today = new Date();
  const currentDay = today.getDay();
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

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

  const today = new Date();
  const currentDay = today.getDay();
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

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
                volume += parseFloat(s.weight) * parseInt(s.reps);
              }
            });
          }
        });
      }
    }
  });

  return { volume, count, duration };
};

const DEFAULT_SETTINGS = {
  theme: "lime",
  themeMode: "dark", // 'dark' | 'light' | 'amoled'
  restDuration: 90,
  weightUnit: "kg",
  weightIncrement: 2.5,
  weeklyGoal: 4,
  defaultSets: 3,
  defaultReps: 12,
  defaultDuration: 30,
  gender: "male",
  enableRpeRir: false,
};

const DEFAULT_ROUTINES = [
  {
    id: "default-push",
    name: "Empuje",
    emoji: "🔥",
    color: "#ef4444",
    exercises: [
      {
        id: "chest-1",
        name: "Press de Banca",
        muscle: "Pecho",
        type: "reps",
        targetSets: 4,
        targetReps: 10,
        targetWeight: 60,
      },
      {
        id: "shoulder-1",
        name: "Press Militar",
        muscle: "Hombro",
        type: "reps",
        targetSets: 3,
        targetReps: 12,
        targetWeight: 30,
      },
      {
        id: "tricep-1",
        name: "Extensión Tríceps Polea",
        muscle: "Tríceps",
        type: "reps",
        targetSets: 3,
        targetReps: 15,
        targetWeight: 20,
      },
    ],
  },
  {
    id: "default-pull",
    name: "Tirón",
    emoji: "⚡",
    color: "#3b82f6",
    exercises: [
      {
        id: "back-1",
        name: "Dominadas",
        muscle: "Espalda",
        type: "reps",
        targetSets: 4,
        targetReps: 8,
        targetWeight: 0,
      },
      {
        id: "back-2",
        name: "Remo con Barra",
        muscle: "Espalda",
        type: "reps",
        targetSets: 3,
        targetReps: 10,
        targetWeight: 50,
      },
      {
        id: "bicep-1",
        name: "Curl de Bíceps con Barra",
        muscle: "Bíceps",
        type: "reps",
        targetSets: 3,
        targetReps: 12,
        targetWeight: 25,
      },
    ],
  },
  {
    id: "default-legs",
    name: "Pierna",
    emoji: "🦵",
    color: "#06b6d4",
    exercises: [
      {
        id: "leg-1",
        name: "Sentadilla Libre",
        muscle: "Pierna",
        type: "reps",
        targetSets: 4,
        targetReps: 8,
        targetWeight: 80,
      },
      {
        id: "leg-2",
        name: "Prensa de Piernas",
        muscle: "Pierna",
        type: "reps",
        targetSets: 3,
        targetReps: 12,
        targetWeight: 120,
      },
      {
        id: "leg-7",
        name: "Elevación de Gemelos",
        muscle: "Pierna",
        type: "reps",
        targetSets: 4,
        targetReps: 15,
        targetWeight: 40,
      },
    ],
  },
];

export const useGymStore = create((set, get) => ({
  // ===== ESTADOS GLOBALES =====
  user: null, // { id, name, email, picture }
  settings: DEFAULT_SETTINGS,
  routines: [],
  history: [],
  personalRecords: {},
  bodyMetrics: typeof window !== "undefined" ? (() => { try { return JSON.parse(localStorage.getItem("fitpulse-body-metrics") || "[]"); } catch { return []; } })() : [],
  activeWorkout: typeof window !== "undefined" ? (() => { try { const saved = sessionStorage.getItem("fitpulse-active-workout"); return saved ? JSON.parse(saved) : null; } catch { return null; } })() : null,
  currentExerciseIndex: typeof window !== "undefined" ? (() => { try { return Number(sessionStorage.getItem("fitpulse-active-exercise-index")) || 0; } catch { return 0; } })() : 0,
  activeTab: "home",
  isLoading: true, // Para mostrar la pantalla de carga al iniciar
  weeklySchedule: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("fitpulse-weekly-schedule") || "{}") : {},
  userLevel: 1,
  userExp: 0,
  justLeveledUp: false,
  lastWorkoutExpEarned: 0,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setWeeklySchedule: (dayIndex, routineId) => {
    const current = get().weeklySchedule;
    const updated = { ...current };
    if (routineId) {
      updated[dayIndex] = routineId;
    } else {
      delete updated[dayIndex];
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("fitpulse-weekly-schedule", JSON.stringify(updated));
    }
    set({ weeklySchedule: updated });
  },

  // ===== INICIALIZACIÓN Y AUTH =====
  initializeSession: async () => {
    set({ isLoading: true });

    // 1. Obtener sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const handleUserSession = async (userSession) => {
      if (!userSession) {
        const localGender = typeof window !== "undefined" ? localStorage.getItem("fitpulse-gender") || "male" : "male";
        const localEnableRpeRir = typeof window !== "undefined" ? localStorage.getItem("fitpulse-enable-rpe-rir") === "true" : false;
        const localLevel = typeof window !== "undefined" ? Number(localStorage.getItem("fitpulse-level") || "1") : 1;
        const localExp = typeof window !== "undefined" ? Number(localStorage.getItem("fitpulse-exp") || "0") : 0;
        set({
          user: null,
          settings: { ...DEFAULT_SETTINGS, gender: localGender, enableRpeRir: localEnableRpeRir },
          routines: [],
          history: [],
          personalRecords: {},
          userLevel: localLevel,
          userExp: localExp,
          isLoading: false,
        });

        // Redirigir a login si no está allí
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return;
      }

      const userId = userSession.user.id;

      try {
        // 2. Cargar Perfil de Supabase en paralelo
        const [profileRes, routinesRes, historyRes, recordsRes] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .maybeSingle(),
            supabase.from("routines").select("*").eq("user_id", userId),
            supabase
              .from("workouts_history")
              .select("*")
              .eq("user_id", userId)
              .order("end_time", { ascending: false }),
            supabase.from("personal_records").select("*").eq("user_id", userId),
          ]);

        if (profileRes.error) throw profileRes.error;
        if (routinesRes.error) throw routinesRes.error;
        if (historyRes.error) throw historyRes.error;
        if (recordsRes.error) throw recordsRes.error;

        // Mapear Perfil & Ajustes
        let settings = DEFAULT_SETTINGS;
        let profileData = profileRes.data;

        // Esperar un momento por el trigger si acaba de registrarse
        if (!profileData) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const retryProfile = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();
          if (retryProfile.data) {
            profileData = retryProfile.data;
          }
        }

        if (profileData) {
          const rawTheme = profileData.theme || "lime";
          const isLight = rawTheme.endsWith("-light");
          const isAmoled = rawTheme.endsWith("-amoled");
          let activeTheme = rawTheme;
          let themeMode = "dark";
          if (isLight) {
            activeTheme = rawTheme.replace("-light", "");
            themeMode = "light";
          } else if (isAmoled) {
            activeTheme = rawTheme.replace("-amoled", "");
            themeMode = "amoled";
          }
          const localGender = typeof window !== "undefined" ? localStorage.getItem("fitpulse-gender") || "male" : "male";
          const localEnableRpeRir = typeof window !== "undefined" ? localStorage.getItem("fitpulse-enable-rpe-rir") === "true" : false;

          settings = {
            theme: activeTheme,
            themeMode: themeMode,
            restDuration: profileData.rest_duration ?? 90,
            weightUnit: profileData.weight_unit || "kg",
            weightIncrement: profileData.weight_increment ?? 2.5,
            weeklyGoal: profileData.weekly_goal ?? 4,
            defaultSets: profileData.default_sets ?? 3,
            defaultReps: profileData.default_reps ?? 12,
            defaultDuration: profileData.default_duration ?? 30,
            gender: localGender,
            enableRpeRir: localEnableRpeRir,
          };
        }

        // Mapear Rutinas
        let routines = routinesRes.data || [];
        if (routines.length === 0) {
          // Si el usuario no tiene rutinas, sembramos las por defecto en Supabase
          const seededRoutines = DEFAULT_ROUTINES.map((r) => ({
            id: r.id,
            user_id: userId,
            name: r.name,
            emoji: r.emoji,
            color: r.color,
            exercises: r.exercises,
          }));

          const { error: seedError } = await supabase
            .from("routines")
            .insert(seededRoutines);
          if (!seedError) {
            routines = seededRoutines;
          }
        }

        // Mapear Historial
        const history = (historyRes.data || []).map((w) => ({
          id: w.id,
          routineId: w.routine_id,
          name: w.name,
          emoji: w.emoji,
          color: w.color,
          startTime: Number(w.start_time),
          endTime: Number(w.end_time),
          exercises: w.exercises,
        }));

        // Mapear Records Personales
        const personalRecords = {};
        (recordsRes.data || []).forEach((r) => {
          personalRecords[r.exercise_id] = {
            maxWeight: r.max_weight,
            maxWeightDate: Number(r.max_weight_date),
            maxVolume: r.max_volume,
            maxVolumeDate: Number(r.max_volume_date),
            exerciseName: r.exercise_name,
          };
        });

        // Cargar nivel y exp desde user_metadata o localstorage
        const metaLevel = Number(userSession.user.user_metadata?.level ?? (typeof window !== "undefined" ? localStorage.getItem("fitpulse-level") : null) ?? "1");
        const metaExp = Number(userSession.user.user_metadata?.exp ?? (typeof window !== "undefined" ? localStorage.getItem("fitpulse-exp") : null) ?? "0");

        // Cargar en el estado local de Zustand
        set({
          user: {
            id: userId,
            name:
              profileData?.name ||
              userSession.user.user_metadata?.full_name ||
              userSession.user.user_metadata?.name ||
              "Atleta",
            email: userSession.user.email,
            picture:
              profileData?.picture ||
              userSession.user.user_metadata?.avatar_url ||
              "",
          },
          settings,
          routines,
          history,
          personalRecords,
          userLevel: metaLevel,
          userExp: metaExp,
          isLoading: false,
        });

        // Redirigir a Home si está logueado e intentó entrar a /login
        if (window.location.pathname === "/login") {
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Error al inicializar sesión en Supabase:", err);
        set({ isLoading: false });
      }
    };

    // Inicializar con la sesión actual
    await handleUserSession(session);

    // Escuchar cambios de Auth
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === "SIGNED_IN") {
        await handleUserSession(newSession);
      } else if (event === "SIGNED_OUT") {
        await handleUserSession(null);
      }
    });
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
  },

  // ===== ACCIONES DE AJUSTES =====
  updateSettings: async (newSettings) => {
    if (typeof window !== "undefined" && newSettings.gender !== undefined) {
      localStorage.setItem("fitpulse-gender", newSettings.gender);
    }
    if (typeof window !== "undefined" && newSettings.enableRpeRir !== undefined) {
      localStorage.setItem("fitpulse-enable-rpe-rir", String(newSettings.enableRpeRir));
    }

    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));

    const user = get().user;
    if (user) {
      const dbSettings = {};

      // Mapear theme y themeMode en la columna theme de la DB
      if (
        newSettings.theme !== undefined ||
        newSettings.themeMode !== undefined
      ) {
        const currentTheme =
          newSettings.theme !== undefined
            ? newSettings.theme
            : get().settings.theme;
        const currentMode =
          newSettings.themeMode !== undefined
            ? newSettings.themeMode
            : get().settings.themeMode;
        
        if (currentMode === "light") {
          dbSettings.theme = `${currentTheme}-light`;
        } else if (currentMode === "amoled") {
          dbSettings.theme = `${currentTheme}-amoled`;
        } else {
          dbSettings.theme = currentTheme;
        }
      }

      if (newSettings.restDuration !== undefined)
        dbSettings.rest_duration = newSettings.restDuration;
      if (newSettings.weightUnit !== undefined)
        dbSettings.weight_unit = newSettings.weightUnit;
      if (newSettings.weightIncrement !== undefined)
        dbSettings.weight_increment = newSettings.weightIncrement;
      if (newSettings.weeklyGoal !== undefined)
        dbSettings.weekly_goal = newSettings.weeklyGoal;
      if (newSettings.defaultSets !== undefined)
        dbSettings.default_sets = newSettings.defaultSets;
      if (newSettings.defaultReps !== undefined)
        dbSettings.default_reps = newSettings.defaultReps;
      if (newSettings.defaultDuration !== undefined)
        dbSettings.default_duration = newSettings.defaultDuration;

      if (Object.keys(dbSettings).length > 0) {
        await supabase.from("profiles").update(dbSettings).eq("id", user.id);
      }
    }
  },

  addExp: async (amount) => {
    const currentExp = get().userExp;
    const currentLevel = get().userLevel;
    let newExp = currentExp + amount;
    let newLevel = currentLevel;

    // EXP necesaria para el siguiente nivel: level * 100
    while (newExp >= newLevel * 100) {
      newExp -= newLevel * 100;
      newLevel++;
      set({ justLeveledUp: true });
      setTimeout(() => set({ justLeveledUp: false }), 4000);
    }

    set({ userLevel: newLevel, userExp: newExp });

    if (typeof window !== "undefined") {
      localStorage.setItem("fitpulse-level", String(newLevel));
      localStorage.setItem("fitpulse-exp", String(newExp));
    }

    const user = get().user;
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { level: newLevel, exp: newExp }
        });
      } catch (err) {
        console.error("Error al actualizar metadatos de usuario (EXP/Level):", err);
      }
    }
  },

  // ===== ACCIONES DE RUTINAS =====
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

  // ===== ACCIONES DE ENTRENAMIENTO ACTIVO =====
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
      sessionStorage.setItem("fitpulse-active-workout", JSON.stringify(newWorkout));
      sessionStorage.setItem("fitpulse-active-exercise-index", "0");
    }
  },

  nextExercise: () =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const maxIdx = state.activeWorkout.exercises.length - 1;
      const newIdx = Math.min(state.currentExerciseIndex + 1, maxIdx);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("fitpulse-active-exercise-index", String(newIdx));
      }
      return { currentExerciseIndex: newIdx };
    }),

  prevExercise: () =>
    set((state) => {
      const newIdx = Math.max(state.currentExerciseIndex - 1, 0);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("fitpulse-active-exercise-index", String(newIdx));
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
      let exMaxWeight = null;
      let exMaxVolume = null;

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
              exMaxWeight = w;
              isNewMaxWeight = true;
            }
            if (!current || vol > (current.maxVolume || 0)) {
              newPRs[ex.id] = {
                ...newPRs[ex.id],
                maxVolume: vol,
                maxVolumeDate: endTime,
                exerciseName: ex.name,
              };
              exMaxVolume = vol;
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

    // Guardar el entreno en Supabase
    const { data: dbWorkout, error: workoutError } = await supabase
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

    if (workoutError) {
      console.error("Error saving workout history:", workoutError);
    } else if (dbWorkout) {
      workout.id = dbWorkout.id;
    }

    // Guardar PRs en Supabase si hay alguno
    if (prsToUpsert.length > 0) {
      const { error: prsError } = await supabase
        .from("personal_records")
        .upsert(prsToUpsert);
      if (prsError) console.error("Error saving personal records:", prsError);
    }

    // Calcular EXP y otorgarla
    const earnedExp = 150 + (completedSetsCount * 10) + (prsBeaten * 50);
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

  // ===== ACCIONES DEL HISTORIAL =====
  deleteHistoryEntry: async (index) => {
    const workoutToDelete = get().history[index];
    if (workoutToDelete && workoutToDelete.id) {
      set((state) => ({
        history: state.history.filter((_, i) => i !== index),
      }));
      await supabase
        .from("workouts_history")
        .delete()
        .eq("id", workoutToDelete.id);
    }
  },

  clearHistory: async () => {
    const user = get().user;
    if (user) {
      set({ history: [] });
      await supabase.from("workouts_history").delete().eq("user_id", user.id);
    }
  },

  // ===== BODY METRICS =====
  addBodyMetric: (metric) => {
    const newMetric = {
      id: `metric-${Date.now()}`,
      date: Date.now(),
      ...metric,
    };
    set((state) => {
      const updated = [newMetric, ...state.bodyMetrics].sort((a, b) => b.date - a.date);
      if (typeof window !== "undefined") {
        localStorage.setItem("fitpulse-body-metrics", JSON.stringify(updated));
      }
      return { bodyMetrics: updated };
    });
  },

  deleteBodyMetric: (id) => {
    set((state) => {
      const updated = state.bodyMetrics.filter((m) => m.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("fitpulse-body-metrics", JSON.stringify(updated));
      }
      return { bodyMetrics: updated };
    });
  },
}));
