import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VitalityHeader from "../components/VitalityHeader";
import { useWellness } from "../context/WellnessContext";
import { colors, radii, spacing, typography } from "../theme/vitality";
import { font } from "../theme/fonts";

function formatFecha(ts: number) {
  try {
    return new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleDateString();
  }
}

function formatHora(ts: number) {
  try {
    return new Intl.DateTimeFormat("es", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

export default function HistorialScreen() {
  const insets = useSafeAreaInsets();
  const { history, clearHistory } = useWellness();

  const ordenAsc = useMemo(
    () => [...history].sort((a, b) => a.at - b.at),
    [history]
  );

  const pesos = ordenAsc.map((h) => h.pesoKg);
  const minP = pesos.length ? Math.min(...pesos) : 0;
  const maxP = pesos.length ? Math.max(...pesos) : 1;
  const span = Math.max(0.001, maxP - minP);

  const ultimos6 = ordenAsc.slice(-6);
  const deltaTotal =
    ordenAsc.length >= 2
      ? ordenAsc[ordenAsc.length - 1].pesoKg - ordenAsc[0].pesoKg
      : null;

  const imcActual = history[0]?.imc;

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
        <Text style={styles.h1}>Tu evolución</Text>
        <Text style={styles.sub}>
          Cada paso cuenta en tu camino hacia el bienestar.
        </Text>

        <View style={styles.chartCard}>
          <View style={styles.chartHead}>
            <View>
              <Text style={styles.chartTitle}>Tendencia de peso</Text>
              <Text style={styles.chartHint}>Últimos registros</Text>
            </View>
            {deltaTotal != null && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {deltaTotal <= -0.05
                    ? "Bajando"
                    : deltaTotal >= 0.05
                      ? "Subiendo"
                      : "Estable"}
                </Text>
              </View>
            )}
          </View>

          {ultimos6.length === 0 ? (
            <Text style={styles.empty}>
              Aún no hay registros. Calcula tu IMC en la pestaña IMC para ver tu
              tendencia aquí.
            </Text>
          ) : (
            <View style={styles.bars}>
              {ultimos6.map((e) => {
                const h =
                  0.35 +
                  (0.65 * (e.pesoKg - minP)) / span;
                const hh = Math.round(36 + Math.min(1, Math.max(0.2, h)) * 104);
                return (
                  <View key={e.id} style={styles.barCol}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: hh,
                          backgroundColor:
                            e.id === history[0]?.id
                              ? colors.primary
                              : colors.surfaceContainerHighest,
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.sideCol}>
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="trending-down"
              size={32}
              color={colors.secondary}
            />
            <Text style={styles.statLabel}>CAMBIO DE PESO (SERIE)</Text>
            <Text style={styles.statNum}>
              {deltaTotal == null ? "—" : `${deltaTotal >= 0 ? "+" : ""}${deltaTotal.toFixed(1)}`}
            </Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.statLabel}>ÚLTIMO IMC</Text>
            <Text style={styles.statNum}>
              {imcActual != null ? imcActual.toFixed(1) : "—"}
            </Text>
            {history[0] && (
              <Text style={styles.statHint}>{history[0].categoria}</Text>
            )}
          </View>
        </View>

        <View style={styles.encourage}>
          <View style={styles.encIcon}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={28}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.encTitle}>¡Vas por buen camino!</Text>
            <Text style={styles.encBody}>
              Registrar tu peso con constancia ayuda a detectar tendencias antes
              que solo mirar el espejo.
            </Text>
          </View>
        </View>

        <View style={styles.listHead}>
          <Text style={styles.h2}>Registros pasados</Text>
          {history.length > 0 && (
            <Pressable onPress={() => void clearHistory()}>
              <Text style={styles.clear}>Borrar historial</Text>
            </Pressable>
          )}
        </View>

        {history.length === 0 ? (
          <Text style={styles.emptyList}>Sin registros todavía.</Text>
        ) : (
          history.map((e) => (
            <View key={e.id} style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={styles.ico}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={22}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <View>
                  <Text style={styles.rowDate}>{formatFecha(e.at)}</Text>
                  <Text style={styles.rowTime}>{formatHora(e.at)}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.rowKg}>{e.pesoKg} kg</Text>
                <Text style={styles.rowImc}>IMC {e.imc.toFixed(1)}</Text>
              </View>
            </View>
          ))
        )}
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
  chartCard: {
    minHeight: 220,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.55)",
    marginBottom: spacing.md,
  },
  chartHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontFamily: font.medium,
    ...typography.h3,
    color: colors.onSurface,
  },
  chartHint: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: "rgba(87, 241, 219, 0.12)",
  },
  pillText: {
    fontFamily: font.bold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.primary,
  },
  empty: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    paddingHorizontal: spacing.xs,
    gap: 6,
  },
  barCol: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    minHeight: 28,
  },
  sideCol: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.55)",
  },
  statLabel: {
    fontFamily: font.medium,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  statNum: {
    fontFamily: font.semibold,
    ...typography.h1,
    color: colors.onSurface,
    marginTop: 4,
  },
  statUnit: {
    fontFamily: font.medium,
    ...typography.h3,
    color: colors.secondary,
  },
  statHint: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.primary,
  },
  encourage: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl + 4,
    backgroundColor: "rgba(87, 241, 219, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(87, 241, 219, 0.12)",
    marginBottom: spacing.xl,
  },
  encIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(87, 241, 219, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  encTitle: {
    fontFamily: font.medium,
    ...typography.h3,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  encBody: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  listHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  h2: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
  },
  clear: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.primary,
  },
  emptyList: {
    fontFamily: font.regular,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: "rgba(30, 41, 59, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.45)",
    marginBottom: spacing.sm,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  ico: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  rowDate: {
    fontFamily: font.regular,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  rowTime: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  rowKg: {
    fontFamily: font.semibold,
    ...typography.h3,
    color: colors.onSurface,
  },
  rowImc: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.primary,
    marginTop: 2,
  },
});
