import type { ComponentProps } from "react";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Alert,
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
import { useAuth } from "./context/AuthContext";
import { useWellness, type UserProfile } from "./context/WellnessContext";
import { apiPatchMe, apiUserToProfile } from "./lib/api";
import { href } from "./routeHrefs";
import { colors, radii, spacing, typography } from "./theme/vitality";
import { font } from "./theme/fonts";

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token, user: authUser, setUserFromServer, logout } = useAuth();
  const { profile, setProfile, hydrated } = useWellness();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    const src = authUser ?? profile;
    if (!src) return;
    if (authUser) {
      setNombre(authUser.nombre);
      setEmail(authUser.email);
      setEdad(String(authUser.edad));
      setAltura(String(authUser.alturaCm));
      setPeso(String(authUser.pesoInicialKg));
    } else if (profile) {
      setNombre(profile.nombre);
      setEmail(profile.email);
      setEdad(String(profile.edad));
      setAltura(String(profile.alturaCm));
      setPeso(String(profile.pesoInicialKg));
    }
  }, [hydrated, authUser, profile]);

  const guardar = async () => {
    setMsg("");
    const edadN = parseInt(edad.replace(/\D/g, ""), 10);
    const alturaN = parseFloat(altura.replace(",", "."));
    const pesoN = parseFloat(peso.replace(",", "."));

    if (!nombre.trim()) {
      setMsg("Escribe tu nombre.");
      return;
    }
    if (!Number.isFinite(edadN) || edadN < 1 || edadN > 120) {
      setMsg("Edad no válida.");
      return;
    }
    if (!Number.isFinite(alturaN) || alturaN < 50 || alturaN > 250) {
      setMsg("Altura en cm no válida (50–250).");
      return;
    }
    if (!Number.isFinite(pesoN) || pesoN < 10 || pesoN > 300) {
      setMsg("Peso inicial no válido.");
      return;
    }

    try {
      if (token) {
        const u = await apiPatchMe(token, {
          nombre: nombre.trim(),
          edad: edadN,
          alturaCm: Math.round(alturaN),
          pesoInicialKg: pesoN,
        });
        setUserFromServer(u);
        await setProfile(apiUserToProfile(u));
      } else {
        const p: UserProfile = {
          nombre: nombre.trim(),
          email: email.trim(),
          edad: edadN,
          alturaCm: Math.round(alturaN),
          pesoInicialKg: pesoN,
        };
        await setProfile(p);
      }
      setMsg("Guardado.");
      router.back();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo guardar.");
    }
  };

  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Salir de tu cuenta en este dispositivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => {
            void (async () => {
              await logout();
              router.replace(href.authRegister);
            })();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.containerMargin,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.h2}>Tu cuenta</Text>
        <Text style={styles.lead}>
          {token
            ? "Los cambios se guardan en el servidor (Neon)."
            : "Ingresa tus datos para personalizar la calculadora."}
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
            editable={!token}
            style={[styles.input, token && styles.inputDisabled]}
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

        <Pressable onPress={() => void guardar()} style={({ pressed }) => pressed && { opacity: 0.92 }}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Guardar cambios</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color={colors.onPrimaryContainer} />
          </LinearGradient>
        </Pressable>

        {token ? (
          <Pressable onPress={cerrarSesion} style={styles.logout}>
            <MaterialCommunityIcons name="logout" size={22} color={colors.error} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surfaceContainerLowest },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: "rgba(2, 6, 23, 0.92)",
  },
  headerTitle: {
    fontFamily: font.semibold,
    fontSize: 18,
    color: colors.onSurface,
  },
  h2: {
    marginTop: spacing.lg,
    fontFamily: font.semibold,
    ...typography.h2,
    color: colors.onSurface,
  },
  lead: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontFamily: font.regular,
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  field: {
    marginBottom: spacing.lg,
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
  inputDisabled: {
    opacity: 0.65,
  },
  row2: {
    flexDirection: "row",
    gap: spacing.md,
  },
  row2Col: {
    flex: 1,
    minWidth: 0,
  },
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
  logout: {
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontFamily: font.semibold,
    fontSize: 16,
    color: colors.error,
  },
});
