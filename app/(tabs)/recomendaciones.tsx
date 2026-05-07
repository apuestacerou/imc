import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VitalityHeader from "../components/VitalityHeader";
import { useWellness } from "../context/WellnessContext";
import { href } from "../routeHrefs";
import { colors, radii, spacing, typography } from "../theme/vitality";
import { font } from "../theme/fonts";

export default function RecomendacionesScreen() {
  const insets = useSafeAreaInsets();
  const { lastResult } = useWellness();

  const imc = lastResult?.imc;
  const extra =
    imc != null && imc >= 25
      ? "Tu último IMC sugiere priorizar fibra y movimiento diario."
      : imc != null && imc < 18.5
        ? "Tu último IMC sugiere priorizar comidas completas y descanso."
        : "Tu último IMC estaba en rango habitualmente asociado a peso saludable: mantén hidratación y sueño regular.";

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 88 }]}>
      <VitalityHeader />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.containerMargin,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Recomendaciones</Text>
        <Text style={styles.sub}>Basado en tus métricas recientes</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons
                name="water"
                size={40}
                color={colors.primary}
              />
              <Text style={styles.h2}>Hidratación</Text>
              <Text style={styles.bodyMuted}>
                Apunta a 2–2,5 L/día si haces actividad; ajusta si tu médico lo
                indica distinto.
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.bigNum}>2+</Text>
              <Text style={styles.bigLbl}>LITROS / DÍA (META)</Text>
            </View>
          </View>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: "60%" }]} />
          </View>
        </View>

        <View style={styles.row2}>
          <View style={[styles.small, { borderLeftColor: colors.secondary }]}>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={26}
              color={colors.secondary}
            />
            <Text style={styles.h3}>Fibra</Text>
            <Text style={styles.bodyMuted}>
              Suma verdura en 2 comidas y un puñado de legumbres 3–4 veces por
              semana.
            </Text>
          </View>
          <View style={[styles.small, { borderLeftColor: colors.tertiaryContainer }]}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={26}
              color={colors.tertiaryContainer}
            />
            <Text style={styles.h3}>Rutina</Text>
            <Text style={styles.bodyMuted}>
              15–20 min de caminar después de comer mejora glucosa y energía.
            </Text>
          </View>
        </View>

        <View style={styles.personal}>
          <Text style={styles.personalTitle}>Para ti ahora</Text>
          <Text style={styles.personalBody}>{extra}</Text>
          <Text style={styles.personalHint}>
            Si no has calculado aún, ve a{" "}
            <Link href={href.tabsImc} style={{ color: colors.primary }}>
              IMC
            </Link>
            .
          </Text>
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons
            name="flash-outline"
            size={40}
            color={colors.primary}
          />
          <Text style={styles.footerTitle}>Disciplina sobre motivación</Text>
          <Text style={styles.footerBody}>
            Los hábitos pequeños y repetidos transforman resultados más que el
            impulso puntual.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  h1: {
    fontFamily: font.semibold,
    ...typography.h1,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  sub: {
    fontFamily: font.regular,
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  heroCard: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.55)",
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  h2: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  bodyMuted: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
    lineHeight: 20,
    maxWidth: 220,
  },
  bigNum: {
    fontFamily: font.bold,
    fontSize: 44,
    color: colors.primary,
  },
  bigLbl: {
    fontFamily: font.medium,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.onSurfaceVariant,
    opacity: 0.75,
    marginTop: 4,
    textAlign: "right",
  },
  track: {
    marginTop: spacing.lg,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  row2: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  small: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.55)",
    borderLeftWidth: 4,
  },
  h3: {
    fontFamily: font.medium,
    ...typography.h3,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  personal: {
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: spacing.xl,
  },
  personalTitle: {
    fontFamily: font.semibold,
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  personalBody: {
    fontFamily: font.regular,
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  personalHint: {
    marginTop: spacing.md,
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  footerTitle: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footerBody: {
    fontFamily: font.regular,
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 360,
    lineHeight: 26,
  },
});
