import type { Href } from "expo-router";

/** Rutas físicas de la app; el tipado generado de expo-router puede quedar desfasado. */
export const href = {
  authRegister: "/(auth)" as unknown as Href,
  authLogin: "/(auth)/login" as unknown as Href,
  tabsImc: "/(tabs)/imc" as unknown as Href,
  tabsImcResultado: "/(tabs)/imc/resultado" as unknown as Href,
  perfil: "/perfil" as unknown as Href,
  ninosImc: {
    pathname: "/(tabs)/imc",
    params: { modo: "nino" as const },
  } as unknown as Href,
} as const;
