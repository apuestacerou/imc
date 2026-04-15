import { useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import ResultCardNinos from "./components/ResultCardNinos";
import { calcularIMCNinosOMS } from "./logic/calcularIMCNinosOMS";
import type { WhoSex } from "./logic/whoBmiLmsData";
import { styles } from "./styles/homeStyles";

export default function NinosScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [sexo, setSexo] = useState<WhoSex | "">("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const [zScore, setZScore] = useState<number | null>(null);
  const [categoria, setCategoria] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [colorResultado, setColorResultado] = useState("black");
  const [posicionIndiador, setPosicionIndicador] = useState(0);
  const [referencia, setReferencia] = useState("");
  const [error, setError] = useState("");

  const nuevoCalculo = () => {
    setSexo("");
    setEdad("");
    setPeso("");
    setAltura("");
    setImc(null);
    setZScore(null);
    setCategoria("");
    setRecomendacion("");
    setColorResultado("black");
    setPosicionIndicador(0);
    setReferencia("");
    setError("");
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const calcular = () => {
    setError("");
    const r = calcularIMCNinosOMS(peso, altura, edad, sexo);

    if ("error" in r) {
      setImc(null);
      setZScore(null);
      setCategoria("");
      setRecomendacion("");
      setReferencia("");
      setError(r.error);
      return;
    }

    setImc(r.imc);
    setZScore(r.zScore);
    setCategoria(r.categoria);
    setRecomendacion(r.recomendacion);
    setColorResultado(r.colorResultado);
    setPosicionIndicador(r.posicion);
    setReferencia(r.referencia);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  return (
      <ScrollView
        ref={scrollRef}
        style={styles.scrollRoot}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Link href="/" style={styles.link}>
          ← Volver al inicio
        </Link>

        <Text style={styles.title}>IMC niños y adolescentes</Text>
        <Text style={styles.subtitle}>
          Referencia OMS 2007 (IMC para la edad, 5 a 19 años)
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Sexo (biológico, para la curva OMS):</Text>
          <View style={styles.activityContainer}>
            <TouchableOpacity
              style={[
                styles.activityButton,
                sexo === "masculino" && styles.selectedButton,
              ]}
              onPress={() => setSexo("masculino")}
            >
              <Text
                style={{
                  color: sexo === "masculino" ? "#fff" : "#333",
                  fontWeight: "600",
                }}
              >
                Niño
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.activityButton,
                sexo === "femenino" && styles.selectedButton,
              ]}
              onPress={() => setSexo("femenino")}
            >
              <Text
                style={{
                  color: sexo === "femenino" ? "#fff" : "#333",
                  fontWeight: "600",
                }}
              >
                Niña
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Edad (años, ej. 8 o 8,5):"
            style={styles.input}
            value={edad}
            onChangeText={setEdad}
            keyboardType="decimal-pad"
          />

          <TextInput
            placeholder="Peso (kg):"
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="decimal-pad"
          />

          <TextInput
            placeholder="Altura (m):"
            style={styles.input}
            value={altura}
            onChangeText={setAltura}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity style={styles.calculateButton} onPress={calcular}>
            <Text style={styles.calculateText}>Calcular IMC (OMS)</Text>
          </TouchableOpacity>

          {error !== "" && <Text style={styles.errorText}>{error}</Text>}

          <ResultCardNinos
            imc={imc}
            zScore={zScore}
            categoria={categoria}
            recomendacion={recomendacion}
            colorResultado={colorResultado}
            posicionIndiador={posicionIndiador}
            referencia={referencia}
            sexo={sexo}
          />

          {imc !== null && zScore !== null && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={nuevoCalculo}
              accessibilityRole="button"
              accessibilityLabel="Borrar datos y calcular otro IMC"
            >
              <Text style={styles.secondaryButtonText}>Calcular otro IMC</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
  );
}
