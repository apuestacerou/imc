import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Inicio", headerShown: true }} />
      <Stack.Screen
        name="adultos"
        options={{ title: "Adultos", headerBackTitle: "Inicio" }}
      />
      <Stack.Screen
        name="ninos"
        options={{ title: "Niños y adolescentes", headerBackTitle: "Inicio" }}
      />
    </Stack>
  );
}
