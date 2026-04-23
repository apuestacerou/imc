import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/homeStyles";

export default function InicioScreen() {
  return (
    <View style={styles.inicioContainer}>
      <Text style={styles.title}>CalculadoraIMC+</Text>
      <Text style={styles.subtitle}>
        Elige quién va a calcular su IMC para usar las métricas adecuadas.
      </Text>

      <View style={styles.inicioBotonera}>
        <Link href="/adultos" asChild>
          <TouchableOpacity
            style={styles.menuButtonPrimario}
            accessibilityRole="button"
            accessibilityLabel="Abrir calculadora para adultos"
          >
            <Text style={styles.menuButtonPrimarioTexto}>Adultos</Text>
            <Text style={styles.menuButtonSub}>
              IMC clásico, recomendaciones y curso opcional
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/ninos" asChild>
          <TouchableOpacity
            style={styles.menuButtonSecundario}
            accessibilityRole="button"
            accessibilityLabel="Abrir calculadora para niños y adolescentes OMS"
          >
            <Text style={styles.menuButtonSecundarioTexto}>
              Niños y adolescentes
            </Text>
            <Text style={styles.menuButtonSubOscuro}>
              Referencia OMS 2007 (5 a 19 años)
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
