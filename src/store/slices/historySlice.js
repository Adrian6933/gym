import { supabase } from "../../db/supabase";

// ===== ACCIONES DEL HISTORIAL =====
export const createHistorySlice = (set, get) => ({
  history: [],
  personalRecords: {},

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
});