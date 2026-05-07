import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { href } from "../routeHrefs";
import { colors, spacing } from "../theme/vitality";
import { font } from "../theme/fonts";

type Props = {
  style?: ViewStyle;
};

export default function VitalityHeader({ style }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: insets.top + spacing.sm,
          borderBottomColor: colors.slate800,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.brand}>
          <View style={styles.avatarWrap}>
            <MaterialCommunityIcons
              name="account-circle"
              size={36}
              color={colors.onSurfaceVariant}
            />
          </View>
          <Text style={styles.logo}>Vitality</Text>
        </View>
        <Pressable
          onPress={() => router.push(href.perfil)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil y ajustes"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={26}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "rgba(2, 6, 23, 0.88)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 4,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: font.semibold,
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.3,
    textShadowColor: "rgba(45, 212, 191, 0.35)",
    textShadowRadius: 10,
  },
});
