import React from "react";
import { Text, View } from "react-native";
import MotivacionNinos from "./MotivacionNinos";
import type { WhoSex } from "../logic/whoBmiLmsData";
import { styles } from "../styles/homeStyles";

type Props = {
  imc: number | null;
  zScore: number | null;
  categoria: string;
  recomendacion: string;
  colorResultado: string;
  posicionIndiador: number;
  referencia: string;
  sexo: WhoSex | "";
};

export default function ResultCardNinos({
  imc,
  zScore,
  categoria,
  recomendacion,
  colorResultado,
  posicionIndiador,
  referencia,
  sexo,
}: Props) {
  if (imc == null || zScore == null) return null;

  const x = Math.min(100, Math.max(0, posicionIndiador));

  return (
    <View style={[styles.card, { marginTop: 16 }]}>
      <Text>Tu IMC es:</Text>

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        {imc.toFixed(2)}
      </Text>

      <Text style={{ marginTop: 8 }}>
        Puntaje Z (OMS, IMC para la edad):{" "}
        <Text style={{ fontWeight: "700" }}>{zScore.toFixed(2)} DE</Text>
      </Text>

      <Text style={[styles.categoria, { color: colorResultado, marginTop: 8 }]}>
        {categoria}
      </Text>

      <Text style={{ marginTop: 10, fontSize: 13, color: "#555" }}>
        {referencia}
      </Text>

      <Text style={{ marginTop: 10 }}>Recomendación: {recomendacion}</Text>

      <MotivacionNinos sexo={sexo} categoria={categoria} />

      <Text style={styles.leyendaBarra}>
        Colores alineados con el eje -3 a +3 DE (franjas proporcionales OMS: delgadez,
        adecuado, sobrepeso, obesidad). El triángulo marca tu Z.
      </Text>

      <View style={styles.barraNinoFila}>
        <View style={{ flex: 1, backgroundColor: "#1976d2" }} />
        <View style={{ flex: 3, backgroundColor: "#2e7d32" }} />
        <View style={{ flex: 1, backgroundColor: "#ef6c00" }} />
        <View style={{ flex: 1, backgroundColor: "#c62828" }} />
      </View>

      <View style={styles.indicadorContainer}>
        <Text style={[styles.indicador, { left: `${x}%` }]}>▲</Text>
      </View>
    </View>
  );
}
