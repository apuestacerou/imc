import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/homeStyles";
import CursoPromoCard from "./CursoPromoCard";
import MotivacionNinos from "./MotivacionNinos";
import MunecoPorIMC from "./MunecoPorIMC";

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
        Tu posición en la escala de IMC
      </Text>

      <View style={styles.escalaNumerica}>
        <Text>14</Text>
        <Text>18.5</Text>
        <Text>25</Text>
        <Text>30</Text>
        <Text>45</Text>
      </View>

      <View style={styles.etiquetas}>
        <Text style={styles.etiqueta}>Bajo</Text>
        <Text style={styles.etiqueta}>Normal</Text>
        <Text style={styles.etiqueta}>Sobrepeso</Text>
        <Text style={styles.etiqueta}>Obesidad</Text>
      </View>

      <View style={styles.barraIMC}>
        <View style={[styles.seccion, { backgroundColor: "#90caf9" }]} />
        <View style={[styles.seccion, { backgroundColor: "#a5d6a7" }]} />
        <View style={[styles.seccion, { backgroundColor: "#ffcc80" }]} />
        <View style={[styles.seccion, { backgroundColor: "#ef9a9a" }]} />
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
