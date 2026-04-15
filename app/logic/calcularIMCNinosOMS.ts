import {
  WHO_BMI_FOR_AGE_LMS,
  type WhoLms,
  type WhoSex,
} from "./whoBmiLmsData";

const MIN_MONTH = 61;
const MAX_MONTH = 228;

/** z-score IMC para la edad (método LMS, OMS 2007). */
export function imcZScoreOMS(bmi: number, lms: WhoLms): number {
  const { L, M, S } = lms;
  if (M <= 0 || S <= 0) return NaN;
  if (Math.abs(L) < 1e-8) {
    return Math.log(bmi / M) / S;
  }
  return (Math.pow(bmi / M, L) - 1) / (L * S);
}

function lmsParaMes(mes: number, sexo: WhoSex): WhoLms {
  const idx = mes - MIN_MONTH;
  const row = WHO_BMI_FOR_AGE_LMS[idx];
  return sexo === "masculino" ? row.boys : row.girls;
}

/** Interpolación lineal de L, M y S entre meses completados (referencia mensual OMS). */
function lmsInterpolado(edadMeses: number, sexo: WhoSex): WhoLms {
  const clamped = Math.min(MAX_MONTH, Math.max(MIN_MONTH, edadMeses));
  const inferior = Math.floor(clamped);
  const superior = Math.ceil(clamped);
  if (inferior === superior) {
    return lmsParaMes(inferior, sexo);
  }
  const t = clamped - inferior;
  const a = lmsParaMes(inferior, sexo);
  const b = lmsParaMes(superior, sexo);
  return {
    L: a.L + (b.L - a.L) * t,
    M: a.M + (b.M - a.M) * t,
    S: a.S + (b.S - a.S) * t,
  };
}

function clasificarZ(z: number): {
  categoria: string;
  colorResultado: string;
  posicion: number;
} {
  let categoria = "";
  let colorResultado = "green";
  if (z < -3) {
    categoria = "Delgadez severa";
    colorResultado = "#1565c0";
  } else if (z < -2) {
    categoria = "Delgadez";
    colorResultado = "#1976d2";
  } else if (z <= 1) {
    categoria = "IMC adecuado para la edad";
    colorResultado = "#2e7d32";
  } else if (z <= 2) {
    categoria = "Sobrepeso";
    colorResultado = "#ef6c00";
  } else {
    categoria = "Obesidad";
    colorResultado = "#c62828";
  }

  const posicion = posicionMarcadorZ(z);

  return { categoria, colorResultado, posicion };
}

/** Marca en la barra alineada al eje -3 a +3 DE (0–100 %). Fuera del rango, al borde. */
export function posicionMarcadorZ(z: number): number {
  if (z <= -3) return 0;
  if (z >= 3) return 100;
  return ((z + 3) / 6) * 100;
}

function recomendacionPara(z: number): string {
  if (z < -3) {
    return (
      "Puntaje muy por debajo de la referencia OMS: prioriza valoración pediátrica urgente " +
      "para descartar causas y recibir un plan seguro (alimentación y seguimiento)."
    );
  }
  if (z < -2) {
    return (
      "Por debajo de la referencia OMS: conviene revisión con pediatría o nutrición infantil. " +
      "En casa, ofrece comidas completas regulares y evita saltarse comidas sin indicación profesional."
    );
  }
  if (z <= 1) {
    return (
      "Según la curva OMS, el IMC para la edad está en rango adecuado. Mantén rutinas de sueño, " +
      "agua, fruta/verdura y juego o deporte casi todos los días."
    );
  }
  if (z <= 2) {
    return (
      "Por encima de la mediana OMS (sobrepeso para la edad): trabaja con el pediatra " +
      "hábitos de pantalla, bebidas azucaradas y porciones; suma actividad divertida en familia."
    );
  }
  return (
    "Obesidad para la edad según OMS: hace falta plan médico y familiar (alimentación, sueño, " +
    "actividad segura); evita restricciones severas sin supervisión."
  );
}

export type ResultadoIMCNino =
  | { error: string }
  | {
      imc: number;
      zScore: number;
      categoria: string;
      recomendacion: string;
      colorResultado: string;
      posicion: number;
      edadMesesUsados: number;
      referencia: string;
    };

/**
 * IMC para niños/as 5–19 años según referencia OMS 2007 (IMC para la edad, puntos de corte por DE).
 * Cortes: delgadez severa &lt; -3 DE; delgadez &lt; -2 DE; adecuado -2 a +1 DE; sobrepeso +1 a +2 DE; obesidad &gt; +2 DE.
 */
export function calcularIMCNinosOMS(
  peso: string,
  altura: string,
  edadAnios: string,
  sexo: WhoSex | ""
): ResultadoIMCNino {
  if (!peso || !altura || !edadAnios || !sexo) {
    return { error: "Completa peso, altura, edad y sexo." };
  }

  const pesoNum = parseFloat(peso.replace(",", "."));
  const alturaNum = parseFloat(altura.replace(",", "."));
  const edadNum = parseFloat(edadAnios.replace(",", "."));

  if (
    !Number.isFinite(pesoNum) ||
    !Number.isFinite(alturaNum) ||
    !Number.isFinite(edadNum)
  ) {
    return { error: "Usa solo números válidos." };
  }

  if (pesoNum <= 0 || alturaNum <= 0) {
    return { error: "Peso y altura deben ser mayores que cero." };
  }

  if (edadNum < 5 || edadNum >= 20) {
    return {
      error:
        "La referencia OMS de IMC para la edad aplica entre 5 y 19 años. Para adultos usa la calculadora principal.",
    };
  }

  const edadMeses = edadNum * 12;

  const imc = pesoNum / (alturaNum * alturaNum);
  const lms = lmsInterpolado(edadMeses, sexo as WhoSex);
  const zScore = imcZScoreOMS(imc, lms);

  if (!Number.isFinite(zScore)) {
    return { error: "No se pudo calcular el puntaje Z. Revisa los datos." };
  }

  const { categoria, colorResultado, posicion } = clasificarZ(zScore);
  const recomendacion = recomendacionPara(zScore);

  const edadMesesUsados = Math.min(
    MAX_MONTH,
    Math.max(MIN_MONTH, edadMeses)
  );

  return {
    imc,
    zScore,
    categoria,
    recomendacion,
    colorResultado,
    posicion,
    edadMesesUsados,
    referencia:
      "Referencia OMS 2007 — IMC para la edad (5–19 años). No sustituye valoración clínica.",
  };
}
