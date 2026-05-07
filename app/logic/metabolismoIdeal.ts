/** Rango de peso (kg) para IMC entre 18.5 y 25 a la altura dada (m). */
export function rangoPesoIdealKg(alturaMetros: number): {
  minKg: number;
  maxKg: number;
} {
  const h = alturaMetros;
  const minKg = 18.5 * h * h;
  const maxKg = 25 * h * h;
  return {
    minKg: Math.round(minKg * 10) / 10,
    maxKg: Math.round(maxKg * 10) / 10,
  };
}

/** Mifflin–St Jeor (kcal/día), sedentario por defecto. */
export function metabolismoBasalKcal(params: {
  pesoKg: number;
  alturaCm: number;
  edad: number;
  genero: "masculino" | "femenino";
}): number {
  const { pesoKg, alturaCm, edad, genero } = params;
  const base =
    10 * pesoKg + 6.25 * alturaCm - 5 * edad + (genero === "masculino" ? 5 : -161);
  return Math.round(Math.max(0, base));
}
