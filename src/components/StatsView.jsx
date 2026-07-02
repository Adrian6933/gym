import React, { useState } from "react";
import { useGymStore } from "../store/useGymStore";
import {
  Trophy,
  Flame,
  Clock,
  Dumbbell,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Ruler,
} from "lucide-react";
import BottomNav from "./BottomNav";
import BodyMetrics from "./BodyMetrics";

// Helper para calcular la matriz de 7x53 estilo GitHub
const getYearlyContributionData = (history) => {
  const today = new Date();
  const dateMap = {};

  history.forEach((w) => {
    const date = new Date(w.endTime || w.startTime);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
  });

  // Fecha de inicio: Lunes de hace 52 semanas
  const startOfGrid = new Date(today);
  startOfGrid.setDate(today.getDate() - 364);
  const dayNum = startOfGrid.getDay();
  const daysToMonday = dayNum === 0 ? 6 : dayNum - 1;
  startOfGrid.setDate(startOfGrid.getDate() - daysToMonday);
  startOfGrid.setHours(0, 0, 0, 0);

  const grid = Array.from({ length: 7 }, () => []);
  const current = new Date(startOfGrid);

  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
      const count = dateMap[dateStr] || 0;
      const isFuture = current > today;

      grid[d].push({
        dateStr,
        count,
        isFuture,
      });

      current.setDate(current.getDate() + 1);
    }
  }
  return grid;
};

const SilhouetteView = ({ gender, view, getMuscleState, showHeatmap }) => {
  const isFemale = gender === "female";
  const isFront = view === "front";
  const baseFill = "rgba(255, 255, 255, 0.06)";
  const baseStroke = "rgba(255, 255, 255, 0.1)";
  const bsw = "0.5";
  const rp = (d, k) => {
    if (showHeatmap) {
      const rk = k === "Glúteo" ? "Pierna" : k;
      const state = getMuscleState(rk);
      if (state.level === "none") return null;
      return (
        <path
          d={d}
          fill={state.color}
          fillOpacity={state.opacity}
          stroke="var(--bg-color)"
          strokeWidth="3"
          strokeOpacity={1}
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
      );
    }
    return <path d={d} fill={baseFill} stroke={baseStroke} strokeWidth={bsw} />;
  };
  return (
    <>
      {/* Cabeza + Cuello */}
      {!showHeatmap && (
        <>
          <ellipse cx="60" cy={isFemale ? 18 : 17} rx={isFemale ? 7.5 : 8} ry={isFemale ? 8.5 : 9} fill={baseFill} stroke={baseStroke} strokeWidth={bsw} />
          {isFemale && <path d="M 52.5 18 C 52 10, 55 8, 60 7 C 65 8, 68 10, 67.5 18" fill="none" stroke={baseStroke} strokeWidth={bsw} />}
          <path d={isFemale ? "M 57 26 C 57 29, 57 32, 56.5 34 L 63.5 34 C 63 32, 63 29, 63 26" : "M 56 26 C 56 29, 55.5 31, 55 34 L 65 34 C 64.5 31, 64 29, 64 26"} fill={baseFill} stroke={baseStroke} strokeWidth={bsw} />
        </>
      )}
      {/* Hombros */}
      {rp(isFemale ? "M 56 34 C 52 34, 46 35, 42 38 C 39 40, 38 44, 40 47 C 42 49, 45 48, 46 46 C 47 42, 50 38, 54 36 Z" : "M 55 34 C 48 34, 40 36, 34 40 C 31 43, 30 47, 33 50 C 36 52, 40 50, 41 47 C 43 43, 47 39, 52 36 Z", "Hombro")}
      {rp(isFemale ? "M 64 34 C 68 34, 74 35, 78 38 C 81 40, 82 44, 80 47 C 78 49, 75 48, 74 46 C 73 42, 70 38, 66 36 Z" : "M 65 34 C 72 34, 80 36, 86 40 C 89 43, 90 47, 87 50 C 84 52, 80 50, 79 47 C 77 43, 73 39, 68 36 Z", "Hombro")}
      {/* FRONTAL */}
      {isFront && (
        <>
          {/* Pectorales */}
          {rp(isFemale ? "M 59 36 C 55 36, 48 37, 46 40 C 44 44, 44 50, 47 54 C 50 57, 56 57, 59 54 Z" : "M 59 36 C 54 36, 44 38, 41 42 C 39 47, 40 54, 43 58 C 48 61, 55 61, 59 58 Z", "Pecho")}
          {rp(isFemale ? "M 61 36 C 65 36, 72 37, 74 40 C 76 44, 76 50, 73 54 C 70 57, 64 57, 61 54 Z" : "M 61 36 C 66 36, 76 38, 79 42 C 81 47, 80 54, 77 58 C 72 61, 65 61, 61 58 Z", "Pecho")}
          {/* Abs superiores */}
          {rp(isFemale ? "M 50 57 L 59 57 L 59 67 C 57 68, 52 68, 50 67 Z" : "M 46 60 L 59 60 L 59 72 C 56 73, 49 73, 46 72 Z", "Core")}
          {rp(isFemale ? "M 61 57 L 70 57 L 70 67 C 68 68, 63 68, 61 67 Z" : "M 61 60 L 74 60 L 74 72 C 71 73, 64 73, 61 72 Z", "Core")}
          {/* Abs medios */}
          {rp(isFemale ? "M 50 69 C 49 72, 48 76, 48 79 L 59 79 L 59 69 C 56 70, 52 70, 50 69 Z" : "M 46 74 C 45 78, 44 82, 44 86 L 59 86 L 59 74 C 54 75, 49 75, 46 74 Z", "Core")}
          {rp(isFemale ? "M 70 69 C 71 72, 72 76, 72 79 L 61 79 L 61 69 C 64 70, 68 70, 70 69 Z" : "M 74 74 C 75 78, 76 82, 76 86 L 61 86 L 61 74 C 66 75, 71 75, 74 74 Z", "Core")}
          {/* Abs bajos */}
          {rp(isFemale ? "M 48 79 C 47 84, 46 88, 46 92 C 48 94, 55 95, 59 94 L 59 79 Z" : "M 44 86 C 44 91, 44 96, 46 100 C 49 102, 55 102, 59 101 L 59 86 Z", "Core")}
          {rp(isFemale ? "M 72 79 C 73 84, 74 88, 74 92 C 72 94, 65 95, 61 94 L 61 79 Z" : "M 76 86 C 76 91, 76 96, 74 100 C 71 102, 65 102, 61 101 L 61 86 Z", "Core")}
          {/* Oblicuos */}
          {rp(isFemale ? "M 46 40 C 44 46, 44 54, 46 58 C 47 64, 46 72, 44 80 C 43 86, 44 90, 44 92 L 47 92 C 47 90, 47 86, 48 80 C 49 72, 50 64, 50 57 C 49 52, 48 46, 48 40 Z" : "M 41 42 C 39 50, 39 56, 41 62 C 42 70, 43 78, 43 86 C 43 92, 44 97, 46 100 L 43 100 C 41 97, 40 92, 40 86 C 39 78, 38 70, 37 62 C 36 56, 37 50, 39 42 Z", "Core")}
          {rp(isFemale ? "M 74 40 C 76 46, 76 54, 74 58 C 73 64, 74 72, 76 80 C 77 86, 76 90, 76 92 L 73 92 C 73 90, 73 86, 72 80 C 71 72, 70 64, 70 57 C 71 52, 72 46, 72 40 Z" : "M 79 42 C 81 50, 81 56, 79 62 C 78 70, 77 78, 77 86 C 77 92, 76 97, 74 100 L 77 100 C 79 97, 80 92, 80 86 C 81 78, 82 70, 83 62 C 84 56, 83 50, 81 42 Z", "Core")}
        </>
      )}
      {/* TRASERA */}
      {!isFront && (
        <>
          {/* Trapecios */}
          {rp(isFemale ? "M 56 34 C 54 38, 53 42, 54 47 L 59 47 L 59 34 Z" : "M 55 34 C 52 38, 51 43, 52 49 L 59 49 L 59 34 Z", "Espalda")}
          {rp(isFemale ? "M 64 34 C 66 38, 67 42, 66 47 L 61 47 L 61 34 Z" : "M 65 34 C 68 38, 69 43, 68 49 L 61 49 L 61 34 Z", "Espalda")}
          {/* Dorsales */}
          {rp(isFemale ? "M 46 40 C 44 48, 44 56, 46 64 C 47 68, 48 72, 49 76 L 59 76 L 59 48 C 56 48, 52 47, 50 44 Z" : "M 41 42 C 38 52, 38 62, 41 72 C 42 76, 43 80, 44 84 L 59 84 L 59 50 C 55 50, 50 48, 47 44 Z", "Espalda")}
          {rp(isFemale ? "M 74 40 C 76 48, 76 56, 74 64 C 73 68, 72 72, 71 76 L 61 76 L 61 48 C 64 48, 68 47, 70 44 Z" : "M 79 42 C 82 52, 82 62, 79 72 C 78 76, 77 80, 76 84 L 61 84 L 61 50 C 65 50, 70 48, 73 44 Z", "Espalda")}
          {/* Lumbar */}
          {rp(isFemale ? "M 49 76 C 48 80, 47 84, 47 88 L 59 88 L 59 76 Z" : "M 44 84 C 44 88, 44 92, 45 96 L 59 96 L 59 84 Z", "Espalda")}
          {rp(isFemale ? "M 71 76 C 72 80, 73 84, 73 88 L 61 88 L 61 76 Z" : "M 76 84 C 76 88, 76 92, 75 96 L 61 96 L 61 84 Z", "Espalda")}
          {/* Glúteos — mujer: redondos y amplios */}
          {rp(isFemale ? "M 47 88 C 42 92, 38 98, 37 105 C 37 111, 41 116, 48 116 C 54 116, 57 113, 59 108 L 59 88 Z" : "M 45 96 C 43 100, 42 105, 43 110 C 44 113, 48 114, 52 114 C 56 114, 58 112, 59 109 L 59 96 Z", "Glúteo")}
          {rp(isFemale ? "M 73 88 C 78 92, 82 98, 83 105 C 83 111, 79 116, 72 116 C 66 116, 63 113, 61 108 L 61 88 Z" : "M 75 96 C 77 100, 78 105, 77 110 C 76 113, 72 114, 68 114 C 64 114, 62 112, 61 109 L 61 96 Z", "Glúteo")}
        </>
      )}
      {/* Brazos — superiores */}
      {rp(isFemale ? "M 42 38 C 39 42, 37 48, 36 54 C 35 60, 36 65, 38 68 C 40 70, 43 69, 44 66 C 44 60, 45 54, 46 48 C 46 44, 45 40, 44 38 Z" : "M 34 40 C 30 46, 28 54, 27 62 C 26 68, 28 74, 31 76 C 34 78, 38 76, 39 72 C 39 66, 40 58, 41 51 C 42 46, 41 42, 39 40 Z", "Brazos")}
      {rp(isFemale ? "M 78 38 C 81 42, 83 48, 84 54 C 85 60, 84 65, 82 68 C 80 70, 77 69, 76 66 C 76 60, 75 54, 74 48 C 74 44, 75 40, 76 38 Z" : "M 86 40 C 90 46, 92 54, 93 62 C 94 68, 92 74, 89 76 C 86 78, 82 76, 81 72 C 81 66, 80 58, 79 51 C 78 46, 79 42, 81 40 Z", "Brazos")}
      {/* Brazos — antebrazos */}
      {rp(isFemale ? "M 38 68 C 36 74, 34 80, 33 86 C 32 91, 33 95, 34 97 C 35 99, 37 98, 38 95 C 39 90, 41 84, 42 78 C 42 74, 41 70, 40 68 Z" : "M 31 76 C 28 84, 26 92, 25 100 C 24 106, 26 110, 28 112 C 30 113, 32 111, 32 108 C 33 102, 35 94, 37 86 C 38 82, 37 78, 35 76 Z", "Brazos")}
      {rp(isFemale ? "M 82 68 C 84 74, 86 80, 87 86 C 88 91, 87 95, 86 97 C 85 99, 83 98, 82 95 C 81 90, 79 84, 78 78 C 78 74, 79 70, 80 68 Z" : "M 89 76 C 92 84, 94 92, 95 100 C 96 106, 94 110, 92 112 C 90 113, 88 111, 88 108 C 87 102, 85 94, 83 86 C 82 82, 83 78, 85 76 Z", "Brazos")}
      {/* Muslo izquierdo */}
      {rp(
        isFront
          ? (isFemale ? "M 44 94 C 40 102, 37 114, 36 126 C 35 138, 38 150, 42 158 L 48 158 C 46 150, 45 138, 47 126 C 48 118, 49 110, 50 102 Z" : "M 46 102 C 43 112, 41 124, 40 136 C 39 148, 41 158, 44 166 L 50 166 C 48 158, 47 148, 48 136 C 49 126, 50 116, 52 108 Z")
          : (isFemale ? "M 37 116 C 37 119, 36 122, 36 126 C 35 138, 38 150, 42 158 L 48 158 C 46 150, 45 138, 47 126 C 47.5 122, 48 119, 48 116 Z" : "M 42 114 C 42 121, 41 128, 40 136 C 39 148, 41 158, 44 166 L 50 166 C 48 158, 47 148, 48 136 C 49 128, 50 120, 50 114 Z"),
        "Pierna"
      )}
      {rp(
        isFront
          ? (isFemale ? "M 50 102 C 51 110, 52 118, 52 126 C 52 138, 51 150, 51 158 L 56 158 C 58 150, 59 138, 59 126 C 59 114, 59 102, 59 94 Z" : "M 52 108 C 53 116, 54 126, 54 136 C 54 148, 53 158, 53 166 L 57 166 C 58 158, 59 148, 59 136 C 59 124, 59 112, 59 102 Z")
          : (isFemale ? "M 52 116 C 52 119, 52 122, 52 126 C 52 138, 51 150, 51 158 L 56 158 C 58 150, 59 138, 59 126 C 59 122, 59 119, 59 116 Z" : "M 54 114 C 54 121, 54 128, 54 136 C 54 148, 53 158, 53 166 L 57 166 C 58 158, 59 148, 59 136 C 59 128, 59 120, 59 114 Z"),
        "Pierna"
      )}
      {/* Muslo derecho */}
      {rp(
        isFront
          ? (isFemale ? "M 76 94 C 80 102, 83 114, 84 126 C 85 138, 82 150, 78 158 L 72 158 C 74 150, 75 138, 73 126 C 72 118, 71 110, 70 102 Z" : "M 74 102 C 77 112, 79 124, 80 136 C 81 148, 79 158, 76 166 L 70 166 C 72 158, 73 148, 72 136 C 71 126, 70 116, 68 108 Z")
          : (isFemale ? "M 83 116 C 83 119, 84 122, 84 126 C 85 138, 82 150, 78 158 L 72 158 C 74 150, 75 138, 73 126 C 73 122, 72 119, 72 116 Z" : "M 78 114 C 78 121, 79 128, 80 136 C 81 148, 79 158, 76 166 L 70 166 C 72 158, 73 148, 72 136 C 71 128, 70 120, 70 114 Z"),
        "Pierna"
      )}
      {rp(
        isFront
          ? (isFemale ? "M 70 102 C 69 110, 68 118, 68 126 C 68 138, 69 150, 69 158 L 64 158 C 62 150, 61 138, 61 126 C 61 114, 61 102, 61 94 Z" : "M 68 108 C 67 116, 66 126, 66 136 C 66 148, 67 158, 67 166 L 63 166 C 62 158, 61 148, 61 136 C 61 124, 61 112, 61 102 Z")
          : (isFemale ? "M 68 116 C 68 119, 68 122, 68 126 C 68 138, 69 150, 69 158 L 64 158 C 62 150, 61 138, 61 126 C 61 122, 61 119, 61 116 Z" : "M 66 114 C 66 121, 66 128, 66 136 C 66 148, 67 158, 67 166 L 63 166 C 62 158, 61 148, 61 136 C 61 128, 61 120, 61 114 Z"),
        "Pierna"
      )}
      {/* Pantorrilla izquierda */}
      {rp(isFemale ? "M 42 158 C 40 166, 38 176, 39 186 C 40 192, 42 196, 44 198 C 46 199, 48 197, 48 194 L 48 158 Z" : "M 44 166 C 42 176, 40 186, 41 196 C 42 202, 44 206, 46 208 C 48 209, 50 207, 50 204 L 50 166 Z", "Pierna")}
      {rp(isFemale ? "M 48 158 L 48 194 C 49 192, 51 188, 52 184 C 53 176, 54 168, 56 158 Z" : "M 50 166 L 50 204 C 51 200, 53 194, 54 188 C 55 180, 56 172, 57 166 Z", "Pierna")}
      {/* Pantorrilla derecha */}
      {rp(isFemale ? "M 78 158 C 80 166, 82 176, 81 186 C 80 192, 78 196, 76 198 C 74 199, 72 197, 72 194 L 72 158 Z" : "M 76 166 C 78 176, 80 186, 79 196 C 78 202, 76 206, 74 208 C 72 209, 70 207, 70 204 L 70 166 Z", "Pierna")}
      {rp(isFemale ? "M 72 158 L 72 194 C 71 192, 69 188, 68 184 C 67 176, 66 168, 64 158 Z" : "M 70 166 L 70 204 C 69 200, 67 194, 66 188 C 65 180, 64 172, 63 166 Z", "Pierna")}
    </>
  );
};

export default function StatsView() {
  const { history, personalRecords, settings } = useGymStore();
  const gender = settings?.gender || "male";
  const [metricsOpen, setMetricsOpen] = useState(false);

  // --- Computed stats ---
  const totalWorkouts = history.length;

  const totalVolume = history.reduce((acc, w) => {
    w.exercises.forEach((ex) =>
      ex.sets.forEach((s) => {
        if (s.completed && s.weight && s.reps)
          acc += parseFloat(s.weight) * parseInt(s.reps);
      }),
    );
    return acc;
  }, 0);

  const totalTime = history.reduce((acc, w) => {
    if (w.endTime && w.startTime) acc += w.endTime - w.startTime;
    return acc;
  }, 0);
  const totalMins = Math.round(totalTime / 60000);

  const totalSets = history.reduce((acc, w) => {
    w.exercises.forEach((ex) => {
      acc += ex.sets.filter((s) => s.completed).length;
    });
    return acc;
  }, 0);

  // Weekly volume (last 7 days)
  const now = Date.now();
  const dayMs = 86400000;
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * dayMs;
    const dayEnd = dayStart + dayMs;
    const dayLabel = new Date(dayStart)
      .toLocaleDateString("es-ES", { weekday: "short" })
      .slice(0, 2)
      .toUpperCase();
    let vol = 0;
    history.forEach((w) => {
      if (
        (w.endTime || w.startTime) >= dayStart &&
        (w.endTime || w.startTime) < dayEnd
      ) {
        w.exercises.forEach((ex) =>
          ex.sets.forEach((s) => {
            if (s.completed && s.weight && s.reps)
              vol += parseFloat(s.weight) * parseInt(s.reps);
          }),
        );
      }
    });
    return { label: dayLabel, value: vol };
  });
  const maxWeekVol = Math.max(...weekData.map((d) => d.value), 1);

  const daysTrainedThisWeek = weekData.filter((d) => d.value > 0).length;
  const weeklyGoal = settings?.weeklyGoal || 4;
  const weeklyProgress = Math.min(
    (daysTrainedThisWeek / weeklyGoal) * 100,
    100,
  );

  // Calcular volumen de series semanales por músculo
  const weeklySetsByMuscle = {};
  const oneWeekAgo = now - 7 * dayMs;
  history.forEach((w) => {
    const wTime = w.endTime || w.startTime;
    if (wTime >= oneWeekAgo) {
      w.exercises.forEach((ex) => {
        const completedSets = ex.sets.filter((s) => s.completed).length;
        if (completedSets > 0) {
          // Normalizar nombres a los grupos de heatmap
          let key = ex.muscle;
          if (key === "Bíceps" || key === "Tríceps") key = "Brazos";
          weeklySetsByMuscle[key] =
            (weeklySetsByMuscle[key] || 0) + completedSets;
        }
      });
    }
  });
  const maxSets = Math.max(...Object.values(weeklySetsByMuscle), 1);

  // Muscle Volume Distribution
  const muscleVolume = history.reduce((acc, w) => {
    w.exercises.forEach((ex) => {
      let vol = 0;
      ex.sets.forEach((s) => {
        if (s.completed && s.weight && s.reps)
          vol += parseFloat(s.weight) * parseInt(s.reps);
      });
      if (vol > 0) {
        acc[ex.muscle] = (acc[ex.muscle] || 0) + vol;
      }
    });
    return acc;
  }, {});
  const maxMuscleVol = Math.max(...Object.values(muscleVolume), 1);
  const muscleData = Object.entries(muscleVolume).sort((a, b) => b[1] - a[1]);

  // Personal records
  const prList = Object.entries(personalRecords)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => (b.maxWeight || 0) - (a.maxWeight || 0))
    .slice(0, 10);

  // GitHub contribution data
  const yearlyGrid = getYearlyContributionData(history);
  const DAYS_NAMES_MINI = ["L", "", "M", "", "V", "", "D"];

  // Función para obtener el estado del heatmap (nivel: none, muy-bajo, bajo, medio, alto, muy-alto)
  const getMuscleState = (muscleKey) => {
    let sets = weeklySetsByMuscle[muscleKey] || 0;
    const maxVal = maxSets;
    if (sets === 0) return { level: "none", color: "transparent", opacity: 0 };
    
    const ratio = sets / maxVal;
    if (ratio <= 0.2) return { level: "muy-bajo", color: "#34d399", opacity: 0.3 }; // Verde muy claro/transparente
    if (ratio <= 0.4) return { level: "bajo", color: "#34d399", opacity: 0.5 };     // Verde claro
    if (ratio <= 0.6) return { level: "medio", color: "#10b981", opacity: 0.7 };    // Verde medio
    if (ratio <= 0.8) return { level: "alto", color: "#059669", opacity: 0.9 };     // Verde oscuro
    return { level: "muy-alto", color: "#047857", opacity: 1 };                     // Verde muy oscuro
  };

  return (
    <>
      <div className="px-4 pt-5 pb-24 min-h-[100dvh] space-y-6 relative overflow-hidden bg-hero-stats">
        {/* Decoraciones de fondo */}
        <svg className="absolute top-24 right-0 w-32 h-32 text-lime-500/[0.02] animate-float pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>
        <svg className="absolute bottom-40 left-0 w-28 h-28 text-lime-500/[0.02] animate-float-delayed pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="10" width="3" height="4" rx="1" />
          <rect x="19" y="10" width="3" height="4" rx="1" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" />
          <rect x="6" y="9" width="12" height="6" rx="1" />
        </svg>

        <div className="flex items-center justify-between relative z-10">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Estadísticas de Rendimiento
          </h1>
          <button
            onClick={() => setMetricsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 press-scale hover:bg-cyan-500/20 transition-colors"
          >
            <Ruler size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Mi cuerpo
            </span>
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: Flame,
              label: "Entrenamientos",
              value: totalWorkouts,
              color: "#ef4444",
            },
            {
              icon: Dumbbell,
              label: "Volumen Total",
              value: `${(totalVolume / 1000).toFixed(1)}t`,
              color: "var(--accent-color)",
            },
            {
              icon: Clock,
              label: "Tiempo Activo",
              value:
                totalMins < 60
                  ? `${totalMins}m`
                  : `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`,
              color: "#3b82f6",
            },
            {
              icon: TrendingUp,
              label: "Series Realizadas",
              value: totalSets,
              color: "#f59e0b",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="gradient-card rounded-2xl p-4 flex flex-col justify-between h-24 relative overflow-hidden"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-black text-slate-100 tabular-nums leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Meta Semanal circular & volumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="gradient-card rounded-2xl p-4.5 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Target size={13} className="text-[var(--accent-color)]" />
                Meta de Días
              </h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Completado: {daysTrainedThisWeek} de {weeklyGoal} días
              </p>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  className="stroke-slate-800"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="var(--accent-color)"
                  strokeWidth="4"
                  strokeDasharray={`${weeklyProgress}, 100`}
                  strokeLinecap="round"
                  className="animate-[ringProgress_1s_ease-out]"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-[11px] text-[var(--accent-color)]">
                {Math.round(weeklyProgress)}%
              </div>
            </div>
          </div>

          {/* Gráfico semanal */}
          <div className="gradient-card rounded-2xl p-4.5">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Activity size={13} className="text-[var(--accent-color)]" />
              Volumen Semanal (kg)
            </h3>
            <div className="flex items-end gap-2 h-24">
              {weekData.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex flex-col items-center justify-end h-18">
                    {d.value > 0 && (
                      <span className="text-[8px] text-[var(--accent-color)] font-black mb-1 tabular-nums">
                        {d.value > 999
                          ? `${(d.value / 1000).toFixed(1)}k`
                          : d.value}
                      </span>
                    )}
                    <div
                      className="w-full rounded-md transition-all duration-500"
                      style={{
                        height: `${Math.max((d.value / maxWeekVol) * 80, d.value > 0 ? 6 : 2)}%`,
                        backgroundColor:
                          d.value > 0
                            ? "var(--accent-color)"
                            : "var(--bar-track-bg)",
                        boxShadow:
                          d.value > 0
                            ? "0 0 10px rgba(var(--accent-color-rgb), 0.25)"
                            : "none",
                      }}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-bold ${d.value > 0 ? "text-slate-400" : "text-slate-650"}`}
                  >
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anatomical Heatmap SVG */}
        <div className="gradient-card rounded-2xl p-5">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[var(--accent-color)]" />
            Enfoque Muscular (7D)
          </h3>

          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="flex items-center justify-center w-full">
              <svg
                viewBox="0 0 280 230"
                className="w-full max-w-[320px] h-auto drop-shadow-lg select-none"
              >
                {/* === VISTA FRONTAL (Izquierda) === */}
                <g transform="translate(10, 10)">
                  <SilhouetteView gender={gender} view="front" showHeatmap={false} />
                  <SilhouetteView gender={gender} view="front" showHeatmap={true} getMuscleState={getMuscleState} />
                  
                  <text
                    x="60"
                    y="222"
                    fill="#475569"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    FRONTAL
                  </text>
                </g>

                {/* === VISTA TRASERA (Derecha) === */}
                <g transform="translate(150, 10)">
                  <SilhouetteView gender={gender} view="back" showHeatmap={false} />
                  <SilhouetteView gender={gender} view="back" showHeatmap={true} getMuscleState={getMuscleState} />
                  
                  <text
                    x="60"
                    y="222"
                    fill="#475569"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    TRASERA
                  </text>
                </g>
              </svg>
            </div>

            {/* Leyenda horizontal abajo */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-500 mt-2 max-w-[320px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#047857]" />
                <span>Excelente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#059669]" />
                <span>Alto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#10b981]" />
                <span>Medio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#34d399] opacity-50" />
                <span>Bajo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#34d399] opacity-30" />
                <span>Muy Bajo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-slate-900 border border-white/5" />
                <span>Sin Entrenar</span>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub style Consistency Heatmap Grid */}
        <div className="gradient-card rounded-2xl p-5 overflow-hidden">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Calendar size={13} className="text-[var(--accent-color)]" />
            Consistencia Anual
          </h3>

          <div className="overflow-x-auto no-scrollbar -mx-2 px-2 flex gap-2">
            {/* Days labels */}
            <div className="flex flex-col justify-between text-[8px] text-slate-650 font-bold py-1 h-[78px] pr-1 select-none">
              {DAYS_NAMES_MINI.map((d, i) => (
                <span key={i} className="h-2.5 flex items-center justify-end">
                  {d}
                </span>
              ))}
            </div>

            {/* Grid rows */}
            <div className="flex gap-1">
              {Array.from({ length: 53 }).map((_, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dIdx) => {
                    const dayData = yearlyGrid[dIdx][wIdx];
                    if (!dayData) return null;
                    const active = dayData.count > 0;
                    const future = dayData.isFuture;

                    return (
                      <div
                        key={dIdx}
                        className={`w-2.5 h-2.5 rounded-[2px] transition-colors ${
                          future
                            ? "opacity-0"
                            : active
                              ? "bg-[var(--accent-color)] shadow-[0_0_4px_rgba(var(--accent-color-rgb),0.3)]"
                              : "bg-slate-800/20 border border-slate-700/10"
                        }`}
                        title={`${dayData.dateStr}: ${dayData.count} entrenos`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[9px] text-slate-600 font-bold mt-3.5 px-6 select-none">
            <span>Hace 1 año</span>
            <span>Hoy</span>
          </div>
        </div>

        {/* Muscle Distribution horizontal bars */}
        {muscleData.length > 0 && (
          <div className="gradient-card rounded-2xl p-5">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">
              Volumen Histórico por Músculo
            </h3>
            <div className="space-y-4">
              {muscleData.map(([muscle, vol]) => (
                <div key={muscle} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">{muscle}</span>
                    <span className="text-slate-500">
                      {vol > 999 ? `${(vol / 1000).toFixed(1)}k` : vol} kg
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800/30 rounded-full overflow-hidden border border-slate-700/10">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)]"
                      style={{ width: `${(vol / maxMuscleVol) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Records */}
        <div className="gradient-card rounded-2xl p-5">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Trophy size={13} className="text-yellow-500" />
            Récords Personales (PRs)
          </h3>
          {prList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6 font-semibold">
              Completa entrenamientos para registrar tus PRs
            </p>
          ) : (
            <div className="space-y-3">
              {prList.map((pr, i) => (
                <div key={pr.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center text-[10px] font-black text-yellow-500 border border-yellow-500/10">
                      {i + 1}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">
                      {pr.exerciseName}
                    </span>
                  </div>
                  <span className="text-xs font-black text-lime-500 tabular-nums">
                    {pr.maxWeight} kg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />

      <BodyMetrics isOpen={metricsOpen} onClose={() => setMetricsOpen(false)} />
    </>
  );
}
