import React from "react";
import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CURSO_EJERCICIO_NUTRICION_URL } from "../constants/curso";
import { styles } from "../styles/homeStyles";
import { colors, radii, spacing, typography } from "../theme/vitality";
import { font } from "../theme/fonts";

type Props = {
  /** Estilo alineado al diseño Vitality (oscuro / degradados). */
  variant?: "classic" | "vitality";
};

export default function CursoPromoCard({ variant = "classic" }: Props) {
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

  if (variant === "vitality") {
    return (
      <View style={v.card}>
        <Text style={v.badge}>EVOLUCIONA A TU MÁXIMO NIVEL</Text>
        <Text style={v.title}>Curso Premium de Nutrición y Entrenamiento</Text>
        <Text style={v.desc}>
          Lleva tu progreso al siguiente nivel con planes prácticos y hábitos
          sostenibles (enlace externo).
        </Text>
        <TouchableOpacity onPress={abrirCurso} activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={v.btn}
          >
            <Text style={v.btnText}>Inscribirse ahora</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={v.aviso}>
          Contenido educativo; no sustituye consejo médico ni nutricional
          personalizado.
        </Text>
      </View>
    );
  }

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

const v = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl + 6,
    backgroundColor: "rgba(23, 31, 51, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(87, 241, 219, 0.25)",
    overflow: "hidden",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    overflow: "hidden",
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.primary,
    backgroundColor: "rgba(87, 241, 219, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(87, 241, 219, 0.35)",
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  desc: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  btn: {
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnText: {
    fontFamily: font.semibold,
    ...typography.button,
    color: colors.onSecondaryContainer,
  },
  aviso: {
    marginTop: spacing.sm,
    fontFamily: font.regular,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
});
