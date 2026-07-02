import React, { useEffect, useRef } from "react";
import { Clock, Dumbbell, Flame, Trophy, Zap, X, TrendingUp } from "lucide-react";

// Confeti en canvas para celebrar el final del entreno
function CelebrationConfetti({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#84cc16", "#06b6d4", "#f43f5e", "#f59e0b", "#a855f7", "#f97316", "#eab308"];
    const particles = Array.from({ length: 120 }).map(() => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 60,
      y: window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 18 - 8,
      radius: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
      alpha: 1,
      decay: Math.random() * 0.012 + 0.006,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillActive = false;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        stillActive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (stillActive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[300]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function StatPill({ icon: Icon, value, label, color, delay }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 py-3 animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <p className="text-lg font-black text-slate-100 tabular-nums leading-none">
        {value}
      </p>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

export default function WorkoutSummarySheet({
  isOpen,
  summary,
  onClose,
}) {
  if (!isOpen || !summary) return null;

  const {
    duration = 0,
    totalVolume = 0,
    setsCompleted = 0,
    calories = 0,
    prsBeaten = 0,
    expEarned = 0,
    routineName = "",
    routineEmoji = "💪",
    weightUnit = "kg",
  } = summary;

  const durationMins = Math.floor(duration / 60);
  const durationSecs = duration % 60;
  const durationStr =
    durationMins > 0
      ? `${durationMins}m ${durationSecs}s`
      : `${durationSecs}s`;

  const isNewPR = prsBeaten > 0;

  return (
    <>
      <CelebrationConfetti active={isNewPR} />

      <div className="fixed inset-0 z-[250] flex items-end justify-center animate-fade-in">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Sheet */}
        <div
          className="relative w-full max-w-md bg-slate-900 rounded-t-[2.5rem] p-6 pb-8 animate-slide-up-sheet safe-bottom shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
          style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: `rgba(var(--accent-color-rgb), 0.20)` }}
        >
          {/* Glow superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-32 rounded-full blur-[50px] pointer-events-none" style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.10)` }} />

          {/* Handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-slate-700" />
          </div>

          {/* Header */}
          <div className="relative flex flex-col items-center text-center space-y-2 mb-5 animate-scale-in">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl animate-breathe ${
                isNewPR
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500 shadow-orange-500/30"
                  : "bg-gradient-to-br from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)]"
              }`}
            >
              {isNewPR ? "🏆" : routineEmoji}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)]">
                {isNewPR ? "¡Nuevo Récord!" : "¡Entrenamiento Completado!"}
              </p>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight mt-1">
                {routineEmoji} {routineName}
              </h2>
            </div>
          </div>

          {/* Grid de stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <StatPill
              icon={Clock}
              value={durationStr}
              label="Duración"
              color="#3b82f6"
              delay={0.05}
            />
            <StatPill
              icon={Dumbbell}
              value={totalVolume.toLocaleString()}
              label={`Vol. ${weightUnit}`}
              color="var(--accent-color)"
              delay={0.12}
            />
            <StatPill
              icon={Zap}
              value={setsCompleted}
              label="Series"
              color="#06b6d4"
              delay={0.19}
            />
          </div>

          {/* Filas de calorías / PR / EXP */}
          <div className="space-y-2 mb-6">
            <div
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-950/50 border border-white/5 animate-slide-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Flame size={16} className="text-orange-500" />
                </div>
                <span className="text-sm font-bold text-slate-300">
                  Calorías estimadas
                </span>
              </div>
              <span className="text-sm font-black text-orange-500 tabular-nums">
                ~{calories} kcal
              </span>
            </div>

            {prsBeaten > 0 && (
              <div
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-yellow-500/8 border border-yellow-500/20 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                    <Trophy size={16} className="text-yellow-500" />
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    Récords Personales batidos
                  </span>
                </div>
                <span className="text-sm font-black text-yellow-500 tabular-nums">
                  +{prsBeaten}
                </span>
              </div>
            )}

            <div
              className="flex items-center justify-between px-4 py-3 rounded-2xl animate-slide-up"
              style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.08)`, borderColor: `rgba(var(--accent-color-rgb), 0.2)`, animationDelay: "0.35s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `rgba(var(--accent-color-rgb), 0.15)` }}>
                  <TrendingUp size={16} style={{ color: "var(--accent-color)" }} />
                </div>
                <span className="text-sm font-bold text-slate-300">
                  Experiencia ganada
                </span>
              </div>
              <span
                className="text-sm font-black tabular-nums"
                style={{ color: "var(--accent-color)" }}
              >
                +{expEarned} EXP
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm uppercase tracking-wider press-scale"
            >
              Cerrar
            </button>
            <a
              href="/history"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl gradient-lime-btn text-slate-950 font-black text-sm uppercase tracking-wider press-scale shadow-lg text-center"
              style={{ boxShadow: `0 10px 15px -3px rgba(var(--accent-color-rgb), 0.15)` }}
            >
              Ver Historial
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
