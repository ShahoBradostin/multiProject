"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_KANBAN_API_URL ?? "http://localhost:8000";

export type AuthUser = {
  id: string;
  username: string;
};

export type AuthErrorCode = "usernameTaken" | "invalidCredentials" | "generic";

type AuthResult = { ok: true } | { ok: false; errorCode: AuthErrorCode };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function registerErrorCode(res: Response): Promise<AuthErrorCode> {
  try {
    const body = await res.json();
    if (body.detail === "Username already taken") return "usernameTaken";
  } catch {
    // fall through to generic
  }
  return "generic";
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
    if (!res.ok) return { ok: false, errorCode: "invalidCredentials" };
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
    if (!res.ok) return { ok: false, errorCode: await registerErrorCode(res) };
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
