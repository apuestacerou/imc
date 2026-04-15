/** Posición 0–100 % en la barra (4 franjas iguales: bajo peso, normal, sobrepeso, obesidad). */
export function posicionBarraAdulto(imc: number): number {
  const MIN = 14;
  const BP = 18.5;
  const N = 25;
  const S = 30;
  const MAX = 45;

  if (imc < MIN) return 0;
  if (imc > MAX) return 100;

  if (imc < BP) {
    return ((imc - MIN) / (BP - MIN)) * 25;
  }
  if (imc < N) {
    return 25 + ((imc - BP) / (N - BP)) * 25;
  }
  if (imc < S) {
    return 50 + ((imc - N) / (S - N)) * 25;
  }
  return 75 + ((imc - S) / (MAX - S)) * 25;
}

function recomendacionAdulto(imc: number, edadNum: number): string {
  const esMenor = edadNum < 18 && Number.isFinite(edadNum);

  if (imc < 18.5) {
    return (
      "Tu IMC sugiere bajo peso: prioriza ingestas regulares y alimentos densos en nutrientes " +
      "(proteínas, legumbres, frutos secos, cereales integrales). Si hay cansancio o pérdida " +
      "de peso no buscada, consulta con un profesional de la salud."
    );
  }

  if (imc < 25) {
    return (
      "IMC en rango saludable. Mantén una alimentación variada (verdura y proteína en cada comida), " +
      "hidratación, sueño regular y actividad física semanal (idealmente fuerza + cardio moderado)."
    );
  }

  if (imc < 30) {
    const cercaObesidad = imc >= 28.5;
    return (
      (cercaObesidad ? "Estás cerca del rango de obesidad. " : "") +
      "Conviene combinar más movimiento cotidiano (caminar, subir escaleras) con 2–3 sesiones " +
      "de fuerza a la semana y ajustar porciones, ultraprocesados y bebidas azucaradas. " +
      "Un nutricionista puede ayudarte con un plan sostenible."
    );
  }

  const obesidadGrave = imc >= 35;
  return (
    (esMenor
      ? "En menores, cualquier pauta debe estar guiada por pediatría. "
      : "") +
    (obesidadGrave
      ? "IMC muy elevado: prioriza seguridad (caminar, bici suave, natación) y valoración médica "
      : "Obesidad: suma actividad gradual y apoyo nutricional ") +
    "para un plan integral (salud cardiovascular, articulaciones y hábitos). Evita dietas extremas sin supervisión."
  );
}

export function calcularIMClogic(peso: string, altura: string, edad: string) {
  if (!peso || !altura || !edad) {
    return { error: "Por favor ingrese todos los campos" };
  }

  const pesoNum = parseFloat(peso.replace(",", "."));
  const alturaNum = parseFloat(altura.replace(",", "."));
  const edadNum = parseFloat(edad.replace(",", "."));

  if (
    !Number.isFinite(pesoNum) ||
    !Number.isFinite(alturaNum) ||
    !Number.isFinite(edadNum)
  ) {
    return { error: "Usa solo números válidos en peso, altura y edad." };
  }

  if (pesoNum <= 0 || alturaNum <= 0) {
    return { error: "Peso y altura deben ser mayores que cero." };
  }

  const resultado = pesoNum / (alturaNum * alturaNum);
  const posicion = posicionBarraAdulto(resultado);

  let categoria = "";
  let recomendacion = "";
  let colorResultado = "black";

  if (edadNum < 18) {
    categoria = "IMC calculado para menor de edad";
  } else {
    categoria = "IMC calculado para adulto";
  }

  if (resultado < 18.5) {
    categoria = "Bajo peso";
    colorResultado = "#1565c0";
  } else if (resultado < 25) {
    categoria = "Normal";
    colorResultado = "#2e7d32";
  } else if (resultado < 30) {
    categoria = "Sobrepeso";
    colorResultado = "#ef6c00";
  } else {
    categoria = "Obesidad";
    colorResultado = "#c62828";
  }

  recomendacion = recomendacionAdulto(resultado, edadNum);

  return {
    imc: resultado,
    posicion,
    categoria,
    recomendacion,
    colorResultado,
  };
}
