import { useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import ResultCard from "./components/ResultCard";
import { calcularIMClogic } from "./logic/calcularIMC";
import { styles } from "./styles/homeStyles";

export default function AdultosScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const [categoria, setCategoria] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [resultado, setResultado] = useState("");
  const [colorResultado, setColorResultado] = useState("black");
  const [posicionIndiador, setPosicionIndiador] = useState(0);

  const nuevoCalculo = () => {
    setEdad("");
    setPeso("");
    setAltura("");
    setImc(null);
    setCategoria("");
    setRecomendacion("");
    setResultado("");
    setColorResultado("black");
    setPosicionIndicador(0);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const calcularIMC = () => {
    const resultadoCalculo = calcularIMClogic(peso, altura, edad);

    if ((resultadoCalculo as any)?.error) {
      setResultado((resultadoCalculo as any).error);
      return;
    }

    setResultado("");
    setImc((resultadoCalculo as any).imc);
    setPosicionIndicador((resultadoCalculo as any).posicion);
    setCategoria((resultadoCalculo as any).categoria);
    setRecomendacion((resultadoCalculo as any).recomendacion);
    setColorResultado((resultadoCalculo as any).colorResultado);

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

      <Text style={styles.title}>Adultos</Text>
      <Text style={styles.subtitle}>Calcula tu índice de masa corporal</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Edad:"
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

        <TouchableOpacity style={styles.calculateButton} onPress={calcularIMC}>
          <Text style={styles.calculateText}>Calcular IMC</Text>
        </TouchableOpacity>

        {resultado !== "" && (
          <Text style={{ marginTop: 10, color: "#b71c1c" }}>{resultado}</Text>
        )}

        <ResultCard
          imc={imc}
          categoria={categoria}
          recomendacion={recomendacion}
          colorResultado={colorResultado}
          posicionIndiador={posicionIndiador}
          edadTexto={edad}
        />

        {imc !== null && (
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
