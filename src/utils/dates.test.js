import { describe, it, expect } from "vitest";
import { getLocalDateString, isSameLocalDay, getMondayOfWeek } from "./dates";

describe("getLocalDateString", () => {
  it("formatea fecha como YYYY-MM-DD", () => {
    expect(getLocalDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("rellena con ceros mes y día de un dígito", () => {
    expect(getLocalDateString(new Date(2026, 8, 1))).toBe("2026-09-01");
  });
});

describe("isSameLocalDay", () => {
  it("detecta mismo día aunque cambie la hora", () => {
    const a = new Date(2026, 5, 10, 8, 0).getTime();
    const b = new Date(2026, 5, 10, 23, 30).getTime();
    expect(isSameLocalDay(a, b)).toBe(true);
  });

  it("detecta días distintos", () => {
    const a = new Date(2026, 5, 10).getTime();
    const b = new Date(2026, 5, 11).getTime();
    expect(isSameLocalDay(a, b)).toBe(false);
  });
});

describe("getMondayOfWeek", () => {
  it("devuelve el lunes de la semana para un miércoles", () => {
    const wednesday = new Date(2026, 6, 8); // 8 jul 2026 = miércoles
    const monday = getMondayOfWeek(wednesday);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(6);
  });

  it("devuelve el mismo día si ya es lunes", () => {
    const monday = new Date(2026, 6, 6);
    const result = getMondayOfWeek(monday);
    expect(result.getDate()).toBe(6);
  });

  it("retrocede correctamente si el día es domingo", () => {
    const sunday = new Date(2026, 6, 12);
    const result = getMondayOfWeek(sunday);
    expect(result.getDay()).toBe(1);
    expect(result.getDate()).toBe(6);
  });

  it("pone la hora a medianoche", () => {
    const result = getMondayOfWeek(new Date(2026, 6, 8, 15, 30));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it("cruza correctamente el cambio de año (jueves 1 ene 2026 -> lunes 29 dic 2025)", () => {
    const newYearThursday = new Date(2026, 0, 1);
    const monday = getMondayOfWeek(newYearThursday);
    expect(monday.getFullYear()).toBe(2025);
    expect(monday.getMonth()).toBe(11); // diciembre
    expect(monday.getDate()).toBe(29);
    expect(monday.getDay()).toBe(1);
  });
});
