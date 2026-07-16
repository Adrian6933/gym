// Genera una imagen del resumen de entreno en un canvas y la comparte
// (Web Share API) o la descarga como fallback. Mobile-first.

function getAccentColor() {
  if (typeof window === "undefined") return "#84cc16";
  const root = getComputedStyle(document.documentElement);
  let c = root.getPropertyValue("--accent-color").trim();
  if (!c) c = "#84cc16";
  // Si es formato rgb(...) lo pasamos a hex para gradientes
  if (c.startsWith("rgb")) {
    const nums = c.match(/\d+/g);
    if (nums && nums.length >= 3) {
      const toHex = (n) => parseInt(n, 10).toString(16).padStart(2, "0");
      c = `#${toHex(nums[0])}${toHex(nums[1])}${toHex(nums[2])}`;
    }
  }
  return c;
}

function withAlpha(hex, alpha) {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Renderiza el resumen de entreno en un canvas y devuelve el canvas.
 * @param {Object} summary - { duration, totalVolume, setsCompleted, calories, prsBeaten, expEarned, routineName, routineEmoji, weightUnit }
 */
export function renderWorkoutSummary(summary) {
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

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const accent = getAccentColor();

  // === Fondo ===
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0a0a0f");
  bg.addColorStop(1, "#15151f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Glow superior
  const glow = ctx.createRadialGradient(W / 2, 220, 40, W / 2, 220, 600);
  glow.addColorStop(0, withAlpha(accent, 0.18));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 500);

  // === Header ===
  const isNewPR = prsBeaten > 0;
  ctx.textAlign = "center";
  ctx.fillStyle = accent;
  ctx.font = "900 30px Inter, system-ui, sans-serif";
  ctx.fillText(
    isNewPR ? "¡NUEVO RÉCORD!" : "ENTRENAMIENTO COMPLETADO",
    W / 2,
    110,
  );

  // Emoji en círculo
  const circleR = 95;
  const circleY = 280;
  ctx.save();
  ctx.beginPath();
  ctx.arc(W / 2, circleY, circleR, 0, Math.PI * 2);
  const emojiGrad = ctx.createLinearGradient(
    W / 2 - circleR,
    circleY - circleR,
    W / 2 + circleR,
    circleY + circleR,
  );
  if (isNewPR) {
    emojiGrad.addColorStop(0, "#eab308");
    emojiGrad.addColorStop(1, "#f97316");
  } else {
    emojiGrad.addColorStop(0, accent);
    emojiGrad.addColorStop(1, withAlpha(accent, 0.75));
  }
  ctx.fillStyle = emojiGrad;
  ctx.shadowColor = withAlpha(accent, 0.4);
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();

  ctx.font = "110px serif";
  ctx.textBaseline = "middle";
  ctx.fillText(routineEmoji, W / 2, circleY + 6);
  ctx.textBaseline = "alphabetic";

  // Nombre rutina
  ctx.fillStyle = "#f1f5f9";
  ctx.font = "900 52px Inter, system-ui, sans-serif";
  const name = truncate(ctx, routineName, W - 120);
  ctx.fillText(name, W / 2, 440);

  // === Stats grid (3 columnas) ===
  const gridY = 540;
  const gridH = 200;
  const colW = (W - 160) / 3;
  const stats = [
    { value: formatDuration(duration), label: "Duración" },
    { value: totalVolume.toLocaleString("es-ES"), label: `Vol. ${weightUnit}` },
    { value: String(setsCompleted), label: "Series" },
  ];
  stats.forEach((s, i) => {
    const cx = 80 + colW * i + colW / 2;
    // valor
    ctx.fillStyle = "#f8fafc";
    ctx.font = "900 54px Inter, system-ui, sans-serif";
    ctx.fillText(s.value, cx, gridY + 90);
    // label
    ctx.fillStyle = "#64748b";
    ctx.font = "700 24px Inter, system-ui, sans-serif";
    ctx.fillText(s.label.toUpperCase(), cx, gridY + 140);
    // separador
    if (i < 2) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80 + colW * (i + 1), gridY + 30);
      ctx.lineTo(80 + colW * (i + 1), gridY + gridH - 40);
      ctx.stroke();
    }
  });

  // === Filas: calorías / PR / EXP ===
  const rows = [
    {
      label: "Calorías estimadas",
      value: `~${calories} kcal`,
      color: "#f97316",
    },
  ];
  if (prsBeaten > 0) {
    rows.push({
      label: "Récords personales",
      value: `+${prsBeaten}`,
      color: "#eab308",
    });
  }
  rows.push({
    label: "Experiencia",
    value: `+${expEarned} EXP`,
    color: accent,
  });

  const rowY = 800;
  rows.forEach((row, i) => {
    const y = rowY + i * 110;
    // fondo tarjeta
    roundRect(ctx, 80, y, W - 160, 86, 22);
    ctx.fillStyle = withAlpha(row.color, 0.1);
    ctx.fill();
    ctx.strokeStyle = withAlpha(row.color, 0.25);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // icono placeholder (círculo)
    ctx.save();
    ctx.beginPath();
    ctx.arc(135, y + 43, 26, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(row.color, 0.18);
    ctx.fill();
    ctx.restore();

    ctx.textAlign = "left";
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillText(row.label, 195, y + 53);

    ctx.textAlign = "right";
    ctx.fillStyle = row.color;
    ctx.font = "900 36px Inter, system-ui, sans-serif";
    ctx.fillText(row.value, W - 115, y + 54);
  });

  // === Footer ===
  ctx.textAlign = "center";
  ctx.fillStyle = accent;
  ctx.font = "900 34px Inter, system-ui, sans-serif";
  ctx.fillText("FitPulse", W / 2, H - 70);
  ctx.fillStyle = "#475569";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  const fecha = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  ctx.fillText(fecha, W / 2, H - 35);

  return canvas;
}

function truncate(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + "…").width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "…";
}

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/**
 * Comparte la imagen del resumen. Usa Web Share API con archivos si está
 * disponible; si no, la descarga como PNG.
 */
export async function shareWorkoutSummary(summary) {
  const canvas = renderWorkoutSummary(summary);
  const fileName = `fitpulse-${summary.routineName || "entreno"}.png`;

  const toBlob = () =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob falló"))),
        "image/png",
        0.95,
      );
    });

  const canShareFiles =
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [new File([""], "test.png", { type: "image/png" })] });

  try {
    if (canShareFiles) {
      const blob = await toBlob();
      const file = new File([blob], fileName, { type: "image/png" });
      await navigator.share({
        files: [file],
        title: `${summary.routineEmoji || ""} ${summary.routineName || "Entreno"}`,
        text: `Acabo de terminar "${summary.routineName}" en FitPulse 💪`,
      });
      return { shared: true };
    }
  } catch (err) {
    // Si el usuario cancela el share, no hacemos fallback (silencioso)
    if (err && err.name === "AbortError") return { shared: false, cancelled: true };
    // Si falla por otra razón, caemos al fallback de descarga
  }

  // Fallback: descargar la imagen
  const blob = await toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { shared: false, downloaded: true };
}