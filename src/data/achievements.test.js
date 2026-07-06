import { describe, it, expect } from "vitest";
import { ACHIEVEMENTS } from "./achievements";

const emptyCtx = {
  history: [],
  personalRecords: {},
  routines: [],
  streak: 0,
  recordStreak: 0,
  totalVolume: 0,
  userLevel: 1,
};

describe("ACHIEVEMENTS", () => {
  it("cada logro tiene id único, tier y función check", () => {
    const ids = new Set();
    for (const a of ACHIEVEMENTS) {
      expect(typeof a.id).toBe("string");
      expect(ids.has(a.id)).toBe(false);
      ids.add(a.id);
      expect(typeof a.check).toBe("function");
      expect(["bronze", "silver", "gold", "legend"]).toContain(a.tier);
    }
  });

  it("ningún logro se desbloquea con un contexto vacío", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.check(emptyCtx)).toBeFalsy();
    }
  });

  it("no lanza excepción con datos parciales o indefinidos", () => {
    const partialCtx = { history: [], personalRecords: {}, routines: [] };
    for (const a of ACHIEVEMENTS) {
      expect(() => a.check(partialCtx)).not.toThrow();
    }
  });

  it("first-workout se desbloquea con un entrenamiento", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "first-workout");
    expect(achievement.check({ ...emptyCtx, history: [{}] })).toBe(true);
  });

  it("streak-3 se desbloquea a partir de 3 días de racha", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "streak-3");
    expect(achievement.check({ ...emptyCtx, streak: 2 })).toBe(false);
    expect(achievement.check({ ...emptyCtx, streak: 3 })).toBe(true);
  });

  it("volume-10k se desbloquea a partir de 10000kg", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "volume-10k");
    expect(achievement.check({ ...emptyCtx, totalVolume: 9999 })).toBe(false);
    expect(achievement.check({ ...emptyCtx, totalVolume: 10000 })).toBe(true);
  });

  it("level-5 se desbloquea al alcanzar el nivel 5", () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === "level-5");
    expect(achievement.check({ ...emptyCtx, userLevel: 4 })).toBe(false);
    expect(achievement.check({ ...emptyCtx, userLevel: 5 })).toBe(true);
  });
});
