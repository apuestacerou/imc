/** Alineado con OMS en la app: 5–19 años → referencia niños; resto → adultos. */
export function imcModoDesdeEdad(edad: number): "adulto" | "nino" {
  if (edad >= 5 && edad <= 19) return "nino";
  return "adulto";
}
