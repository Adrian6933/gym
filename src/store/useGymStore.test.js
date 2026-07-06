import { describe, it, expect, vi } from "vitest";

vi.mock("../db/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

vi.mock("../components/Toast", () => ({
  useToastStore: { getState: () => ({ addToast: vi.fn() }) },
}));

const {
  calculateStreak,
  calculateRecordStreak,
  getExerciseCalories,
  getRoutineStats,
  getWeeklyConsistency,
  getWeeklyStats,
} = await import("./useGymStore");

function workoutAt(date, exercises = []) {
  const t = date.getTime();
  return { startTime: t - 30 * 60000, endTime: t, exercises };
}

describe("calculateStreak", () => {
  it("es 0 sin historial", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("es 0 si el último entreno fue hace más de un día", () => {
    const old = new Date();
    old.setDate(old.getDate() - 3);
    expect(calculateStreak([workoutAt(old)])).toBe(0);
  });

  it("cuenta días consecutivos terminando hoy", () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const history = [
      workoutAt(today),
      workoutAt(yesterday),
      workoutAt(twoDaysAgo),
    ];
    expect(calculateStreak(history)).toBe(3);
  });

  it("cuenta la racha aunque el último entreno fuera ayer", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(calculateStreak([workoutAt(yesterday)])).toBe(1);
  });
});

describe("calculateRecordStreak", () => {
  it("es al menos igual a la racha actual", () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const history = [workoutAt(today), workoutAt(yesterday)];
    expect(calculateRecordStreak(history)).toBeGreaterThanOrEqual(
      calculateStreak(history),
    );
  });

  it("es 0 sin historial", () => {
    expect(calculateRecordStreak([])).toBe(0);
  });

  it("encuentra la racha más larga del historial aunque la actual esté rota", () => {
    // Racha vieja de 5 días consecutivos, hueco de 3 días, racha reciente de 2 días.
    // La racha actual (calculateStreak) es 0 porque el historial es todo pasado
    // (ningún entreno hoy/ayer), pero el récord debe seguir siendo 5.
    const day = (offset) => {
      const d = new Date(2020, 0, 1);
      d.setDate(d.getDate() + offset);
      return d;
    };
    const history = [
      workoutAt(day(0)),
      workoutAt(day(1)),
      workoutAt(day(2)),
      workoutAt(day(3)),
      workoutAt(day(4)),
      // hueco: día 5, 6, 7 sin entrenar
      workoutAt(day(8)),
      workoutAt(day(9)),
    ];
    expect(calculateStreak(history)).toBe(0);
    expect(calculateRecordStreak(history)).toBe(5);
  });
});

describe("getExerciseCalories", () => {
  it("devuelve 0 sin ejercicio", () => {
    expect(getExerciseCalories(null)).toBe(0);
  });

  it("aplica factor mayor a piernas que a bíceps (mismo nº de series)", () => {
    const legs = { muscle: "Pierna", type: "reps", targetSets: 3 };
    const biceps = { muscle: "Bíceps", type: "reps", targetSets: 3 };
    expect(getExerciseCalories(legs)).toBeGreaterThan(
      getExerciseCalories(biceps),
    );
  });

  it("calcula ejercicios de tiempo (cardio) usando la duración", () => {
    const cardio = { muscle: "Cardio", type: "time", targetDuration: 60, targetSets: 1 };
    expect(getExerciseCalories(cardio)).toBe(10);
  });

  it("un descanso más largo entre series aumenta la estimación (reps)", () => {
    const ex = { muscle: "Pierna", type: "reps", targetSets: 4 };
    expect(getExerciseCalories(ex, 180)).toBeGreaterThan(
      getExerciseCalories(ex, 30),
    );
  });
});

describe("getRoutineStats", () => {
  it("devuelve 0 en rutina vacía", () => {
    expect(getRoutineStats({ exercises: [] })).toEqual({
      calories: 0,
      duration: 0,
    });
  });

  it("suma calorías y duración de varios ejercicios", () => {
    const routine = {
      exercises: [
        { muscle: "Pecho", type: "reps", targetSets: 3 },
        { muscle: "Espalda", type: "reps", targetSets: 3 },
      ],
    };
    const stats = getRoutineStats(routine, 90);
    expect(stats.calories).toBeGreaterThan(0);
    expect(stats.duration).toBeGreaterThan(0);
  });

  it("calcula valores exactos para 2 ejercicios de 3 series con 60s de descanso", () => {
    // Cada ejercicio (factor 6.0 Pecho/Espalda): calorías = round(3*6.0 + restCalorias)
    //   restMins = (3-1)*60/60 = 2; restCalorias = 2*1.2 = 2.4 -> round(18+2.4) = 20
    // Duración por ejercicio: (3*45)/60 + (2*60)/60 = 2.25 + 2 = 4.25 min
    // Total duración: 4.25*2 + (2-1)*1.5 (pausa entre ejercicios) = 10.0 -> round = 10
    const routine = {
      exercises: [
        { muscle: "Pecho", type: "reps", targetSets: 3 },
        { muscle: "Espalda", type: "reps", targetSets: 3 },
      ],
    };
    expect(getRoutineStats(routine, 60)).toEqual({ calories: 40, duration: 10 });
  });
});

describe("getWeeklyConsistency", () => {
  it("devuelve 7 falses sin historial", () => {
    expect(getWeeklyConsistency([])).toEqual(Array(7).fill(false));
  });

  it("marca el día de hoy como entrenado", () => {
    const today = new Date();
    let dayIndex = today.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;
    const consistency = getWeeklyConsistency([workoutAt(today)]);
    expect(consistency[dayIndex]).toBe(true);
  });
});

describe("getWeeklyStats", () => {
  it("ignora sets sin peso/reps completos al sumar volumen", () => {
    const today = new Date();
    const history = [
      workoutAt(today, [
        {
          sets: [
            { completed: true, weight: "60", reps: "8" },
            { completed: false, weight: "60", reps: "8" },
            { completed: true, weight: "", reps: "8" },
          ],
        },
      ]),
    ];
    const stats = getWeeklyStats(history);
    expect(stats.volume).toBe(480);
    expect(stats.count).toBe(1);
  });

  it("no cuenta NaN en el volumen", () => {
    const today = new Date();
    const history = [
      workoutAt(today, [
        { sets: [{ completed: true, weight: "abc", reps: "8" }] },
      ]),
    ];
    expect(getWeeklyStats(history).volume).toBe(0);
  });
});
