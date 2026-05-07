import type { ComponentProps } from "react";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { href } from "../routeHrefs";
import { colors, radii, spacing, typography } from "../theme/vitality";
import { font } from "../theme/fonts";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={colors.onSurfaceVariant}
        />
        {children}
      </View>
    </View>
  );
}

export default function RegistroInicioScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [edad, setEdad] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    setMsg("");
    if (password !== password2) {
      setMsg("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const edadN = parseInt(edad.replace(/\D/g, ""), 10);
    const alturaN = parseFloat(altura.replace(",", "."));
    const pesoN = parseFloat(peso.replace(",", "."));

    if (!nombre.trim()) {
      setMsg("Escribe tu nombre.");
      return;
    }
    if (!email.trim()) {
      setMsg("Escribe tu correo.");
      return;
    }
    if (!Number.isFinite(edadN) || edadN < 1 || edadN > 120) {
      setMsg("Edad no válida.");
      return;
    }
    if (!Number.isFinite(alturaN) || alturaN < 50 || alturaN > 260) {
      setMsg("Altura en cm no válida (50–260).");
      return;
    }
    if (!Number.isFinite(pesoN) || pesoN < 10 || pesoN > 300) {
      setMsg("Peso inicial no válido.");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim().toLowerCase(),
        password,
        nombre: nombre.trim(),
        edad: edadN,
        alturaCm: Math.round(alturaN),
        pesoInicialKg: pesoN,
      });
      router.replace(href.tabsImc);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.containerMargin,
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandRow}>
          <MaterialCommunityIcons
            name="heart-pulse"
            size={36}
            color={colors.primary}
          />
          <Text style={styles.brand}>Vitality</Text>
        </View>

        <Text style={styles.h2}>Crear cuenta</Text>
        <Text style={styles.lead}>
          Ingresa tus datos para guardar tu historial de IMC en la nube (Neon) y
          acceder desde cualquier dispositivo.
        </Text>

        <Field label="Nombre completo" icon="account-outline">
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Ana García"
            placeholderTextColor={colors.outline}
            style={styles.input}
          />
        </Field>

        <Field label="Correo electrónico" icon="email-outline">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="ana@ejemplo.com"
            placeholderTextColor={colors.outline}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </Field>

        <Field label="Contraseña" icon="lock-outline">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.outline}
            secureTextEntry
            style={styles.input}
          />
        </Field>

        <Field label="Confirmar contraseña" icon="lock-outline">
          <TextInput
            value={password2}
            onChangeText={setPassword2}
            placeholder="Repite la contraseña"
            placeholderTextColor={colors.outline}
            secureTextEntry
            style={styles.input}
          />
        </Field>

        <Field label="Edad" icon="calendar-month-outline">
          <TextInput
            value={edad}
            onChangeText={setEdad}
            placeholder="Ej. 25"
            placeholderTextColor={colors.outline}
            keyboardType="number-pad"
            style={styles.input}
          />
        </Field>

        <View style={styles.row2}>
          <View style={styles.row2Col}>
            <Field label="Altura (cm)" icon="human-male-height">
              <TextInput
                value={altura}
                onChangeText={setAltura}
                placeholder="170"
                placeholderTextColor={colors.outline}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </Field>
          </View>
          <View style={styles.row2Col}>
            <Field label="Peso inicial (kg)" icon="weight-kilogram">
              <TextInput
                value={peso}
                onChangeText={setPeso}
                placeholder="70"
                placeholderTextColor={colors.outline}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </Field>
          </View>
        </View>

        {msg !== "" ? <Text style={styles.msg}>{msg}</Text> : null}

        <Pressable
          onPress={() => void enviar()}
          disabled={loading}
          style={({ pressed }) => [pressed && { opacity: 0.92 }, loading && { opacity: 0.6 }]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>
              {loading ? "Creando cuenta…" : "Comenzar mi viaje"}
            </Text>
            {!loading && (
              <MaterialCommunityIcons
                name="arrow-right"
                size={22}
                color={colors.onPrimaryContainer}
              />
            )}
          </LinearGradient>
        </Pressable>

        <Text style={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link href={href.authLogin} style={styles.link}>
            Inicia sesión
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surfaceContainerLowest },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  brand: {
    fontFamily: font.semibold,
    fontSize: 24,
    color: colors.primary,
  },
  h2: {
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  lead: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  field: { marginBottom: spacing.lg },
  label: {
    fontFamily: font.medium,
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
    paddingLeft: 4,
  },
  inputWrap: {
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
  input: {
    flex: 1,
    fontFamily: font.regular,
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  row2: { flexDirection: "row", gap: spacing.md },
  row2Col: { flex: 1, minWidth: 0 },
  msg: {
    color: colors.error,
    marginBottom: spacing.md,
    fontFamily: font.regular,
    fontSize: 14,
  },
  cta: {
    marginTop: spacing.md,
    height: 52,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  ctaText: {
    fontFamily: font.semibold,
    ...typography.button,
    color: colors.onPrimaryContainer,
  },
  footer: {
    marginTop: spacing.xl,
    textAlign: "center",
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  link: {
    color: colors.primary,
    fontFamily: font.semibold,
  },
});
