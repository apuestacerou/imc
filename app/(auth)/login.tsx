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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    setMsg("");
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace(href.tabsImc);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
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
          paddingTop: insets.top + spacing.xxl,
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

        <Text style={styles.h2}>Iniciar sesión</Text>
        <Text style={styles.lead}>
          Usa el correo y la contraseña con los que te registraste.
        </Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <View style={styles.inputWrap}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color={colors.onSurfaceVariant}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="ana@ejemplo.com"
            placeholderTextColor={colors.outline}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Contraseña</Text>
        <View style={styles.inputWrap}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={22}
            color={colors.onSurfaceVariant}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            placeholderTextColor={colors.outline}
            secureTextEntry
            style={styles.input}
          />
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
              {loading ? "Entrando…" : "Entrar"}
            </Text>
          </LinearGradient>
        </Pressable>

        <Text style={styles.footer}>
          ¿No tienes cuenta?{" "}
          <Link href={href.authRegister} style={styles.link}>
            Crear cuenta
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
    marginBottom: spacing.xl,
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
    marginBottom: spacing.sm,
  },
  lead: {
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
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
  msg: {
    color: colors.error,
    marginTop: spacing.md,
    fontFamily: font.regular,
    fontSize: 14,
  },
  cta: {
    marginTop: spacing.xl,
    height: 52,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
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
