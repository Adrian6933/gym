import { supabase } from "../../db/supabase";
import { DEFAULT_SETTINGS, DEFAULT_ROUTINES } from "../defaults";
import { useToastStore } from "../../components/Toast";

// Evita inicializar la sesión (y suscribirse a onAuthStateChange) más de
// una vez por carga de página aunque varios componentes lo soliciten.
let sessionInitStarted = false;

// ===== INICIALIZACIÓN, AUTH, AJUSTES Y NIVEL/EXP =====
export const createSessionSlice = (set, get) => ({
  user: null, // { id, name, email, picture }
  settings: DEFAULT_SETTINGS,
  isLoading: true, // Para mostrar la pantalla de carga al iniciar
  weeklySchedule:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("fitpulse-weekly-schedule") || "{}")
      : {},
  userLevel: 1,
  userExp: 0,
  justLeveledUp: false,
  lastWorkoutExpEarned: 0,
  activeTab: "home",

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
      localStorage.setItem(
        "fitpulse-weekly-schedule",
        JSON.stringify(updated),
      );
    }
    set({ weeklySchedule: updated });
  },

  initializeSession: async () => {
    // Idempotente: puede montarse más de un componente que la invoque
    // (layout + shell); solo la primera llamada hace el trabajo. Un full
    // page load reinicia el módulo, así que tras login/logout se re-ejecuta.
    if (sessionInitStarted) return;
    sessionInitStarted = true;

    set({ isLoading: true });

    // 1. Obtener sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const handleUserSession = async (userSession) => {
      if (!userSession) {
        const localGender =
          typeof window !== "undefined"
            ? localStorage.getItem("fitpulse-gender") || "male"
            : "male";
        const localEnableRpeRir =
          typeof window !== "undefined"
            ? localStorage.getItem("fitpulse-enable-rpe-rir") === "true"
            : false;
        const localLevel =
          typeof window !== "undefined"
            ? Number(localStorage.getItem("fitpulse-level") || "1")
            : 1;
        const localExp =
          typeof window !== "undefined"
            ? Number(localStorage.getItem("fitpulse-exp") || "0")
            : 0;

        // Limpiar el entreno activo del usuario anterior: en un dispositivo
        // compartido, el siguiente que inicie sesión no debe ver ni heredar
        // el entreno en curso de otra cuenta.
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("fitpulse-active-workout");
          sessionStorage.removeItem("fitpulse-active-exercise-index");
        }

        set({
          user: null,
          settings: {
            ...DEFAULT_SETTINGS,
            gender: localGender,
            enableRpeRir: localEnableRpeRir,
          },
          routines: [],
          history: [],
          personalRecords: {},
          userLevel: localLevel,
          userExp: localExp,
          activeWorkout: null,
          currentExerciseIndex: 0,
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
            supabase
              .from("personal_records")
              .select("*")
              .eq("user_id", userId),
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
          const localGender =
            typeof window !== "undefined"
              ? localStorage.getItem("fitpulse-gender") || "male"
              : "male";
          const localEnableRpeRir =
            typeof window !== "undefined"
              ? localStorage.getItem("fitpulse-enable-rpe-rir") === "true"
              : false;

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
        const metaLevel = Number(
          userSession.user.user_metadata?.level ??
            (typeof window !== "undefined"
              ? localStorage.getItem("fitpulse-level")
              : null) ??
            "1",
        );
        const metaExp = Number(
          userSession.user.user_metadata?.exp ??
            (typeof window !== "undefined"
              ? localStorage.getItem("fitpulse-exp")
              : null) ??
            "0",
        );

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
        useToastStore.getState().addToast({
          type: "info",
          title: "No se pudo cargar tus datos",
          message: "Revisa tu conexión e intenta recargar la app.",
          duration: 5000,
        });
      }
    };

    // Inicializar con la sesión actual
    await handleUserSession(session);

    // Escuchar cambios de Auth
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === "SIGNED_IN") {
        // SIGNED_IN también se emite al refrescar token o volver a la
        // pestaña; si ya tenemos cargado a ese mismo usuario, no
        // re-descargamos todos sus datos.
        if (get().user?.id === newSession?.user?.id) return;
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
    if (
      typeof window !== "undefined" &&
      newSettings.enableRpeRir !== undefined
    ) {
      localStorage.setItem(
        "fitpulse-enable-rpe-rir",
        String(newSettings.enableRpeRir),
      );
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
          data: { level: newLevel, exp: newExp },
        });
      } catch (err) {
        console.error(
          "Error al actualizar metadatos de usuario (EXP/Level):",
          err,
        );
      }
    }
  },
});