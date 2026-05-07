import { Stack } from "expo-router";

export default function ImcStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="resultado" />
    </Stack>
  );
}
