import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BmiRing from "../../components/BmiRing";
import CursoPromoCard from "../../components/CursoPromoCard";
import MotivacionNinos from "../../components/MotivacionNinos";
import MunecoPorIMC from "../../components/MunecoPorIMC";
import VitalityHeader from "../../components/VitalityHeader";
import { useWellness } from "../../context/WellnessContext";
import {
  etiquetaCategoriaIMC,
  parrafoResumenAdulto,
  tituloMotivacionAdulto,
} from "../../logic/copyResultado";
import { href } from "../../routeHrefs";
import { colors, radii, spacing, typography } from "../../theme/vitality";
import { font } from "../../theme/fonts";

export default function ResultadoImcScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lastResult } = useWellness();

  useEffect(() => {
    if (!lastResult) {
      router.replace(href.tabsImc);
    }
  }, [lastResult, router]);

  if (!lastResult) {
    return <View style={styles.root} />;
  }

  const volver = () => {
    router.replace(href.tabsImc);
  };

  if (lastResult.modo === "nino") {
    const x = Math.min(100, Math.max(0, lastResult.posicion));
    return (
      <View style={[styles.root, { paddingBottom: insets.bottom + 88 }]}>
        <VitalityHeader />
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: spacing.containerMargin },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Tu resultado</Text>
          <Text style={styles.screenSub}>Referencia OMS (IMC para la edad)</Text>

          <View style={styles.card}>
            <Text style={styles.label}>IMC</Text>
            <Text style={styles.imcBig}>{lastResult.imc.toFixed(2)}</Text>
            <Text style={styles.zLine}>
              Puntaje Z:{" "}
              <Text style={styles.zNum}>{lastResult.zScore.toFixed(2)} DE</Text>
            </Text>
            <Text style={[styles.cat, { color: lastResult.colorResultado }]}>
              {lastResult.categoria}
            </Text>
            <Text style={styles.ref}>{lastResult.referencia}</Text>
            <Text style={styles.reco}>{lastResult.recomendacion}</Text>
            <MotivacionNinos sexo={lastResult.genero} categoria={lastResult.categoria} />
          </View>

          <Text style={styles.barTitle}>Escala (aprox. -3 a +3 DE)</Text>
          <View style={styles.barNino}>
            <View style={{ flex: 1, backgroundColor: "#1976d2" }} />
            <View style={{ flex: 3, backgroundColor: "#2e7d32" }} />
            <View style={{ flex: 1, backgroundColor: "#ef6c00" }} />
            <View style={{ flex: 1, backgroundColor: "#c62828" }} />
          </View>
          <View style={styles.markerWrap}>
            <Text style={[styles.marker, { left: `${x}%` }]}>▲</Text>
          </View>

          <Pressable onPress={volver} style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>Nuevo cálculo</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  const esMenor = lastResult.edad < 18;
  const subtitulo = etiquetaCategoriaIMC(lastResult.categoria);
  const progress = lastResult.posicion / 100;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 88 }]}>
      <VitalityHeader />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingHorizontal: spacing.containerMargin },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ringBlock}>
          <BmiRing
            imc={lastResult.imc}
            progress={progress}
            subtitulo={subtitulo}
          />
        </View>

        <Text style={styles.motTitle}>
          {tituloMotivacionAdulto(lastResult.categoria)}
        </Text>
        <Text style={styles.motBody}>
          {parrafoResumenAdulto(lastResult.categoria)}
        </Text>

        {!esMenor && (
          <View style={styles.rowMuneco}>
            <MunecoPorIMC imc={lastResult.imc} />
            <View style={{ flex: 1 }} />
          </View>
        )}

        <View style={styles.bento}>
          <View style={styles.glass}>
            <MaterialCommunityIcons
              name="scale-bathroom"
              size={28}
              color={colors.secondary}
            />
            <Text style={styles.bentoLabel}>Peso ideal (ref. IMC 18,5–25)</Text>
            <Text style={styles.bentoVal}>
              {lastResult.pesoIdealMinKg}–{lastResult.pesoIdealMaxKg} kg
            </Text>
          </View>
          <View style={styles.glass}>
            <MaterialCommunityIcons
              name="fire"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.bentoLabel}>Metabolismo basal (est.)</Text>
            <Text style={styles.bentoVal}>
              {lastResult.metabolismoKcal.toLocaleString("es")} kcal
            </Text>
          </View>
        </View>

        <View style={styles.recoCard}>
          <Text style={styles.recoTitle}>Recomendación</Text>
          <Text style={styles.recoText}>{lastResult.recomendacion}</Text>
        </View>

        {!esMenor ? (
          <CursoPromoCard variant="vitality" />
        ) : (
          <MotivacionNinos sexo="" categoria={lastResult.categoria} />
        )}

        <Pressable onPress={volver} style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>Volver a calculadora</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  screenTitle: {
    fontFamily: font.semibold,
    ...typography.h1,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  screenSub: {
    fontFamily: font.regular,
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  ringBlock: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  motTitle: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  motBody: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    lineHeight: 22,
  },
  rowMuneco: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  bento: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  glass: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: "rgba(30, 41, 59, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.55)",
    gap: spacing.xs,
  },
  bentoLabel: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  bentoVal: {
    fontFamily: font.semibold,
    ...typography.h3,
    color: colors.onSurface,
  },
  recoCard: {
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: spacing.lg,
  },
  recoTitle: {
    fontFamily: font.semibold,
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  recoText: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  ghostBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostBtnText: {
    fontFamily: font.semibold,
    color: colors.primary,
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  imcBig: {
    fontFamily: font.bold,
    fontSize: 40,
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  zLine: {
    marginTop: spacing.sm,
    fontFamily: font.regular,
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  zNum: {
    fontFamily: font.bold,
    color: colors.onSurface,
  },
  cat: {
    marginTop: spacing.sm,
    fontFamily: font.semibold,
    ...typography.h3,
  },
  ref: {
    marginTop: spacing.sm,
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  reco: {
    marginTop: spacing.md,
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurface,
    lineHeight: 22,
  },
  barTitle: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  barNino: {
    flexDirection: "row",
    height: 18,
    borderRadius: 10,
    overflow: "hidden",
  },
  markerWrap: {
    height: 22,
    position: "relative",
    marginTop: 4,
  },
  marker: {
    position: "absolute",
    fontSize: 18,
    marginLeft: -10,
    width: 20,
    textAlign: "center",
    color: colors.onSurface,
  },
});
