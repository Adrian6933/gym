// ===== BODY METRICS =====
export const createBodyMetricsSlice = (set) => ({
  bodyMetrics:
    typeof window !== "undefined"
      ? (() => {
          try {
            return JSON.parse(
              localStorage.getItem("fitpulse-body-metrics") || "[]",
            );
          } catch {
            return [];
          }
        })()
      : [],

  addBodyMetric: (metric) => {
    const newMetric = {
      id: `metric-${Date.now()}`,
      date: Date.now(),
      ...metric,
    };
    set((state) => {
      const updated = [newMetric, ...state.bodyMetrics].sort(
        (a, b) => b.date - a.date,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "fitpulse-body-metrics",
          JSON.stringify(updated),
        );
      }
      return { bodyMetrics: updated };
    });
  },

  deleteBodyMetric: (id) => {
    set((state) => {
      const updated = state.bodyMetrics.filter((m) => m.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "fitpulse-body-metrics",
          JSON.stringify(updated),
        );
      }
      return { bodyMetrics: updated };
    });
  },
});