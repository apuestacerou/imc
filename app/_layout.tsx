import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
  Lexend_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/lexend";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { BackendStatusNotice } from "./components/BackendStatusNotice";
import { AuthProvider } from "./context/AuthContext";
import { WellnessProvider } from "./context/WellnessContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, err] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || err) {
      SplashScreen.hideAsync();
    }
  }, [loaded, err]);

  if (!loaded && !err) {
    return null;
  }

  return (
    <AuthProvider>
      <WellnessProvider>
        <BackendStatusNotice />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="perfil"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen name="adultos" />
          <Stack.Screen name="ninos" />
        </Stack>
      </WellnessProvider>
    </AuthProvider>
  );
}
