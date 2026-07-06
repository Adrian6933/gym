import React, { useEffect, Suspense, lazy } from "react";
import { useGymStore } from "../store/useGymStore";
import AppInitializer from "./AppInitializer";
import GoogleLogin from "./GoogleLogin";
import HomeView from "./HomeView";
import WorkoutActive from "./WorkoutActive";

const StatsView = lazy(() => import("./StatsView"));
const HistoryView = lazy(() => import("./HistoryView"));
const SettingsView = lazy(() => import("./SettingsView"));

function ViewFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AppShell({ defaultTab }) {
  const user = useGymStore((s) => s.user);
  const activeTab = useGymStore((s) => s.activeTab);
  const setActiveTab = useGymStore((s) => s.setActiveTab);
  const isLoading = useGymStore((s) => s.isLoading);

  // Sincronizar pestaña por defecto en montajes individuales (ej: carga directa en navegador)
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, setActiveTab]);

  // Mostrar inicializador (pantalla de carga de Supabase) si está cargando
  if (isLoading) {
    return <AppInitializer />;
  }

  // Si no hay sesión, obligar a ir a GoogleLogin
  if (!user) {
    return <GoogleLogin />;
  }

  // Renderizar la pestaña activa
  switch (activeTab) {
    case "home":
      return <HomeView />;
    case "workout":
      return <WorkoutActive />;
    case "stats":
      return (
        <Suspense fallback={<ViewFallback />}>
          <StatsView />
        </Suspense>
      );
    case "history":
      return (
        <Suspense fallback={<ViewFallback />}>
          <HistoryView />
        </Suspense>
      );
    case "settings":
      return (
        <Suspense fallback={<ViewFallback />}>
          <SettingsView />
        </Suspense>
      );
    default:
      return <HomeView />;
  }
}
