import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ActivitySelector from "./components/ActivitySelector";
import ResultCard from "./components/ResultCard";
import { calcularIMClogic } from "./logic/calcularIMC";
import { styles } from "./styles/homeStyles";

export default function Home() {
  const [activity, setActivity] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const [categoria, setCategoria] = useState("");
  const [recomendacion, setRecomendacion] = useState('');
  const [resultado, setResultado] = useState("");
  const [colorResultado, setColorResultado] = useState("black");
  const [posicionIndiador, setPosicionIndicador] = useState(0);

  const calcularIMC = () => {
    const resultadoCalculo = calcularIMClogic(
      peso,
      altura,
      edad,
      activity
    );

    if ((resultadoCalculo as any)?.error) {
      setResultado((resultadoCalculo as any).error);
      return;
    }

    setImc((resultadoCalculo as any).imc);
    setPosicionIndicador((resultadoCalculo as any).posicion);
    setCategoria((resultadoCalculo as any).categoria);
    setRecomendacion((resultadoCalculo as any).recomendacion);
    setColorResultado((resultadoCalculo as any).colorResultado);

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>CalculadoraIMC+</Text>
      <Text style={styles.subtitle}>Calcula tu indice de masa corporal</Text>

      <View style={styles.card}>

        <TextInput
        placeholder="Edad:"
        style={styles.input}
        value={edad}
        onChangeText={setEdad}
        />

        <TextInput
        placeholder="Peso (kg):"
        style={styles.input}
        value={peso}
        onChangeText={setPeso}
        />

        <TextInput
        placeholder="Altura (m):"
        style={styles.input}
        value={altura}
        onChangeText={setAltura}
        />

        <Text style={styles.label}>Nivel de actividad:</Text>

        <ActivitySelector
        activity={activity}
        setActivity={setActivity}
        />

        <TouchableOpacity
        style={styles.calculateButton}
        onPress={calcularIMC}
        >
          <Text style={styles.calculateText}>Calcular IMC</Text>
        </TouchableOpacity>

        {resultado !==""&&(
          <Text style={{marginTop:10}}>{resultado}</Text>
        )}

        <ResultCard
        imc={imc}
        categoria={categoria}
        recomendacion={recomendacion}
        colorResultado={colorResultado}
        posicionIndiador={posicionIndiador}
        />
      </View>
    </View>
  );

}