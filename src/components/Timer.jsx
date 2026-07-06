import React, { useEffect, useState, useRef } from "react";
import { Plus, Minus, Volume2, VolumeX } from "lucide-react";

const speak = (text) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-ES";
    utter.rate = 1.1;
    utter.pitch = 1;
    utter.volume = 0.8;
    window.speechSynthesis.speak(utter);
  } catch {
    // Silenciar errores
  }
};

const playTone = (freq, duration, type = "sine") => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration,
    );
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Audio Context blocked or not supported:", err);
  }
};

export default function Timer({
  durationSeconds = 90,
  isActive,
  onComplete,
  onClose,
}) {
  // Basado en timestamps (Date.now()), no en contador de intervalos: sobrevive
  // a pantalla bloqueada / tab en segundo plano donde setInterval se pausa.
  const [endAt, setEndAt] = useState(() => Date.now() + durationSeconds * 1000);
  const [currentDuration, setCurrentDuration] = useState(durationSeconds);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fitpulse-voice-cues") !== "false";
    }
    return true;
  });
  const lastAnnouncedRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fitpulse-voice-cues", String(voiceEnabled));
    }
  }, [voiceEnabled]);

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onClose]);

  // Reiniciar al activarse (nuevo descanso)
  useEffect(() => {
    if (!isActive) return;
    setCurrentDuration(durationSeconds);
    setEndAt(Date.now() + durationSeconds * 1000);
    setTimeLeft(durationSeconds);
    lastAnnouncedRef.current = null;
    completedRef.current = false;
  }, [isActive, durationSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining > 0 && remaining <= 3 && lastAnnouncedRef.current !== remaining) {
        lastAnnouncedRef.current = remaining;
        playTone(550, 0.08, "sine");
        if (voiceEnabled) speak(remaining === 3 ? "Tres" : remaining === 2 ? "Dos" : "Uno");
      } else if (
        remaining === Math.floor(currentDuration / 2) &&
        remaining > 5 &&
        lastAnnouncedRef.current !== "half"
      ) {
        lastAnnouncedRef.current = "half";
        if (voiceEnabled) speak("Mitad del descanso");
      }

      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        playTone(523.25, 0.12, "triangle");
        setTimeout(() => playTone(659.25, 0.12, "triangle"), 80);
        setTimeout(() => playTone(783.99, 0.22, "triangle"), 160);
        if (voiceEnabled) speak("¡A por ello! Descanso terminado");
        if (navigator.vibrate) navigator.vibrate([150, 80, 150, 80, 300]);
        if (onComplete) onComplete();
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    // Recalcular al instante al volver de segundo plano (pantalla bloqueada, cambio de tab)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isActive, endAt, currentDuration, voiceEnabled, onComplete]);

  if (!isActive) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = currentDuration > 0 ? timeLeft / currentDuration : 0;

  // SVG circle calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const adjustTime = (delta) => {
    setEndAt((prev) => Math.max(Date.now(), prev + delta * 1000));
    setCurrentDuration((prev) => Math.max(15, prev + delta));
    completedRef.current = false;
  };

  const setPreset = (seconds) => {
    setEndAt(Date.now() + seconds * 1000);
    setCurrentDuration(seconds);
    completedRef.current = false;
  };

  const PRESETS = [30, 60, 90, 120, 180];

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 px-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Label */}
        <div className="animate-slide-down flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-color)]">
            Descanso
          </span>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center press-scale"
            title={voiceEnabled ? "Silenciar avisos de voz" : "Activar avisos de voz"}
          >
            {voiceEnabled ? (
              <Volume2 size={13} className="text-[var(--accent-color)]" />
            ) : (
              <VolumeX size={13} className="text-slate-500" />
            )}
          </button>
        </div>

        {/* Circular timer */}
        <div className="relative w-52 h-52 animate-scale-in">
          {/* Glow ambiental */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: "var(--accent-color)" }}
          />
          {/* Background ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              className="stroke-slate-800/40"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              style={{ filter: "drop-shadow(0 0 4px rgba(var(--accent-color-rgb), 0.5))" }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-mono text-5xl font-black tabular-nums tracking-tight ${timeLeft === 0 ? "text-[var(--accent-color)] animate-countdown-pulse" : "text-slate-100"}`}
            >
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
            {timeLeft === 0 ? (
              <span className="text-[var(--accent-color)] text-sm font-bold mt-1 animate-fade-in">
                ¡A por ello!
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Respira y recupérate
              </span>
            )}
          </div>
        </div>

        {/* Presets rápidos */}
        <div className="flex items-center gap-2 animate-slide-up">
          {PRESETS.map((p) => {
            const active = currentDuration === p;
            return (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all press-scale ${
                  active
                    ? "bg-[var(--accent-color)] text-slate-950 shadow-md"
                    : "bg-slate-800/60 text-slate-400 border border-slate-700"
                }`}
              >
                {p < 60 ? `${p}s` : `${p / 60}m`}
              </button>
            );
          })}
        </div>

        {/* +/- buttons */}
        <div className="flex items-center gap-5 animate-slide-up delay-1">
          <button
            onClick={() => adjustTime(-15)}
            className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-90 transition-transform"
          >
            <Minus size={22} />
          </button>

          <span className="text-xs text-slate-500 font-semibold w-10 text-center">
            15s
          </span>

          <button
            onClick={() => adjustTime(15)}
            className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-90 transition-transform"
          >
            <Plus size={22} />
          </button>
        </div>

        {/* Skip button */}
        <button
          onClick={onClose}
          className="mt-2 px-8 py-3.5 rounded-2xl gradient-lime-btn text-slate-950 font-bold text-sm press-scale animate-slide-up delay-2 shadow-lg"
        >
          Saltar descanso
        </button>
      </div>
    </div>
  );
}
