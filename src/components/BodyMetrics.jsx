import React, { useState, useMemo, useEffect } from "react";
import { X, Plus, TrendingDown, TrendingUp, Minus, Scale, Ruler, Trash2, Calendar } from "lucide-react";
import { useGymStore } from "../store/useGymStore";
import ConfirmDialog from "./ConfirmDialog";

const FIELDS = [
  { key: "weight", label: "Peso", unit: "kg", icon: Scale, color: "#84cc16" },
  { key: "bodyFat", label: "Grasa", unit: "%", icon: null, color: "#f59e0b" },
  { key: "chest", label: "Pecho", unit: "cm", icon: Ruler, color: "#ef4444" },
  { key: "waist", label: "Cintura", unit: "cm", icon: Ruler, color: "#06b6d4" },
  { key: "arm", label: "Brazo", unit: "cm", icon: Ruler, color: "#a855f7" },
  { key: "leg", label: "Pierna", unit: "cm", icon: Ruler, color: "#10b981" },
];

function MiniLineChart({ data, color, height = 80, suffix = "" }) {
  if (!data || data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-[10px] text-slate-600 italic"
        style={{ height: `${height}px` }}
      >
        {data?.length === 1 ? `Actual: ${data[0].value}${suffix}` : "Sin datos"}
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const reversed = [...data].reverse();
  const width = 100 / (reversed.length - 1);

  const points = reversed
    .map((d, i) => {
      const x = i * width;
      const y = 100 - ((d.value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`bm-grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={areaPoints}
          fill={`url(#bm-grad-${color.replace("#", "")})`}
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {reversed.map((d, i) => {
          const x = i * width;
          const y = 100 - ((d.value - min) / range) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.2"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

function MetricCard({ field, data, latest }) {
  const Icon = field.icon;
  const trend =
    data.length >= 2 ? data[0].value - data[1].value : 0;

  const TrendIcon = trend > 0.1 ? TrendingUp : trend < -0.1 ? TrendingDown : Minus;
  const trendColor = trend > 0.1 ? "text-orange-400" : trend < -0.1 ? "text-lime-500" : "text-slate-500";

  return (
    <div className="gradient-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${field.color}15` }}
            >
              <Icon size={14} style={{ color: field.color }} />
            </div>
          )}
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {field.label}
          </p>
        </div>
        {trend !== 0 && data.length >= 2 && (
          <div className={`flex items-center gap-0.5 text-[10px] font-black ${trendColor}`}>
            <TrendIcon size={10} />
            {Math.abs(trend).toFixed(1)}
            {field.unit}
          </div>
        )}
      </div>
      {latest ? (
        <>
          <p className="text-2xl font-black text-slate-100 tabular-nums">
            {latest.value}
            <span className="text-xs font-bold text-slate-500 ml-1">{field.unit}</span>
          </p>
          <div className="mt-2">
            <MiniLineChart data={data} color={field.color} height={50} suffix={field.unit} />
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-600 italic mt-2">Sin registros</p>
      )}
    </div>
  );
}

export default function BodyMetrics({ isOpen, onClose }) {
  const { bodyMetrics, addBodyMetric, deleteBodyMetric } = useGymStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    arm: "",
    leg: "",
    notes: "",
  });

  const seriesData = useMemo(() => {
    const data = {};
    FIELDS.forEach((f) => {
      data[f.key] = bodyMetrics
        .filter((m) => m[f.key] != null && m[f.key] !== "")
        .map((m) => ({ value: parseFloat(m[f.key]), date: m.date }));
    });
    return data;
  }, [bodyMetrics]);

  const latestByField = useMemo(() => {
    const latest = {};
    FIELDS.forEach((f) => {
      const series = seriesData[f.key];
      latest[f.key] = series && series.length > 0 ? series[0] : null;
    });
    return latest;
  }, [seriesData]);

  const handleSave = () => {
    const cleaned = {};
    let hasValue = false;
    FIELDS.forEach((f) => {
      if (form[f.key] && form[f.key] !== "") {
        cleaned[f.key] = parseFloat(form[f.key]);
        hasValue = true;
      }
    });
    if (!hasValue) return;
    if (form.notes) cleaned.notes = form.notes;
    addBodyMetric(cleaned);
    setForm({ weight: "", bodyFat: "", chest: "", waist: "", arm: "", leg: "", notes: "" });
    setShowForm(false);
  };

  const [deleteId, setDeleteId] = useState(null);
  const handleDelete = (id) => setDeleteId(id);

  // Equivalente por teclado del cierre por click en el backdrop
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (showForm) setShowForm(false);
      else onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showForm, onClose]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
    <div
      className="fixed inset-0 z-[150] flex flex-col bg-[#0a0a0f] animate-fade-in"
      onClick={onClose}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
      <div
        className="relative flex-1 overflow-y-auto animate-slide-up-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 safe-top gradient-glass border-b border-white/5">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center text-slate-200 press-scale"
            >
              <X size={20} />
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                Progreso Físico
              </p>
              <h1 className="text-base font-black text-slate-100 tracking-tight">
                Métricas Corporales
              </h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-10 h-10 rounded-xl gradient-lime-btn text-slate-950 flex items-center justify-center press-scale shadow-lg"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="px-4 pt-4 pb-28 space-y-4">
          {/* Grid de métricas */}
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <MetricCard
                key={f.key}
                field={f}
                data={seriesData[f.key]}
                latest={latestByField[f.key]}
              />
            ))}
          </div>

          {/* Historial de mediciones */}
          <div className="gradient-card rounded-2xl p-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Calendar size={13} className="text-cyan-500" />
              Historial de Mediciones
            </h3>
            {bodyMetrics.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6 italic">
                No hay mediciones todavía. Toca el botón + para añadir la primera.
              </p>
            ) : (
              <div className="space-y-2">
                {bodyMetrics.slice(0, 10).map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-950/40 rounded-xl p-3 flex items-start gap-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {new Date(m.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {FIELDS.filter((f) => m[f.key] != null && m[f.key] !== "").map(
                          (f) => (
                            <span
                              key={f.key}
                              className="text-[11px] font-bold text-slate-300"
                            >
                              <span className="text-slate-500">{f.label}:</span>{" "}
                              <span style={{ color: f.color }}>
                                {parseFloat(m[f.key])}
                                {f.unit}
                              </span>
                            </span>
                          )
                        )}
                      </div>
                      {m.notes && (
                        <p className="text-[10px] text-slate-500 italic mt-1.5">
                          {m.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-red-400 press-scale flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Sheet */}
      {showForm && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- equivalente por teclado: Escape (ver useEffect arriba)
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation, no es una interacción real */}
          <div
            className="relative w-full max-w-md bg-slate-900 rounded-t-[2.5rem] p-6 pb-8 animate-slide-up-sheet safe-bottom shadow-[0_-20px_60px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-black text-slate-100 tracking-tight">
                  Nueva Medición
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  Deja vacío los campos que no quieras registrar
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 press-scale"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              {FIELDS.map((f) => (
                <div
                  key={f.key}
                  className="bg-slate-950/50 rounded-xl p-3 border border-white/5"
                >
                  <label
                    htmlFor={`metric-${f.key}`}
                    className="text-[10px] font-bold uppercase tracking-wider block mb-1.5"
                    style={{ color: f.color }}
                  >
                    {f.label} ({f.unit})
                  </label>
                  <input
                    id={`metric-${f.key}`}
                    type="number"
                    step="0.1"
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    placeholder={f.key === "weight" ? "Ej. 75.5" : "0.0"}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-slate-100 text-sm font-bold focus:outline-none focus:border-slate-700 tabular-nums"
                  />
                </div>
              ))}
              <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                <label
                  htmlFor="metric-notes"
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5"
                >
                  Notas (opcional)
                </label>
                <textarea
                  id="metric-notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Cómo te sentías, momento del día, etc."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-slate-100 text-xs focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-5 py-4 rounded-2xl gradient-lime-btn text-slate-950 font-black text-sm uppercase tracking-wider press-scale shadow-lg shadow-[var(--accent-color)]/20"
            >
              Guardar Medición
            </button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="¿Eliminar esta medición?"
        onConfirm={() => {
          deleteBodyMetric(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
