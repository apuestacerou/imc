import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VitalityHeader from "../../components/VitalityHeader";
import { useWellness, type Genero } from "../../context/WellnessContext";
import { calcularIMClogic } from "../../logic/calcularIMC";
import { calcularIMCNinosOMS } from "../../logic/calcularIMCNinosOMS";
import { imcModoDesdeEdad } from "../../logic/imcModoPorEdad";
import {
  metabolismoBasalKcal,
  rangoPesoIdealKg,
} from "../../logic/metabolismoIdeal";
import { href } from "../../routeHrefs";
import { colors, radii, spacing, typography } from "../../theme/vitality";
import { font } from "../../theme/fonts";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Modo = "adulto" | "nino";

export default function ImcCalculadoraScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ modo?: string }>();
  const { profile, setLastResult, addHistory } = useWellness();

  const [modo, setModo] = useState<Modo>("adulto");
  const [genero, setGenero] = useState<Genero>("masculino");
  const [edadAdulto, setEdadAdulto] = useState(28);
  const [edadNinoTexto, setEdadNinoTexto] = useState("");
  const [pesoKg, setPesoKg] = useState(72);
  const [alturaCm, setAlturaCm] = useState(170);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) return;
    const m = params.modo;
    if (m === "nino") {
      setModo("nino");
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [params.modo, profile]);

  useEffect(() => {
    if (!profile) return;
    const m = imcModoDesdeEdad(profile.edad);
    setModo(m);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (m === "nino") {
      setEdadNinoTexto(String(profile.edad));
    } else if (profile.edad > 0) {
      setEdadAdulto(Math.min(100, Math.max(5, profile.edad)));
    }
    if (profile.alturaCm > 0) setAlturaCm(profile.alturaCm);
    if (profile.pesoInicialKg > 0) setPesoKg(Math.round(profile.pesoInicialKg));
  }, [profile]);

  const alturaStr = useMemo(() => String(alturaCm), [alturaCm]);
  const pesoStr = useMemo(() => String(pesoKg), [pesoKg]);

  const bump = (delta: number) => {
    void Haptics.selectionAsync();
    setPesoKg((v) => Math.min(250, Math.max(10, Math.round((v + delta) * 2) / 2)));
  };
  const bumpAltura = (delta: number) => {
    void Haptics.selectionAsync();
    setAlturaCm((v) => Math.min(250, Math.max(50, v + delta)));
  };

  const calcular = () => {
    setError("");
    if (modo === "adulto") {
      const edadStr = String(edadAdulto);
      const r = calcularIMClogic(pesoStr, alturaStr, edadStr);
      if ("error" in r) {
        setError(typeof r.error === "string" ? r.error : "Error");
        return;
      }
      const alturaM = alturaCm / 100;
      const { minKg, maxKg } = rangoPesoIdealKg(alturaM);
      const metabolismoKcal = metabolismoBasalKcal({
        pesoKg: pesoKg,
        alturaCm,
        edad: edadAdulto,
        genero,
      });
      const o = r as {
        imc: number;
        posicion: number;
        categoria: string;
        recomendacion: string;
        colorResultado: string;
      };
      setLastResult({
        modo: "adulto",
        imc: o.imc,
        categoria: o.categoria,
        recomendacion: o.recomendacion,
        colorResultado: o.colorResultado,
        posicion: o.posicion,
        pesoKg,
        alturaCm,
        edad: edadAdulto,
        genero,
        metabolismoKcal,
        pesoIdealMinKg: minKg,
        pesoIdealMaxKg: maxKg,
      });
      void addHistory({
        pesoKg,
        alturaCm,
        imc: o.imc,
        categoria: o.categoria,
        modo: "adulto",
      });
      router.push(href.tabsImcResultado);
      return;
    }

    const r = calcularIMCNinosOMS(pesoStr, alturaStr, edadNinoTexto, genero);
    if ("error" in r) {
      setError(typeof r.error === "string" ? r.error : "Error");
      return;
    }
    setLastResult({
      modo: "nino",
      imc: r.imc,
      zScore: r.zScore,
      categoria: r.categoria,
      recomendacion: r.recomendacion,
      colorResultado: r.colorResultado,
      posicion: r.posicion,
      pesoKg,
      alturaCm,
      edad: parseFloat(edadNinoTexto.replace(",", ".")) || 0,
      genero,
      referencia: r.referencia,
    });
    void addHistory({
      pesoKg,
      alturaCm,
      imc: r.imc,
      categoria: r.categoria,
      modo: "nino",
      zScore: r.zScore,
    });
    router.push(href.tabsImcResultado);
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 88 }]}>
      <VitalityHeader />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: spacing.md, paddingHorizontal: spacing.containerMargin },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {profile ? (
          <View style={styles.modoBloqueado}>
            <Text style={styles.modoBloqueadoTitulo}>Modo de cálculo</Text>
            <Text style={styles.modoBloqueadoTexto}>
              {modo === "nino"
                ? `Con tu edad (${profile.edad} años) usamos la referencia OMS para niños y adolescentes (5–19 años).`
                : `Con tu edad (${profile.edad} años) usamos la calculadora para adultos.`}
            </Text>
          </View>
        ) : (
          <View style={styles.modoRow}>
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setModo("adulto");
                setError("");
              }}
              style={[styles.modoChip, modo === "adulto" && styles.modoChipOn]}
            >
              <Text
                style={[
                  styles.modoChipText,
                  modo === "adulto" && styles.modoChipTextOn,
                ]}
              >
                Adultos
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setModo("nino");
                setError("");
              }}
              style={[styles.modoChip, modo === "nino" && styles.modoChipOn]}
            >
              <Text
                style={[
                  styles.modoChipText,
                  modo === "nino" && styles.modoChipTextOn,
                ]}
              >
                Niños / OMS
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.hero}>
          <Text style={styles.h1}>BIENVENIDO</Text>
          <Text style={styles.sub}>
            Sigue tu progreso diario y mantén el control de tu salud
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={[styles.card, styles.cardFull]}>
            <Text style={styles.label}>GÉNERO</Text>
            <View style={styles.genRow}>
              <Pressable
                onPress={() => setGenero("masculino")}
                style={[
                  styles.genBtn,
                  genero === "masculino" && styles.genBtnOn,
                ]}
              >
                <MaterialCommunityIcons
                  name="gender-male"
                  size={20}
                  color={
                    genero === "masculino"
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.genBtnText,
                    genero === "masculino" && styles.genBtnTextOn,
                  ]}
                >
                  Hombre
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setGenero("femenino")}
                style={[
                  styles.genBtn,
                  genero === "femenino" && styles.genBtnOn,
                ]}
              >
                <MaterialCommunityIcons
                  name="gender-female"
                  size={20}
                  color={
                    genero === "femenino"
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.genBtnText,
                    genero === "femenino" && styles.genBtnTextOn,
                  ]}
                >
                  Mujer
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>PESO (KG)</Text>
            <Text style={styles.bigNum}>{pesoKg}</Text>
            <View style={styles.stepRow}>
              <Pressable
                onPress={() => bump(-0.5)}
                style={styles.stepBtn}
                accessibilityLabel="Disminuir peso medio kilo"
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
              <Pressable
                onPress={() => bump(0.5)}
                style={styles.stepBtn}
                accessibilityLabel="Aumentar peso medio kilo"
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>ALTURA (CM)</Text>
            <Text style={styles.bigNum}>{alturaCm}</Text>
            <View style={styles.stepRow}>
              <Pressable
                onPress={() => bumpAltura(-1)}
                style={styles.stepBtn}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
              <Pressable
                onPress={() => bumpAltura(1)}
                style={styles.stepBtn}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={22}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>

          {modo === "adulto" ? (
            <View style={[styles.card, styles.cardFull]}>
              <View style={styles.edadHead}>
                <Text style={styles.label}>EDAD</Text>
                <Text style={styles.edadVal}>{edadAdulto}</Text>
              </View>
              <Slider
                minimumValue={5}
                maximumValue={100}
                step={1}
                value={edadAdulto}
                onValueChange={setEdadAdulto}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.surfaceContainerHighest}
                thumbTintColor={colors.primary}
              />
            </View>
          ) : (
            <View style={[styles.card, styles.cardFull]}>
              <Text style={styles.label}>EDAD (AÑOS, EJ. 8 O 8,5)</Text>
              <Text style={styles.ninoHint}>
                Referencia OMS 5–19 años. Usa coma o punto para medios años.
              </Text>
              <View style={styles.edadInputWrap}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={22}
                  color={colors.onSurfaceVariant}
                />
                <TextInput
                  value={edadNinoTexto}
                  onChangeText={setEdadNinoTexto}
                  placeholder="Ej. 8 o 8,5"
                  placeholderTextColor={colors.outline}
                  keyboardType="decimal-pad"
                  style={styles.edadNinoInput}
                  accessibilityLabel="Edad del menor en años"
                />
              </View>
            </View>
          )}
        </View>

        {error !== "" ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={calcular}
          style={({ pressed }) => [pressed && { opacity: 0.92 }]}
          accessibilityRole="button"
          accessibilityLabel="Calcular IMC"
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Calcular</Text>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={22}
              color="#00201c"
            />
          </LinearGradient>
        </Pressable>

        <View style={styles.glass}>
          <Text style={styles.glassTitle}>Por qué es importante</Text>
          <Text style={styles.glassBody}>
            El Índice de Masa Corporal es un indicador confiable para identificar
            categorías de peso que pueden llevar a problemas de salud. En menores,
            usamos la referencia OMS (IMC para la edad).
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
  scroll: {
    paddingBottom: spacing.xxl,
  },
  modoRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modoBloqueado: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
  },
  modoBloqueadoTitulo: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  modoBloqueadoTexto: {
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  modoChip: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
  },
  modoChipOn: {
    borderColor: colors.primary,
    backgroundColor: "rgba(87, 241, 219, 0.12)",
  },
  modoChipText: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  modoChipTextOn: {
    color: colors.primary,
  },
  hero: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  h1: {
    fontFamily: font.semibold,
    ...typography.h1,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  sub: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  card: {
    width: "47%",
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
  },
  cardFull: {
    width: "100%",
  },
  label: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  genRow: {
    flexDirection: "row",
    gap: spacing.sm,
    height: 52,
  },
  genBtn: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerHighest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  genBtnOn: {
    backgroundColor: colors.primaryContainer,
  },
  genBtnText: {
    fontFamily: font.semibold,
    ...typography.button,
    color: colors.onSurfaceVariant,
  },
  genBtnTextOn: {
    color: colors.onPrimaryContainer,
  },
  bigNum: {
    fontFamily: font.semibold,
    ...typography.h1,
    color: colors.primary,
    textAlign: "center",
    marginVertical: spacing.xs,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  edadHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  edadVal: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.primary,
  },
  ninoHint: {
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  edadInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  edadNinoInput: {
    flex: 1,
    fontFamily: font.medium,
    fontSize: 17,
    color: colors.onSurface,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  error: {
    marginTop: spacing.md,
    color: colors.error,
    fontFamily: font.regular,
    fontSize: 14,
  },
  cta: {
    marginTop: spacing.lg,
    height: 56,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  ctaText: {
    fontFamily: font.semibold,
    ...typography.button,
    color: "#00201c",
  },
  glass: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.xl + 4,
    backgroundColor: "rgba(19, 27, 46, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(60, 74, 70, 0.35)",
  },
  glassTitle: {
    fontFamily: font.medium,
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  glassBody: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
});
