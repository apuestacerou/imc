import React from "react";
import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { CURSO_EJERCICIO_NUTRICION_URL } from "../constants/curso";
import { styles } from "../styles/homeStyles";

export default function CursoPromoCard() {
  const abrirCurso = async () => {
    try {
      const supported = await Linking.canOpenURL(CURSO_EJERCICIO_NUTRICION_URL);
      if (supported) {
        await Linking.openURL(CURSO_EJERCICIO_NUTRICION_URL);
      } else {
        Alert.alert(
          "Enlace no disponible",
          "Configura la URL del curso en la app (constants/curso.ts)."
        );
      }
    } catch {
      Alert.alert("No se pudo abrir el enlace.");
    }
  };

  return (
    <View style={styles.cursoCard}>
      <Text style={styles.cursoTitulo}>Tu siguiente paso</Text>
      <Text style={styles.cursoNombre}>
        Curso: ejercicio y alimentación consciente
      </Text>
      <Text style={styles.cursoDescripcion}>
        Plan práctico para ordenar tu entrenamiento y tu plato: rutinas, ideas de
        comidas y hábitos sostenibles.
      </Text>
      <TouchableOpacity style={styles.cursoBoton} onPress={abrirCurso}>
        <Text style={styles.cursoBotonTexto}>Quiero ver el curso</Text>
      </TouchableOpacity>
      <Text style={styles.cursoAviso}>
        Contenido educativo; no sustituye consejo médico ni nutricional
        personalizado.
      </Text>
    </View>
  );
}
