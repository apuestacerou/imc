import Constants from "expo-constants";
import { Platform } from "react-native";

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

/**
 * Host de la PC donde corre Metro (y suele correr el API). Soporta `host:puerto` y `http://...`.
 * Importante: si `hostUri` trae `http://`, hacer split(":")[0] rompía la IP ("http").
 */
function extractLanHost(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const t = raw.trim();
  try {
    const href = t.includes("://") ? t : `http://${t}`;
    const host = new URL(href).hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") return host;
  } catch {
    /* URL inválida */
  }
  return null;
}

/**
 * En Expo Go / dev, la misma máquina que sirve Metro suele tener el API en el puerto 3000.
 */
function inferDevApiBase(): string {
  const candidates: (string | null | undefined)[] = [
    Constants.expoConfig?.hostUri,
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost,
    (Constants as { manifest?: { debuggerHost?: string } | null }).manifest?.debuggerHost,
    (
      Constants.manifest2 as
        | { extra?: { expoGo?: { debuggerHost?: string } } }
        | null
        | undefined
    )?.extra?.expoGo?.debuggerHost,
  ];
  for (const c of candidates) {
    const host = extractLanHost(c);
    if (host) return `http://${host}:3000`;
  }
  // Emulador Android cuando el manifiesto ya apunta a 10.0.2.2
  if (__DEV__ && Platform.OS === "android") {
    const u = Constants.expoConfig?.hostUri ?? "";
    if (u.includes("10.0.2.2")) return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
}

const BASE = trimTrailingSlash(
  process.env.EXPO_PUBLIC_API_URL?.trim() || inferDevApiBase()
);

export type ApiUser = {
  id: string;
  email: string;
  nombre: string;
  edad: number;
  alturaCm: number;
  pesoInicialKg: number;
  createdAt?: string;
};

export type ApiImcRegistro = {
  id: string;
  pesoKg: number;
  alturaCm: number;
  imc: number;
  categoria: string;
  modo: "adulto" | "nino";
  zScore?: number;
  recordedAt: string;
};

/** Perfil local usado por la calculadora (campos alineados a `UserProfile`). */
export function apiUserToProfile(u: ApiUser): {
  nombre: string;
  email: string;
  edad: number;
  alturaCm: number;
  pesoInicialKg: number;
} {
  return {
    nombre: u.nombre,
    email: u.email,
    edad: u.edad,
    alturaCm: u.alturaCm,
    pesoInicialKg: u.pesoInicialKg,
  };
}

export function apiRegistroToHistoryEntry(r: ApiImcRegistro): {
  id: string;
  at: number;
  pesoKg: number;
  alturaCm: number;
  imc: number;
  categoria: string;
  modo: "adulto" | "nino";
  zScore?: number;
} {
  return {
    id: r.id,
    at: new Date(r.recordedAt).getTime(),
    pesoKg: r.pesoKg,
    alturaCm: r.alturaCm,
    imc: r.imc,
    categoria: r.categoria,
    modo: r.modo,
    zScore: r.zScore,
  };
}

/** Incluye ida al API + bcrypt + Neon; 28s era corto en redes lentas o cold start. */
const API_FETCH_TIMEOUT_MS = 60_000;

async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), API_FETCH_TIMEOUT_MS);
  const { signal: userSig, ...rest } = init;
  if (userSig) {
    if (userSig.aborted) ctrl.abort();
    else userSig.addEventListener("abort", () => ctrl.abort(), { once: true });
  }
  try {
    return await fetch(url, { ...rest, signal: ctrl.signal });
  } catch (e: unknown) {
    const name = e && typeof e === "object" && "name" in e ? (e as Error).name : "";
    if (name === "AbortError") {
      const s = Math.round(API_FETCH_TIMEOUT_MS / 1000);
      throw new Error(
        `Sin respuesta del API en ${s}s. Revisa: PC con npm run dev en server/, misma red o EXPO_PUBLIC_API_URL, firewall puerto 3000. Si el API en la PC responde lento, en server/.env quita channel_binding de DATABASE_URL (Neon + Node).`
      );
    }
    const msg = e instanceof Error ? e.message : String(e);
    if (/Network request failed|Failed to fetch|network error/i.test(msg)) {
      throw new Error(
        __DEV__
          ? `Sin conexión a ${BASE}. Arranca el API en server/ (npm run dev), misma Wi‑Fi, y si sigue fallando crea .env con EXPO_PUBLIC_API_URL=http://TU_IP:3000 (la IP sale al hacer npm start).`
          : "No se pudo conectar al servidor."
      );
    }
    throw e instanceof Error ? e : new Error("Error de red.");
  } finally {
    clearTimeout(t);
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Respuesta no válida del servidor.");
  }
  if (!res.ok) {
    const msg =
      typeof (data as { error?: string }).error === "string"
        ? (data as { error: string }).error
        : `Error ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function apiRegister(body: {
  email: string;
  password: string;
  nombre: string;
  edad: number;
  alturaCm: number;
  pesoInicialKg: number;
}): Promise<{ token: string; user: ApiUser }> {
  const res = await apiFetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string; user: ApiUser }> {
  const res = await apiFetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson(res);
}

export async function apiMe(token: string): Promise<ApiUser> {
  const res = await apiFetch(`${BASE}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(res);
}

export async function apiPatchMe(
  token: string,
  body: Partial<{
    nombre: string;
    edad: number;
    alturaCm: number;
    pesoInicialKg: number;
  }>
): Promise<ApiUser> {
  const res = await apiFetch(`${BASE}/api/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function apiListImcRegistros(token: string): Promise<ApiImcRegistro[]> {
  const res = await apiFetch(`${BASE}/api/imc-registros`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(res);
}

export async function apiCreateImcRegistro(
  token: string,
  body: {
    pesoKg: number;
    alturaCm: number;
    imc: number;
    categoria: string;
    modo: "adulto" | "nino";
    zScore?: number;
    recordedAt?: number;
  }
): Promise<ApiImcRegistro> {
  const res = await apiFetch(`${BASE}/api/imc-registros`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      recordedAt: body.recordedAt
        ? new Date(body.recordedAt).toISOString()
        : undefined,
    }),
  });
  return parseJson(res);
}

export async function apiDeleteAllImcRegistros(token: string): Promise<void> {
  const res = await apiFetch(`${BASE}/api/imc-registros`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await parseJson(res);
}

export function getApiBaseUrl(): string {
  return BASE;
}

export type ApiHealthResult = {
  ok: boolean;
  api: boolean;
  database: boolean;
  error?: string;
};

const HEALTH_FETCH_TIMEOUT_MS = 35_000;

/** Comprueba API + base (Neon). No lanza si el servidor responde con JSON de error. */
export async function apiHealth(): Promise<ApiHealthResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), HEALTH_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}/api/health`, {
      method: "GET",
      signal: ctrl.signal,
    });
    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      return {
        ok: false,
        api: true,
        database: false,
        error: "Respuesta no válida del servidor.",
      };
    }
    return {
      ok: data.ok === true,
      api: data.api !== false,
      database: data.database === true,
      error: typeof data.error === "string" ? data.error : undefined,
    };
  } catch (e: unknown) {
    const name = e && typeof e === "object" && "name" in e ? (e as Error).name : "";
    if (name === "AbortError") {
      const s = Math.round(HEALTH_FETCH_TIMEOUT_MS / 1000);
      return {
        ok: false,
        api: false,
        database: false,
        error: `Sin respuesta del API en ${s}s (¿PC encendida, npm run dev en server/, firewall o otra red?).`,
      };
    }
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      api: false,
      database: false,
      error: msg,
    };
  } finally {
    clearTimeout(t);
  }
}
