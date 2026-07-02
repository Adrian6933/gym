// Sistema de Logros / Badges de FitPulse
// Cada logro define una función `check(ctx)` que recibe el contexto del usuario
// y devuelve true cuando se ha desbloqueado.

export const ACHIEVEMENTS = [
  // === Primeros pasos ===
  {
    id: "first-workout",
    name: "Primer Paso",
    desc: "Completa tu primer entrenamiento",
    icon: "👟",
    tier: "bronze",
    check: ({ history }) => history.length >= 1,
  },
  {
    id: "first-pr",
    name: "Marca Personal",
    desc: "Bate tu primer récord personal",
    icon: "🏆",
    tier: "bronze",
    check: ({ personalRecords }) =>
      Object.keys(personalRecords || {}).length >= 1,
  },
  {
    id: "create-routine",
    name: "Arquitecto",
    desc: "Crea tu primera rutina personalizada",
    icon: "📐",
    tier: "bronze",
    check: ({ routines }) =>
      (routines || []).some((r) => !String(r.id).startsWith("default-")),
  },

  // === Rachas ===
  {
    id: "streak-3",
    name: "En Marcha",
    desc: "Mantén una racha de 3 días",
    icon: "🔥",
    tier: "bronze",
    check: ({ streak }) => streak >= 3,
  },
  {
    id: "streak-7",
    name: "Semana Perfecta",
    desc: "Mantén una racha de 7 días",
    icon: "⚡",
    tier: "silver",
    check: ({ streak }) => streak >= 7,
  },
  {
    id: "streak-30",
    name: "Imparable",
    desc: "Mantén una racha de 30 días",
    icon: "💎",
    tier: "gold",
    check: ({ streak, recordStreak }) => Math.max(streak, recordStreak) >= 30,
  },

  // === Volumen ===
  {
    id: "volume-10k",
    name: "Levantador",
    desc: "Acumula 10.000 kg de volumen",
    icon: "💪",
    tier: "bronze",
    check: ({ totalVolume }) => totalVolume >= 10000,
  },
  {
    id: "volume-100k",
    name: "Forjado en Acero",
    desc: "Acumula 100.000 kg de volumen",
    icon: "🦾",
    tier: "silver",
    check: ({ totalVolume }) => totalVolume >= 100000,
  },
  {
    id: "volume-1m",
    name: "Titán",
    desc: "Acumula 1.000.000 kg de volumen",
    icon: "🏔️",
    tier: "gold",
    check: ({ totalVolume }) => totalVolume >= 1000000,
  },

  // === Series y Entrenamientos ===
  {
    id: "workouts-10",
    name: "Constante",
    desc: "Completa 10 entrenamientos",
    icon: "📅",
    tier: "silver",
    check: ({ history }) => history.length >= 10,
  },
  {
    id: "workouts-50",
    name: "Veterano",
    desc: "Completa 50 entrenamientos",
    icon: "🎖️",
    tier: "gold",
    check: ({ history }) => history.length >= 50,
  },
  {
    id: "workouts-100",
    name: "Leyenda",
    desc: "Completa 100 entrenamientos",
    icon: "👑",
    tier: "legend",
    check: ({ history }) => history.length >= 100,
  },

  // === Nivel ===
  {
    id: "level-5",
    name: "Iniciado",
    desc: "Alcanza el nivel 5",
    icon: "⭐",
    tier: "bronze",
    check: ({ userLevel }) => userLevel >= 5,
  },
  {
    id: "level-10",
    name: "Guerrero",
    desc: "Alcanza el nivel 10",
    icon: "🌟",
    tier: "silver",
    check: ({ userLevel }) => userLevel >= 10,
  },
  {
    id: "level-25",
    name: "Bestia",
    desc: "Alcanza el nivel 25",
    icon: "🐺",
    tier: "gold",
    check: ({ userLevel }) => userLevel >= 25,
  },

  // === Consistencia semanal ===
  {
    id: "goal-week",
    name: "Cumplidor",
    desc: "Alcanza tu meta semanal",
    icon: "🎯",
    tier: "bronze",
    check: ({ weeklyWorkouts, weeklyGoal }) =>
      weeklyGoal > 0 && weeklyWorkouts >= weeklyGoal,
  },
];

// Colores de rareza por nivel de logro
export const TIER_STYLES = {
  bronze: {
    glow: "rgba(205, 127, 50, 0.35)",
    border: "rgba(205, 127, 50, 0.4)",
    bg: "rgba(205, 127, 50, 0.08)",
    label: "Bronce",
    text: "text-amber-600",
  },
  silver: {
    glow: "rgba(192, 192, 200, 0.35)",
    border: "rgba(192, 192, 200, 0.4)",
    bg: "rgba(192, 192, 200, 0.08)",
    label: "Plata",
    text: "text-slate-300",
  },
  gold: {
    glow: "rgba(250, 204, 21, 0.4)",
    border: "rgba(250, 204, 21, 0.45)",
    bg: "rgba(250, 204, 21, 0.1)",
    label: "Oro",
    text: "text-yellow-500",
  },
  legend: {
    glow: "rgba(168, 85, 247, 0.45)",
    border: "rgba(168, 85, 247, 0.5)",
    bg: "rgba(168, 85, 247, 0.12)",
    label: "Leyenda",
    text: "text-purple-400",
  },
};

// Evalúa qué logros están desbloqueados dado un contexto
export const evaluateAchievements = (ctx) => {
  return ACHIEVEMENTS.map((a) => {
    let unlocked = false;
    try {
      unlocked = a.check(ctx);
    } catch {
      unlocked = false;
    }
    return { ...a, unlocked };
  });
};

// Calcula el volumen total acumulado del historial
export const calculateTotalVolume = (history) => {
  if (!history) return 0;
  return history.reduce((acc, w) => {
    if (!w.exercises) return acc;
    return (
      acc +
      w.exercises.reduce((exAcc, ex) => {
        if (!ex.sets) return exAcc;
        return (
          exAcc +
          ex.sets.reduce((sAcc, s) => {
            if (s.completed && s.weight && s.reps) {
              return sAcc + parseFloat(s.weight) * parseInt(s.reps);
            }
            return sAcc;
          }, 0)
        );
      }, 0)
    );
  }, 0);
};
