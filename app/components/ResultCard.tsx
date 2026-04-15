import React from "react";
import { Text, View } from "react-native";
import CursoPromoCard from "./CursoPromoCard";
import MotivacionNinos from "./MotivacionNinos";
import MunecoPorIMC from "./MunecoPorIMC";
import { styles } from "../styles/homeStyles";

type Props = {
  imc: number | null;
  categoria: string;
  recomendacion: string;
  colorResultado: string;
  posicionIndiador: number;
  /** Edad en años (texto del campo); menor de 18: sin curso, solo motivación. */
  edadTexto: string;
};

function esMenorDe18(edadTexto: string): boolean {
  const n = parseFloat(edadTexto.replace(",", "."));
  return Number.isFinite(n) && n < 18;
}

export default function ResultCard({
  imc,
  categoria,
  recomendacion,
  colorResultado,
  posicionIndiador,
  edadTexto,
}: Props) {
  if (!imc) return null;

  const mostrarSoloMotivacion = esMenorDe18(edadTexto);

  return (
    <View style={styles.card}>
      {mostrarSoloMotivacion ? (
        <>
          <Text>Tu IMC es:</Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            {imc.toFixed(2)}
          </Text>
        </>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <View style={{ marginRight: 12 }}>
            <MunecoPorIMC imc={imc} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text>Tu IMC es:</Text>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              {imc.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      <Text style={[styles.categoria, { color: colorResultado, marginTop: 12 }]}>
        {categoria}
      </Text>

      <Text style={{ marginTop: 10 }}>Recomendación: {recomendacion}</Text>

      {mostrarSoloMotivacion ? (
        <MotivacionNinos sexo="" categoria={categoria} />
      ) : (
        <CursoPromoCard />
      )}

      <Text style={styles.leyendaBarra}>
        Barra según IMC (escala orientativa 14–45): el triángulo marca tu valor dentro
        de cada franja (bajo peso · normal · sobrepeso · obesidad).
      </Text>

      <View style={styles.barraIMC}>
        <View style={[styles.seccion, { backgroundColor: "#1565c0" }]} />
        <View style={[styles.seccion, { backgroundColor: "#2e7d32" }]} />
        <View style={[styles.seccion, { backgroundColor: "#ef6c00" }]} />
        <View style={[styles.seccion, { backgroundColor: "#c62828" }]} />
      </View>

      <View style={styles.indicadorContainer}>
        <Text
          style={[
            styles.indicador,
            { left: `${Math.min(100, Math.max(0, posicionIndiador))}%` },
          ]}
        >
          ▲
        </Text>
      </View>
    </View>
  );
}
