"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { API_BASE } from "@/lib/api";

export type AuthUser = {
  id: string;
  username: string;
};

export type AuthErrorCode =
  | "usernameTaken"
  | "invalidCredentials"
  | "rateLimited"
  | "generic";

type AuthResult =
  | { ok: true }
  | { ok: false; errorCode: AuthErrorCode; suggestion?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function registerErrorInfo(
  res: Response,
): Promise<{ errorCode: AuthErrorCode; suggestion?: string }> {
  try {
    const body = await res.json();
    if (body.detail?.code === "username_taken") {
      return { errorCode: "usernameTaken", suggestion: body.detail.suggestion };
    }
  } catch {
    // fall through to generic
  }
  return { errorCode: "generic" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });
      setUser(res.ok ? await res.json() : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Checking the existing session on mount is the external-sync case
  // useEffect exists for; refresh's setState calls happen after the async
  // request resolves, not synchronously in this effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function login(username: string, password: string): Promise<AuthResult> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      return {
        ok: false,
        errorCode: res.status === 429 ? "rateLimited" : "invalidCredentials",
      };
    }
    setUser(await res.json());
    return { ok: true };
  }

  async function register(
    username: string,
    password: string,
  ): Promise<AuthResult> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const { errorCode, suggestion } = await registerErrorInfo(res);
      return { ok: false, errorCode, suggestion };
    }
    setUser(await res.json());
    return { ok: true };
  }

  async function logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
