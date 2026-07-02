import React, { useEffect } from "react";
import { useGymStore } from "../store/useGymStore";
import AppInitializer from "./AppInitializer";
import GoogleLogin from "./GoogleLogin";
import HomeView from "./HomeView";
import WorkoutActive from "./WorkoutActive";
import StatsView from "./StatsView";
import HistoryView from "./HistoryView";
import SettingsView from "./SettingsView";

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
      return <StatsView />;
    case "history":
      return <HistoryView />;
    case "settings":
      return <SettingsView />;
    default:
      return <HomeView />;
  }
}
