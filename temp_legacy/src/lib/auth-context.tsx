"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as api from "./api";

interface AuthState {
  user: api.AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    name: string;
    role?: "customer" | "owner";
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "bly_auth";

interface Persisted {
  user: api.AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setLoading(false);
      return;
    }
    try {
      const persisted: Persisted = JSON.parse(raw);
      setUser(persisted.user);
      setAccessToken(persisted.accessToken);
      // Verify the token is still valid in the background; log out silently if not.
      api
        .fetchMe(persisted.accessToken)
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
          setAccessToken(null);
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setLoading(false);
    }
  }, []);

  const persist = (res: api.AuthResponse) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken }),
    );
    setUser(res.user);
    setAccessToken(res.accessToken);
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.login({ email, password });
      persist(res);
    } catch (e) {
      setError(e instanceof api.ApiError ? e.message : "Sign in failed");
      throw e;
    }
  };

  const register: AuthState["register"] = async (input) => {
    setError(null);
    try {
      const res = await api.register(input);
      persist(res);
    } catch (e) {
      setError(e instanceof api.ApiError ? e.message : "Registration failed");
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, error, login, register, logout, clearError: () => setError(null) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
