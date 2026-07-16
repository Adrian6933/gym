// Filtra a solo dígitos + un punto decimal, con tope razonable para evitar
// NaN o valores absurdos que rompan volumen/calorías en stats.
export function sanitizeNumericInput(
  value,
  { maxValue = 999, allowDecimal = true } = {},
) {
  let cleaned = allowDecimal
    ? value.replace(/[^0-9.]/g, "")
    : value.replace(/[^0-9]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  if (cleaned !== "" && cleaned !== "." && parseFloat(cleaned) > maxValue) {
    cleaned = String(maxValue);
  }
  return cleaned;
}