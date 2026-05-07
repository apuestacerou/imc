import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  apiCreateImcRegistro,
  apiDeleteAllImcRegistros,
  apiListImcRegistros,
  apiRegistroToHistoryEntry,
  apiUserToProfile,
} from "../lib/api";
import { useAuth } from "./AuthContext";

const STORAGE_PROFILE = "vitality_profile_v1";
const STORAGE_HISTORY = "vitality_history_v1";

export type Genero = "masculino" | "femenino";

export type UserProfile = {
  nombre: string;
  email: string;
  edad: number;
  alturaCm: number;
  pesoInicialKg: number;
};

export type HistoryEntry = {
  id: string;
  at: number;
  pesoKg: number;
  alturaCm: number;
  imc: number;
  categoria: string;
  modo: "adulto" | "nino";
  zScore?: number;
};

export type LastResultAdulto = {
  modo: "adulto";
  imc: number;
  categoria: string;
  recomendacion: string;
  colorResultado: string;
  posicion: number;
  pesoKg: number;
  alturaCm: number;
  edad: number;
  genero: Genero;
  metabolismoKcal: number;
  pesoIdealMinKg: number;
  pesoIdealMaxKg: number;
};

export type LastResultNino = {
  modo: "nino";
  imc: number;
  zScore: number;
  categoria: string;
  recomendacion: string;
  colorResultado: string;
  posicion: number;
  pesoKg: number;
  alturaCm: number;
  edad: number;
  genero: Genero;
  referencia: string;
};

export type LastResult = LastResultAdulto | LastResultNino;

type WellnessState = {
  profile: UserProfile | null;
  history: HistoryEntry[];
  lastResult: LastResult | null;
  hydrated: boolean;
  setProfile: (p: UserProfile | null) => Promise<void>;
  addHistory: (e: Omit<HistoryEntry, "id" | "at"> & { at?: number }) => Promise<void>;
  setLastResult: (r: LastResult | null) => void;
  clearHistory: () => Promise<void>;
};

const WellnessContext = createContext<WellnessState | null>(null);

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!auth.authReady) return;
    let cancelled = false;

    if (!auth.token) {
      setProfileState(null);
      setHistory([]);
      setLastResult(null);
      void Promise.all([
        AsyncStorage.removeItem(STORAGE_PROFILE),
        AsyncStorage.removeItem(STORAGE_HISTORY),
      ]);
      setHydrated(true);
      return;
    }

    if (!auth.user) {
      setHydrated(false);
      return;
    }

    const p = apiUserToProfile(auth.user);
    setProfileState(p);
    void AsyncStorage.setItem(STORAGE_PROFILE, JSON.stringify(p));

    (async () => {
      const tok = auth.token;
      if (!tok) return;
      try {
        const list = await apiListImcRegistros(tok);
        if (cancelled) return;
        const mapped = list.map(apiRegistroToHistoryEntry);
        setHistory(mapped);
        await AsyncStorage.setItem(STORAGE_HISTORY, JSON.stringify(mapped));
      } catch {
        if (!cancelled) setHistory([]);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth.authReady, auth.token, auth.user]);

  const setProfile = useCallback(async (p: UserProfile | null) => {
    setProfileState(p);
    try {
      if (p) await AsyncStorage.setItem(STORAGE_PROFILE, JSON.stringify(p));
      else await AsyncStorage.removeItem(STORAGE_PROFILE);
    } catch {
      /* ignore */
    }
  }, []);

  const persistHistory = useCallback(async (entries: HistoryEntry[]) => {
    setHistory(entries);
    try {
      await AsyncStorage.setItem(STORAGE_HISTORY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, []);

  const addHistory = useCallback(
    async (e: Omit<HistoryEntry, "id" | "at"> & { at?: number }) => {
      const at = e.at ?? Date.now();
      let entry: HistoryEntry = {
        ...e,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        at,
      };

      if (auth.token) {
        try {
          const created = await apiCreateImcRegistro(auth.token, {
            pesoKg: e.pesoKg,
            alturaCm: e.alturaCm,
            imc: e.imc,
            categoria: e.categoria,
            modo: e.modo,
            zScore: e.zScore,
            recordedAt: at,
          });
          entry = apiRegistroToHistoryEntry(created);
        } catch {
          /* guarda solo en dispositivo si falla el servidor */
        }
      }

      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, 200);
        AsyncStorage.setItem(STORAGE_HISTORY, JSON.stringify(next)).catch(
          () => {}
        );
        return next;
      });
    },
    [auth.token]
  );

  const clearHistory = useCallback(async () => {
    if (auth.token) {
      try {
        await apiDeleteAllImcRegistros(auth.token);
      } catch {
        /* aún vaciamos en local */
      }
    }
    await persistHistory([]);
  }, [auth.token, persistHistory]);

  const value = useMemo(
    () => ({
      profile,
      history,
      lastResult,
      hydrated,
      setProfile,
      addHistory,
      setLastResult,
      clearHistory,
    }),
    [
      profile,
      history,
      lastResult,
      hydrated,
      setProfile,
      addHistory,
      clearHistory,
    ]
  );

  return (
    <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>
  );
}

export function useWellness() {
  const ctx = useContext(WellnessContext);
  if (!ctx) {
    throw new Error("useWellness debe usarse dentro de WellnessProvider");
  }
  return ctx;
}
