import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/vitality";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const padBottom = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "rgba(2, 6, 23, 0.94)",
          borderTopColor: colors.slate800,
          borderTopWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 1,
          height: 56 + padBottom,
          paddingBottom: padBottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Lexend_600SemiBold",
          letterSpacing: 0.6,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="imc"
        options={{
          title: "IMC",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calculate" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bar-chart" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recomendaciones"
        options={{
          title: "Consejos",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="auto-awesome" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
