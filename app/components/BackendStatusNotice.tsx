import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { apiHealth, getApiBaseUrl } from "../lib/api";

/**
 * Al abrir la app: comprueba `/api/health` (incluye ping a Neon).
 * - Siempre escribe en consola Metro el resultado o el error.
 * - En __DEV__ muestra Alert si la base falla o no hay conexión al API.
 */
export function BackendStatusNotice() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const id = setTimeout(() => void check(), 600);
    return () => clearTimeout(id);
  }, []);

  return null;
}

async function check() {
  const base = getApiBaseUrl();
  const h = await apiHealth();
  if (h.database && h.ok) {
    console.log(`[Vitality] API y base de datos OK → ${base}`);
    return;
  }

  // El teléfono no recibió JSON del API a tiempo o no hubo conexión TCP.
  const noApiReach =
    h.api === false ||
    /Sin respuesta del API|Network|fetch|Failed|Abort/i.test(h.error ?? "");

  if (noApiReach) {
    const detail = h.error ?? "Sin respuesta del API";
    console.warn(`[Vitality] No se alcanzó el API (${base}):`, detail);
    if (__DEV__) {
      Alert.alert(
        "No llega el servidor",
        `${detail}\n\nURL intentada: ${base}\n\n• En la PC: cd server → npm run dev\n• Misma Wi‑Fi que el móvil (o prueba EXPO_PUBLIC_API_URL con la IP correcta)\n• Windows: firewall que permita el puerto 3000 entrante\n• Si la IP es 192.168.137.x suele ser hotspot/USB: permite conexiones o usa la IP de la Wi‑Fi real`,
        [{ text: "Entendido" }]
      );
    }
    return;
  }

  const detail = h.error ?? "database=false";
  console.warn(`[Vitality] API sí; Neon no (${base}):`, detail);
  if (__DEV__) {
    Alert.alert(
      "Base de datos (Neon)",
      `El API respondió pero la base no.\n\n${detail}\n\n• server/.env → DATABASE_URL\n• En Neon: SQL Editor → schema.sql\n• Si la URL lleva channel_binding=require y falla, prueba sin ese parámetro`,
      [{ text: "Entendido" }]
    );
  }
}
