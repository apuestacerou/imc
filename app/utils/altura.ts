/**
 * Interpreta altura en metros o centímetros.
 * Valores > 3 se tratan como cm (p. ej. 170); ≤ 3 como metros (p. ej. 1,7).
 */
export function parseAlturaMetros(raw: string): number | null {
  const n = parseFloat(String(raw).replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n > 3) return n / 100;
  return n;
}

export function alturaCmDesdeInput(raw: string): number | null {
  const m = parseAlturaMetros(raw);
  if (m == null) return null;
  return Math.round(m * 100);
}
