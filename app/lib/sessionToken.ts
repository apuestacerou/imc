import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "vitality_jwt";

function webGet(): string | null {
  if (typeof globalThis.localStorage === "undefined") return null;
  try {
    return globalThis.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function webSet(value: string): void {
  if (typeof globalThis.localStorage === "undefined") return;
  globalThis.localStorage.setItem(TOKEN_KEY, value);
}

function webRemove(): void {
  if (typeof globalThis.localStorage === "undefined") return;
  try {
    globalThis.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function getSessionToken(): Promise<string | null> {
  if (Platform.OS === "web") return webGet();
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setSessionToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    webSet(token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  if (Platform.OS === "web") {
    webRemove();
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
