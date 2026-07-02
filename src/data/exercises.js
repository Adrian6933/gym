// Base de datos de ejercicios con iconos SVG descriptivos
// type: 'reps' = por repeticiones | 'time' = por tiempo (segundos)

export const EXERCISE_DB = [
  // === PECHO ===
  {
    id: "chest-1",
    name: "Press de Banca",
    muscle: "Pecho",
    type: "reps",
    icon: "M4 18h2v-2H4v2zm0-4h4v-2H4v2zm8 4h4v-2h-4v2zm-4-4h8v-2H8v2zm8 4h4v-2h-4v2zM2 12h20M2 12V8h3v4m0 0v4H2m20-4V8h-3v4m0 0v4h3",
  },
  {
    id: "chest-2",
    name: "Press Inclinado Mancuernas",
    muscle: "Pecho",
    type: "reps",
    icon: "M7 17l3-8m4 8l3-8M6 20h2M14 20h2M8 9h2m4 0h2",
  },
  {
    id: "chest-3",
    name: "Aperturas con Mancuernas",
    muscle: "Pecho",
    type: "reps",
    icon: "M5 12c0-3 2-5 7-5s7 2 7 5M8 7v4m8-4v4M6 14h12",
  },
  {
    id: "chest-4",
    name: "Fondos en Paralelas",
    muscle: "Pecho",
    type: "reps",
    icon: "M8 4v16M16 4v16M8 8h-3M16 8h3M10 12h4",
  },
  {
    id: "chest-5",
    name: "Press Declinado",
    muscle: "Pecho",
    type: "reps",
    icon: "M2 14h20M4 14V10h3v4m10 0V10h3v4M9 14v4m6-4v4",
  },

  // === ESPALDA ===
  {
    id: "back-1",
    name: "Dominadas",
    muscle: "Espalda",
    type: "reps",
    icon: "M4 4h16M8 4v4c0 2 1 4 4 4s4-2 4-4V4M12 12v6m-3 2h6",
  },
  {
    id: "back-2",
    name: "Remo con Barra",
    muscle: "Espalda",
    type: "reps",
    icon: "M4 16l4-8 4 4 4-4 4 8M2 16h20M8 16v3m8-3v3",
  },
  {
    id: "back-3",
    name: "Jalón al Pecho",
    muscle: "Espalda",
    type: "reps",
    icon: "M4 2h16M12 2v6M8 8l4 4 4-4M8 14h8M12 14v6",
  },
  {
    id: "back-4",
    name: "Remo con Mancuerna",
    muscle: "Espalda",
    type: "reps",
    icon: "M6 18V8l6-4v14M18 10v4h-4",
  },
  {
    id: "back-5",
    name: "Peso Muerto",
    muscle: "Espalda",
    type: "reps",
    icon: "M2 18h20M6 18v-6l6-6 6 6v6M10 12h4",
  },

  // === HOMBRO ===
  {
    id: "shoulder-1",
    name: "Press Militar",
    muscle: "Hombro",
    type: "reps",
    icon: "M12 20v-8m0 0l-4 4m4-4l4 4M6 8h12M6 8V6h2v2m8 0V6h2v2",
  },
  {
    id: "shoulder-2",
    name: "Elevaciones Laterales",
    muscle: "Hombro",
    type: "reps",
    icon: "M12 8v10M12 8l-6 6M12 8l6 6M9 20h6M10 6a2 2 0 104 0",
  },
  {
    id: "shoulder-3",
    name: "Elevaciones Frontales",
    muscle: "Hombro",
    type: "reps",
    icon: "M12 8v10m-3 2h6M12 8l-4-4M12 8l4-4M10 6a2 2 0 104 0",
  },
  {
    id: "shoulder-4",
    name: "Pájaros (Rear Delt Fly)",
    muscle: "Hombro",
    type: "reps",
    icon: "M12 10v8M6 10c0-2 3-4 6-4s6 2 6 4M6 10l-2 4m16-4l2 4",
  },

  // === BÍCEPS ===
  {
    id: "bicep-1",
    name: "Curl de Bíceps con Barra",
    muscle: "Bíceps",
    type: "reps",
    icon: "M4 16h16M8 16v-6a4 4 0 018 0v6M10 10h4",
  },
  {
    id: "bicep-2",
    name: "Curl Martillo",
    muscle: "Bíceps",
    type: "reps",
    icon: "M10 18v-8l-2-4M14 18v-8l2-4M8 6h2m4 0h2",
  },
  {
    id: "bicep-3",
    name: "Curl Inclinado",
    muscle: "Bíceps",
    type: "reps",
    icon: "M6 20l4-12 2 4 2-4 4 12M10 8a2 2 0 104 0",
  },
  {
    id: "bicep-4",
    name: "Curl Concentrado",
    muscle: "Bíceps",
    type: "reps",
    icon: "M8 20v-6l4-6 4 6v6M10 14h4M12 8V6",
  },

  // === TRÍCEPS ===
  {
    id: "tricep-1",
    name: "Extensión Tríceps Polea",
    muscle: "Tríceps",
    type: "reps",
    icon: "M12 4v8M8 12l4 4 4-4M8 18h8M12 16v4",
  },
  {
    id: "tricep-2",
    name: "Press Francés",
    muscle: "Tríceps",
    type: "reps",
    icon: "M4 10h16M8 10V6h8v4M12 10v8M8 18h8",
  },
  {
    id: "tricep-3",
    name: "Fondos en Banco",
    muscle: "Tríceps",
    type: "reps",
    icon: "M4 8h6m4 0h6M10 8v10M14 8v10M6 18h4m4 0h4",
  },
  {
    id: "tricep-4",
    name: "Patada de Tríceps",
    muscle: "Tríceps",
    type: "reps",
    icon: "M6 12h6l4-4M6 12v6m6-6v6M16 8l2-2",
  },

  // === PIERNA ===
  {
    id: "leg-1",
    name: "Sentadilla Libre",
    muscle: "Pierna",
    type: "reps",
    icon: "M12 4v4M8 8h8M8 8l-2 8h2l4-4 4 4h2l-2-8",
  },
  {
    id: "leg-2",
    name: "Prensa de Piernas",
    muscle: "Pierna",
    type: "reps",
    icon: "M4 18h16l-4-12H8L4 18zM8 12h8",
  },
  {
    id: "leg-3",
    name: "Extensión de Cuádriceps",
    muscle: "Pierna",
    type: "reps",
    icon: "M8 6v8l4 4 4-4V6M10 14h4M12 18v2",
  },
  {
    id: "leg-4",
    name: "Curl Femoral",
    muscle: "Pierna",
    type: "reps",
    icon: "M8 4v6l4 4 4-4V4M8 14v6m8-6v6",
  },
  {
    id: "leg-5",
    name: "Zancadas",
    muscle: "Pierna",
    type: "reps",
    icon: "M8 4v6l-4 10M16 4v6l4 10M10 10h4",
  },
  {
    id: "leg-6",
    name: "Hip Thrust",
    muscle: "Pierna",
    type: "reps",
    icon: "M2 16h20M6 16v-4l6-4 6 4v4M12 8V6",
  },
  {
    id: "leg-7",
    name: "Elevación de Gemelos",
    muscle: "Pierna",
    type: "reps",
    icon: "M8 4v12M16 4v12M8 16c0 2 2 4 4 4s4-2 4-4",
  },

  // === CORE ===
  {
    id: "core-1",
    name: "Crunch Abdominal",
    muscle: "Core",
    type: "reps",
    icon: "M6 18c0-4 2-6 6-6s6 2 6 6M8 12l4-6 4 6",
  },
  {
    id: "core-2",
    name: "Plancha",
    muscle: "Core",
    type: "time",
    icon: "M2 14h20M4 14l2-6h12l2 6",
  },
  {
    id: "core-3",
    name: "Russian Twist",
    muscle: "Core",
    type: "reps",
    icon: "M12 8v8M8 12h8M6 16l6-8 6 8",
  },
  {
    id: "core-4",
    name: "Elevación de Piernas",
    muscle: "Core",
    type: "reps",
    icon: "M12 4v8M12 12l-4 6m4-6l4 6M10 4h4",
  },
  {
    id: "core-5",
    name: "Plancha Lateral",
    muscle: "Core",
    type: "time",
    icon: "M4 18l8-4 8 4M12 14V6",
  },
  {
    id: "core-6",
    name: "Mountain Climbers",
    muscle: "Core",
    type: "time",
    icon: "M4 16l4-8 4 4 4-4 4 8",
  },

  // === CARDIO ===
  {
    id: "cardio-1",
    name: "Cinta de Correr",
    muscle: "Cardio",
    type: "time",
    icon: "M2 18h20M6 18V10l4-4 4 4 4-4v8",
  },
  {
    id: "cardio-2",
    name: "Bicicleta Estática",
    muscle: "Cardio",
    type: "time",
    icon: "M8 18a4 4 0 110-8 4 4 0 010 8zm8 0a4 4 0 110-8 4 4 0 010 8zM8 14l4-8h4",
  },
  {
    id: "cardio-3",
    name: "Saltos de Cuerda",
    muscle: "Cardio",
    type: "time",
    icon: "M8 4c-2 4-2 8 0 12m8-12c2 4 2 8 0 12M12 4v16",
  },
];

export const MUSCLE_GROUPS = [
  "Todos",
  "Pecho",
  "Espalda",
  "Hombro",
  "Bíceps",
  "Tríceps",
  "Pierna",
  "Core",
  "Cardio",
];

export const MUSCLE_EMOJIS = {
  Pecho: "🫁",
  Espalda: "🔙",
  Hombro: "💪",
  Bíceps: "💪",
  Tríceps: "💪",
  Pierna: "🦵",
  Core: "🎯",
  Cardio: "❤️‍🔥",
};

export const MUSCLE_COLORS = {
  Pecho: "#ef4444",
  Espalda: "#3b82f6",
  Hombro: "#f59e0b",
  Bíceps: "#8b5cf6",
  Tríceps: "#ec4899",
  Pierna: "#06b6d4",
  Core: "#10b981",
  Cardio: "#f97316",
};

export const MUSCLE_IMAGES = {
  Pecho: "/images/muscles/chest.png",
  Espalda: "/images/muscles/back.png",
  Hombro: "/images/muscles/shoulders.png",
  Bíceps: "/images/muscles/arms.png",
  Tríceps: "/images/muscles/arms.png",
  Pierna: "/images/muscles/legs.png",
  Core: "/images/muscles/core.png",
  Cardio: "/images/muscles/cardio.png",
};
