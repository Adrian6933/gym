import React, { useState } from "react";
import { supabase } from "../db/supabase";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/",
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError(
        "No se pudo conectar con Google. Por favor, inténtalo de nuevo.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl bg-white text-slate-950 font-bold flex items-center justify-center gap-3 transition-all text-[15px] press-scale shadow-xl shadow-white/5 hover:bg-slate-100 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? "Conectando..." : "Continuar con Google"}
      </button>

      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-scale-in text-center">
          {error}
        </div>
      )}
    </div>
  );
}
