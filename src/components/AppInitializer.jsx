import React, { useEffect } from "react";
import { useGymStore } from "../store/useGymStore";

export default function AppInitializer() {
  const { theme, themeMode } = useGymStore((s) => s.settings) || {};
  const initializeSession = useGymStore((s) => s.initializeSession);
  const isLoading = useGymStore((s) => s.isLoading);
  const setActiveTab = useGymStore((s) => s.setActiveTab);
  const justLeveledUp = useGymStore((s) => s.justLeveledUp);
  const userLevel = useGymStore((s) => s.userLevel);

  // 1. Inicializar sesión de Supabase al montar la app
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // 2. Escuchar navegación del navegador (botones atrás/adelante)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        setActiveTab("home");
      } else {
        const tabId = path.replace("/", "");
        setActiveTab(tabId);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setActiveTab]);

  // 3. Sincronizar tema visual con el elemento raíz HTML
  useEffect(() => {
    const activeTheme = theme || "lime";
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [theme]);

  // 4. Sincronizar modo claro/oscuro con el elemento raíz HTML
  useEffect(() => {
    const activeMode = themeMode || "dark";
    document.documentElement.setAttribute("data-theme-mode", activeMode);
  }, [themeMode]);

  // 5. Si está cargando datos, mostramos una pantalla de carga premium de FitPulse
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] z-[9999] flex flex-col items-center justify-center px-6">
        {/* Background neon glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.05)` }} />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Heartbeat pulse container */}
          <div className="w-24 h-24 rounded-full bg-slate-900/40 border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-black/45">
            {/* Orbiting ring */}
            <div className="absolute inset-0 rounded-full border animate-spin duration-3000" style={{ borderColor: `rgba(var(--accent-color-rgb), 0.20)` }} />

            {/* Heartbeat Pulse wave */}
            <svg
              width="48"
              height="32"
              viewBox="0 0 80 40"
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.55)]"
            >
              <path
                d="M10 20 H 25 L 32 5 L 38 35 L 43 15 L 48 25 L 53 20 H 70"
                className="animate-pulse"
              />
            </svg>
          </div>

          <div className="space-y-1 z-10">
            <h2 className="text-2xl font-black tracking-tight text-slate-100">
              Fit<span className="text-[var(--accent-color)]">Pulse</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              Sincronizando
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {justLeveledUp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center p-6 animate-fade-in pointer-events-none select-none">
          <div className="relative flex flex-col items-center text-center space-y-4 animate-scale-in">
            {/* Spinning glowing rings */}
            <div className="absolute inset-[-45px] rounded-full border-2 border-dashed animate-spin duration-5000" style={{ borderColor: `rgba(var(--accent-color-rgb), 0.25)` }} />
            
            <div className="w-24 h-24 rounded-full bg-gradient-lime-btn flex items-center justify-center text-5xl shadow-2xl animate-breathe" style={{ boxShadow: `0 25px 50px -12px rgba(var(--accent-color-rgb), 0.20)` }}>
              🏆
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] text-[var(--accent-color)] font-black uppercase tracking-widest">
                ¡Has subido de nivel!
              </p>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight">
                Nivel {userLevel}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                ¡Sigue machacando en el gimnasio! 💪
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
