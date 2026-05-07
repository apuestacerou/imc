import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "./context/AuthContext";
import { href } from "./routeHrefs";
import { colors } from "./theme/vitality";

export default function Index() {
  const { authReady, token } = useAuth();

  if (!authReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!token) {
    return <Redirect href={href.authRegister} />;
  }

  return <Redirect href={href.tabsImc} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
