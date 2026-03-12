/**
 * Lógica de cálculo del IMC (Índice de Masa Corporal).
 * Fórmula: IMC = peso (kg) / altura (m)²
 * Devuelve el valor, la categoría según OMS, un color y la posición en la barra (0-100%).
 */

export function calcularIMCLogica(peso: number, altura: number) {
  const imc = peso / (altura * altura);

  let categoria = "";
  let color = "";
  let posicion = 0;

  // Rangos según estándares OMS (kg/m²)
  if (imc < 18.5) {
    categoria = "Bajo peso";
    color = "blue";
    posicion = 10;
  } else if (imc < 25) {
    categoria = "Normal";
    color = "green";
    posicion = 35;
  } else if (imc < 30) {
    categoria = "Sobrepeso";
    color = "orange";
    posicion = 60;
  } else {
    categoria = "Obesidad";
    color = "red";
    posicion = 85;
  }

  return { imc, categoria, color, posicion };
}