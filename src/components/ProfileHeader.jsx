import React from "react";
import { useGymStore } from "../store/useGymStore";

export default function ProfileHeader() {
  const user = useGymStore((s) => s.user);
  const level = useGymStore((s) => s.userLevel || 1);
  const exp = useGymStore((s) => s.userExp || 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return "Buenas noches";
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  const firstName = user?.name?.split(" ")[0] || "Atleta";
  const nextLevelExp = level * 100;
  const expPercent = Math.min(100, Math.max(0, (exp / nextLevelExp) * 100));

  return (
    <div className="flex items-center gap-3.5 animate-fade-in w-full">
      {user?.picture ? (
        <img
          src={user.picture}
          alt={user.name}
          className="w-12 h-12 rounded-2xl object-cover border-2 shadow-lg"
          style={{ borderColor: `rgba(var(--accent-color-rgb), 0.30)`, boxShadow: `0 10px 15px -3px rgba(var(--accent-color-rgb), 0.10)` }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-12 h-12 rounded-2xl gradient-lime-btn flex items-center justify-center text-slate-950 font-black text-lg shadow-lg" style={{ boxShadow: `0 10px 15px -3px rgba(var(--accent-color-rgb), 0.10)` }}>
          {firstName[0]?.toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{getGreeting()} 👋</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-base font-black text-slate-100 tracking-tight leading-none truncate">
            {firstName}
          </p>
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[9px] font-black text-[var(--accent-color)] uppercase tracking-wider" style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.15)`, borderColor: `rgba(var(--accent-color-rgb), 0.25)`, borderWidth: 1 }}>
            Lvl {level}
          </span>
        </div>
        
        {/* Barra de progreso de nivel */}
        <div className="w-32 mt-2 space-y-0.5">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-550 ease-out"
              style={{ width: `${expPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[7px] text-slate-500 font-black uppercase tracking-widest font-mono">
            <span>{exp} EXP</span>
            <span>{nextLevelExp} EXP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
