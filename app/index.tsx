/**
 * PANTALLA PRINCIPAL - Calculadora IMC+
 * Muestra inputs (edad, peso, altura), selector de actividad, botón Calcular
 * y la tarjeta de resultado con IMC, categoría y barra visual.
 */

import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ActivitySelector from "./components/ActivitySelector";
import ResultCard from "./components/ResultCard";
import { calcularIMCLogica } from "./utils/imcCalculator";

export default function Home() {
  // Estado para cada campo del formulario y el resultado del cálculo
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [edad, setEdad] = useState("");
  const [activity, setActivity] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  /** Obtiene peso y altura, valida que existan y guarda el resultado del IMC en el estado */
  const calcular = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (!pesoNum || !alturaNum) return;

    const datos = calcularIMCLogica(pesoNum, alturaNum);
    setResultado(datos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CalculadoraIMC+</Text>

      <TextInput placeholder="Edad" style={styles.input} value={edad} onChangeText={setEdad} />
      <TextInput placeholder="Peso" style={styles.input} value={peso} onChangeText={setPeso} />
      <TextInput placeholder="Altura" style={styles.input} value={altura} onChangeText={setAltura} />

      <ActivitySelector activity={activity} setActivity={setActivity} />

      <TouchableOpacity style={styles.button} onPress={calcular}>
        <Text style={{ color: "white" }}>Calcular IMC</Text>
      </TouchableOpacity>

      {/* Solo se muestra la tarjeta de resultado cuando ya se calculó el IMC */}
      {resultado && (
        <ResultCard
          imc={resultado.imc}
          categoria={resultado.categoria}
          color={resultado.color}
          posicion={resultado.posicion}
          recomendacion="Manten habitos saludables"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginTop: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 10 },
  button: { backgroundColor: "#35b558", padding: 15, borderRadius: 15, alignItems: "center" },
});