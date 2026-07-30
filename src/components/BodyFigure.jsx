import React from "react";
import { MUSCLE_COLORS } from "../data/exercises";

/**
 * BodyFigure — Figura anatómica humana en SVG (frontal y/o dorsal) con
 * resaltado por grupo muscular. Vectorial: nítida en cualquier pantalla,
 * pesa ~0 KB y hereda los colores del sistema de diseño.
 *
 * Simetría perfecta garantizada: cada músculo se define solo para el lado
 * izquierdo y se espeja con transform sobre el eje x=50.
 *
 * Props:
 *  - muscle: grupo muscular a resaltar ("Pecho", "Espalda", ... o null)
 *  - view: "auto" | "front" | "back" | "both"
 *  - width: ancho en px del conjunto (por defecto 140)
 *  - glow: halo luminoso en el músculo resaltado (por defecto true)
 */

const MUSCLE_VIEWS = {
  Pecho: "front",
  Espalda: "back",
  Hombro: "both",
  Bíceps: "front",
  Tríceps: "back",
  Pierna: "both",
  Core: "front",
  Cardio: "both",
};

// Grupos que se iluminan por vista para cada músculo
const HIGHLIGHT_MAP = {
  front: {
    Pecho: ["chest"],
    Hombro: ["delts"],
    Bíceps: ["biceps", "forearms"],
    Core: ["abs", "obliques"],
    Pierna: ["quads", "shins"],
    Cardio: ["chest", "delts", "biceps", "forearms", "abs", "obliques", "quads", "shins"],
  },
  back: {
    Espalda: ["traps", "lats", "lowerback"],
    Hombro: ["delts"],
    Tríceps: ["triceps", "forearms"],
    Pierna: ["glutes", "hams", "calves"],
    Cardio: ["traps", "lats", "lowerback", "delts", "triceps", "forearms", "glutes", "hams", "calves"],
  },
};

const NEUTRAL_FILL = "rgba(148, 163, 184, 0.10)";
const NEUTRAL_STROKE = "rgba(148, 163, 184, 0.28)";
const MUSCLE_OFF_FILL = "rgba(148, 163, 184, 0.14)";
const MUSCLE_OFF_STROKE = "rgba(148, 163, 184, 0.32)";

// Espeja los hijos respecto al eje vertical x=50 (simetría perfecta)
function Mirror({ children }) {
  return (
    <>
      {children}
      <g transform="translate(100 0) scale(-1 1)">{children}</g>
    </>
  );
}

function MuscleGroup({ id, activeGroups, color, glow, children }) {
  const active = activeGroups.includes(id);
  return (
    <g
      fill={active ? color : MUSCLE_OFF_FILL}
      stroke={active ? color : MUSCLE_OFF_STROKE}
      strokeWidth="0.7"
      strokeLinejoin="round"
      style={
        active && glow
          ? { filter: `drop-shadow(0 0 5px ${color})` }
          : undefined
      }
      opacity={active ? 1 : undefined}
    >
      {children}
    </g>
  );
}

function NeutralParts() {
  return (
    <g fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} strokeWidth="0.7">
      {/* Cabeza */}
      <ellipse cx="50" cy="13" rx="8.5" ry="10" />
      {/* Cuello */}
      <path d="M45 21 L55 21 L53.5 30 L46.5 30 Z" />
      {/* Manos */}
      <Mirror>
        <rect x="26.5" y="116" width="7.5" height="9" rx="2.5" />
      </Mirror>
      {/* Pelvis */}
      <path d="M41 102 L59 102 L56.5 117 L43.5 117 Z" />
      {/* Rodillas */}
      <Mirror>
        <ellipse cx="44" cy="184.5" rx="4.4" ry="5.2" />
      </Mirror>
      {/* Pies */}
      <Mirror>
        <path d="M40 229 L48.5 229 L48.5 237.5 L38.5 237.5 C36.8 234.5 37.5 231 40 229 Z" />
      </Mirror>
    </g>
  );
}

function FrontFigure({ activeGroups, color, glow }) {
  return (
    <svg viewBox="0 0 100 250" className="h-full w-full" role="img" aria-label="Figura muscular frontal">
      <NeutralParts />

      {/* Puente cuello→hombro (trapecio frontal, neutro) */}
      <g fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} strokeWidth="0.7">
        <Mirror>
          <path d="M46 24.5 C41 26.5 37 29.5 35 33 L44.5 33.5 C46.5 30.5 47.5 27 46 24.5 Z" />
        </Mirror>
      </g>

      {/* Pectoral */}
      <MuscleGroup id="chest" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M49 33 L49 58 C41.5 57 34 51.5 33.5 44 C33 36.5 41 32.5 49 33 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Deltoides */}
      <MuscleGroup id="delts" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M24 45 C22 36 26 29 32 28 C39 27 44 33 43 41 C42 48 36 52 30 51 C26 50.5 24.5 48 24 45 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Bíceps */}
      <MuscleGroup id="biceps" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M27 53 C24 60 23 70 25 78 C26.5 83 32 84 34 79 C36 71 36 61 34 54 C32 50 29 50 27 53 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Antebrazos */}
      <MuscleGroup id="forearms" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M26 85 C24 93 24 105 27 113 C29 116.5 34 115 35 109 C36 101 35 92 34 85 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Abdominales */}
      <MuscleGroup id="abs" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <rect x="42.5" y="62.5" width="6" height="7" rx="2" />
          <rect x="42.5" y="71.5" width="6" height="7" rx="2" />
          <rect x="42.5" y="80.5" width="6" height="7" rx="2" />
          <rect x="43.5" y="89.5" width="5" height="6.5" rx="2" />
        </Mirror>
      </MuscleGroup>

      {/* Oblicuos */}
      <MuscleGroup id="obliques" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M37 62 C34.5 74 34.5 88 37.5 98.5 L41 96.5 L41 64 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Cuádriceps */}
      <MuscleGroup id="quads" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M40 118 C36 128 34 146 36 162 C37 172 40 178 43.5 179 C47 180 49.3 176 49.5 168 C50 152 49 132 47.5 118 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Tibial anterior */}
      <MuscleGroup id="shins" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M40 190 C37 200 37 214 40 223 C42.5 227 47 226 48 220 C49 210 48 198 47 190 Z" />
        </Mirror>
      </MuscleGroup>
    </svg>
  );
}

function BackFigure({ activeGroups, color, glow }) {
  return (
    <svg viewBox="0 0 100 250" className="h-full w-full" role="img" aria-label="Figura muscular dorsal">
      <NeutralParts />

      {/* Trapecios */}
      <MuscleGroup id="traps" activeGroups={activeGroups} color={color} glow={glow}>
        <path d="M50 22 C44 23 38 27 35 33 C39 41 45 47 50 49 C55 47 61 41 65 33 C62 27 56 23 50 22 Z" />
      </MuscleGroup>

      {/* Deltoides posterior */}
      <MuscleGroup id="delts" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M24 45 C22 36 26 29 32 28 C39 27 44 33 43 41 C42 48 36 52 30 51 C26 50.5 24.5 48 24 45 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Dorsales */}
      <MuscleGroup id="lats" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M33 54 C27 60 25 69 28 79 C32 92 40 103 46 109 C48 111 49.5 109.5 49.5 106 L49.5 62 C44 56 38 52 33 54 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Zona lumbar */}
      <MuscleGroup id="lowerback" activeGroups={activeGroups} color={color} glow={glow}>
        <rect x="43.5" y="112" width="13" height="12" rx="3" />
      </MuscleGroup>

      {/* Tríceps */}
      <MuscleGroup id="triceps" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M27 53 C24 60 23 72 25 80 C27 85 33 85 35 79 C37 71 36 60 34 53 C32 50 29 50 27 53 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Antebrazos */}
      <MuscleGroup id="forearms" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M26 85 C24 93 24 105 27 113 C29 116.5 34 115 35 109 C36 101 35 92 34 85 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Glúteos */}
      <MuscleGroup id="glutes" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M37 122 C33 130 33 140 37 147 C42 152 49 150 49.5 143 L49.5 122 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Isquiotibiales */}
      <MuscleGroup id="hams" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M39 154 C36 165 36 177 39 185 C42 189.5 48 187.5 49 181 C50 170 49 160 47.5 154 Z" />
        </Mirror>
      </MuscleGroup>

      {/* Gemelos */}
      <MuscleGroup id="calves" activeGroups={activeGroups} color={color} glow={glow}>
        <Mirror>
          <path d="M40 191 C36 197 35 208 38 217 C40.5 224 47 223 48 215 C49 206 48 197 46 191 Z" />
        </Mirror>
      </MuscleGroup>
    </svg>
  );
}

export default function BodyFigure({
  muscle = null,
  view = "auto",
  width = 140,
  glow = true,
  className = "",
}) {
  const color = muscle ? MUSCLE_COLORS[muscle] || "var(--accent-color)" : null;
  const resolved = view === "auto" ? (muscle ? MUSCLE_VIEWS[muscle] || "front" : "front") : view;

  const views = resolved === "both" ? ["front", "back"] : [resolved];
  const figWidth = resolved === "both" ? width / 2 - 4 : width;

  return (
    <div
      className={`flex items-start justify-center gap-2 ${className}`}
      style={{ width: resolved === "both" ? width : figWidth }}
    >
      {views.map((v) => (
        <div key={v} style={{ width: figWidth, aspectRatio: "100 / 250" }}>
          {v === "front" ? (
            <FrontFigure
              activeGroups={muscle ? HIGHLIGHT_MAP.front[muscle] || [] : []}
              color={color}
              glow={glow}
            />
          ) : (
            <BackFigure
              activeGroups={muscle ? HIGHLIGHT_MAP.back[muscle] || [] : []}
              color={color}
              glow={glow}
            />
          )}
        </div>
      ))}
    </div>
  );
}
