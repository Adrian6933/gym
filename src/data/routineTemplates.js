// Plantillas de rutinas prediseñadas (basadas en EXERCISE_DB por id)
import { EXERCISE_DB } from "./exercises";

const byId = Object.fromEntries(EXERCISE_DB.map((e) => [e.id, e]));

function buildExercises(entries) {
  return entries
    .filter(([id]) => byId[id])
    .map(([id, targetSets, targetRepsOrDuration]) => {
      const base = byId[id];
      return base.type === "time"
        ? { ...base, targetSets, targetDuration: targetRepsOrDuration || 30 }
        : { ...base, targetSets, targetReps: targetRepsOrDuration };
    });
}

export const ROUTINE_TEMPLATES = [
  {
    name: "Empuje (Push)",
    emoji: "💪",
    color: "#84cc16",
    exercises: buildExercises([
      ["chest-1", 4, 8],
      ["chest-2", 3, 10],
      ["shoulder-1", 3, 10],
      ["shoulder-2", 3, 12],
      ["tricep-1", 3, 12],
      ["tricep-2", 3, 12],
    ]),
  },
  {
    name: "Tirón (Pull)",
    emoji: "🔥",
    color: "#06b6d4",
    exercises: buildExercises([
      ["back-5", 4, 6],
      ["back-1", 4, 8],
      ["back-2", 3, 10],
      ["back-3", 3, 10],
      ["bicep-1", 3, 12],
      ["bicep-2", 3, 12],
    ]),
  },
  {
    name: "Pierna (Legs)",
    emoji: "🦵",
    color: "#f59e0b",
    exercises: buildExercises([
      ["leg-1", 4, 8],
      ["leg-2", 3, 12],
      ["leg-3", 3, 12],
      ["leg-4", 3, 12],
      ["leg-6", 3, 10],
      ["leg-7", 4, 15],
    ]),
  },
  {
    name: "Torso (Upper Body)",
    emoji: "⚡",
    color: "#a855f7",
    exercises: buildExercises([
      ["chest-1", 4, 8],
      ["back-2", 4, 8],
      ["shoulder-1", 3, 10],
      ["back-1", 3, 8],
      ["bicep-1", 3, 12],
      ["tricep-1", 3, 12],
    ]),
  },
  {
    name: "Piernas y Core (Lower Body)",
    emoji: "🎯",
    color: "#10b981",
    exercises: buildExercises([
      ["leg-1", 4, 8],
      ["leg-5", 3, 10],
      ["leg-4", 3, 12],
      ["leg-6", 3, 10],
      ["core-1", 3, 15],
      ["core-2", 3, 45],
    ]),
  },
  {
    name: "Cuerpo Completo (Full Body)",
    emoji: "🚀",
    color: "#f43f5e",
    exercises: buildExercises([
      ["leg-1", 3, 8],
      ["chest-1", 3, 8],
      ["back-2", 3, 8],
      ["shoulder-1", 3, 10],
      ["core-1", 3, 15],
    ]),
  },
  {
    name: "5x5 Fuerza",
    emoji: "💎",
    color: "#f97316",
    exercises: buildExercises([
      ["leg-1", 5, 5],
      ["chest-1", 5, 5],
      ["back-2", 5, 5],
      ["shoulder-1", 5, 5],
      ["back-5", 5, 5],
    ]),
  },
];
