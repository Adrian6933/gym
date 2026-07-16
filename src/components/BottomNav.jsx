import React from "react";
import { Home, Dumbbell, BarChart3, Clock, Settings } from "lucide-react";
import { useGymStore } from "../store/useGymStore";

const tabs = [
  { id: "home", label: "Inicio", title: "FitPulse — Inicio", icon: Home, href: "/" },
  { id: "workout", label: "Entrenar", title: "FitPulse — Entrenar", icon: Dumbbell, href: "/workout" },
  { id: "stats", label: "Stats", title: "FitPulse — Estadísticas", icon: BarChart3, href: "/stats" },
  { id: "history", label: "Historial", title: "FitPulse — Historial", icon: Clock, href: "/history" },
  { id: "settings", label: "Ajustes", title: "FitPulse — Ajustes", icon: Settings, href: "/settings" },
];

export default function BottomNav() {
  const activeTab = useGymStore((s) => s.activeTab);
  const setActiveTab = useGymStore((s) => s.setActiveTab);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const isActive = (tab) => {
    if (activeTab) return tab.id === activeTab;
    if (tab.href === "/") return currentPath === "/";
    return currentPath.startsWith(tab.href);
  };

  // Navegación SPA: cambia la vista vía estado global (AppShell) sin recargar
  // la página ni reinicializar la sesión de Supabase. El botón atrás sigue
  // funcionando gracias al listener de popstate en AppInitializer.
  const handleNav = (e, tab) => {
    // Respetar aperturas en nueva pestaña / ventana
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
    e.preventDefault();
    if (window.location.pathname !== tab.href) {
      window.history.pushState({}, "", tab.href);
    }
    document.title = tab.title;
    setActiveTab(tab.id);
    window.scrollTo(0, 0);
  };

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => isActive(t)),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom px-3 pb-3 pointer-events-none">
      <div className="gradient-glass border border-white/5 rounded-[1.75rem] shadow-[0_-8px_30px_rgba(0,0,0,0.35)] pointer-events-auto max-w-lg mx-auto overflow-hidden">
        <div className="relative flex justify-around items-center h-[4.5rem]">
          {/* Pill de fondo que se desliza */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[3.25rem] rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none"
            style={{
              width: "calc(20% - 32px)",
              left: `calc(${activeIndex * 20}% + 16px)`,
              background: `linear-gradient(180deg, rgba(var(--accent-color-rgb), 0.18) 0%, rgba(var(--accent-color-rgb), 0.06) 100%)`,
              boxShadow: `inset 0 0 0 1px rgba(var(--accent-color-rgb), 0.22), 0 6px 20px -6px rgba(var(--accent-color-rgb), 0.30)`,
            }}
          />

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleNav(e, tab)}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                title={tab.label}
                className={`relative flex items-center justify-center w-full h-full transition-all duration-300 z-10 ${
                  active ? "text-[var(--accent-color)]" : "text-slate-500"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 ${active ? "-translate-y-0.5" : ""}`}
                >
                  <Icon
                    size={active ? 26 : 23}
                    strokeWidth={active ? 2.4 : 1.8}
                    className="transition-all duration-300"
                    style={
                      active
                        ? {
                            filter: "drop-shadow(0 0 6px rgba(var(--accent-color-rgb), 0.45))",
                          }
                        : undefined
                    }
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
