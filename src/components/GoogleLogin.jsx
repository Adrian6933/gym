import React, { useState } from "react";
import { supabase } from "../db/supabase";

export default function GoogleLogin() {
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
    <div className="min-h-[100dvh] flex flex-col items-center justify-between px-6 py-12 overflow-hidden relative bg-gym-grid bg-hero-gym">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-lime-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[50vw] h-[50vw] bg-lime-500/3 rounded-full blur-[80px] pointer-events-none" />

      {/* Dumbbell decorativo flotante */}
      <svg className="absolute top-[15%] right-[8%] w-16 h-16 text-lime-500/10 animate-float pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5 17.5 17.5" />
        <rect x="2" y="10" width="3" height="4" rx="1" />
        <rect x="19" y="10" width="3" height="4" rx="1" />
        <rect x="4" y="8" width="16" height="8" rx="1.5" />
        <rect x="6" y="9" width="12" height="6" rx="1" />
        <rect x="3" y="11" width="2" height="2" rx="0.5" />
        <rect x="19" y="11" width="2" height="2" rx="0.5" />
      </svg>

      {/* Segunda mancuerna flotante */}
      <svg className="absolute bottom-[25%] left-[5%] w-14 h-14 text-lime-500/8 animate-float-delayed pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5 17.5 17.5" />
        <rect x="2" y="10" width="3" height="4" rx="1" />
        <rect x="19" y="10" width="3" height="4" rx="1" />
        <rect x="4" y="8" width="16" height="8" rx="1.5" />
        <rect x="6" y="9" width="12" height="6" rx="1" />
      </svg>

      {/* Cuerda de saltar decorativa */}
      <svg className="absolute top-[30%] left-[2%] w-12 h-24 text-lime-500/6 animate-float-slow pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 4 C 8 20, 16 20, 20 4" />
        <circle cx="4" cy="4" r="2" />
        <circle cx="20" cy="4" r="2" />
        <path d="M4 4 C 6 8, 10 10, 12 10" opacity="0.4" />
      </svg>

      {/* Top spacer */}
      <div />

      {/* Logo & Welcome */}
      <div className="flex flex-col items-center text-center animate-slide-up z-10 w-full max-w-xs">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-[2rem] gradient-lime-btn flex items-center justify-center shadow-2xl shadow-lime-500/30 animate-breathe">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0a0f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.4 14.4 9.6 9.6" />
              <path d="M18.657 21.485a2 2 0 0 1-2.829 0l-1.414-1.414a2 2 0 0 1 0-2.828l.707-.707 4.243 4.243-.707.707Z" />
              <path d="m21.485 18.657-1.414-1.414" />
              <path d="M5.343 2.515a2 2 0 0 0-2.829 0L1.1 3.929a2 2 0 0 0 0 2.829l.707.707L6.05 3.222l-.707-.707Z" />
              <path d="m2.515 5.343 1.414 1.414" />
              <path d="m16.97 7.03-2.122-2.122a2 2 0 0 0-2.828 0L9.879 7.05l7.07 7.071 2.122-2.121a2 2 0 0 0 0-2.829l-2.12-2.12Z" />
              <path d="m7.05 9.879-2.12 2.122a2 2 0 0 0 0 2.828l2.12 2.121a2 2 0 0 0 2.829 0l2.121-2.121-4.95-4.95Z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-slate-100 mb-2">
          Fit<span className="text-lime-500">Pulse</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed max-w-[280px] mb-12">
          Tu entrenador personal de bolsillo. Registra, analiza y supera tus
          marcas.
        </p>

        {/* Google Sign In Button */}
        <div className="w-full">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl bg-white text-slate-950 font-bold flex items-center justify-center gap-3 transition-all text-[15px] press-scale shadow-xl shadow-white/5 hover:bg-slate-100 disabled:opacity-50`}
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
      </div>

      {/* Footer */}
      <p className="text-[11px] text-slate-700 text-center z-10 animate-fade-in delay-3">
        Para usar FitPulse es necesario iniciar sesión de forma segura.
      </p>
    </div>
  );
}
