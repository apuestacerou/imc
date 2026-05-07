import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiLogin, apiMe, apiRegister, type ApiUser } from "../lib/api";
import {
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from "../lib/sessionToken";

type AuthState = {
  authReady: boolean;
  token: string | null;
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (p: {
    email: string;
    password: string;
    nombre: string;
    edad: number;
    alturaCm: number;
    pesoInicialKg: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  /** Tras PATCH perfil en servidor. */
  setUserFromServer: (u: ApiUser) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t = await getSessionToken();
        if (cancelled) return;
        setToken(t);
        if (t) {
          try {
            const me = await apiMe(t);
            if (!cancelled) setUser(me);
          } catch {
            await clearSessionToken();
            if (!cancelled) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistToken = useCallback(async (t: string | null) => {
    if (t) await setSessionToken(t);
    else await clearSessionToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: tok, user: u } = await apiLogin(email, password);
    await persistToken(tok);
    setToken(tok);
    setUser(u);
  }, [persistToken]);

  const register = useCallback(
    async (p: {
      email: string;
      password: string;
      nombre: string;
      edad: number;
      alturaCm: number;
      pesoInicialKg: number;
    }) => {
      const { token: tok, user: u } = await apiRegister(p);
      try {
        await persistToken(tok);
      } catch {
        throw new Error(
          "La cuenta se creó en el servidor, pero no se pudo guardar la sesión en el dispositivo. Cierra la app e inicia sesión con tu correo."
        );
      }
      setToken(tok);
      setUser(u);
    },
    [persistToken]
  );

  const logout = useCallback(async () => {
    await persistToken(null);
    setToken(null);
    setUser(null);
  }, [persistToken]);

  const setUserFromServer = useCallback((u: ApiUser) => {
    setUser(u);
  }, []);

  const value = useMemo(
    () => ({
      authReady,
      token,
      user,
      login,
      register,
      logout,
      setUserFromServer,
    }),
    [authReady, token, user, login, register, logout, setUserFromServer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
