"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import * as api from "@/lib/auth-api";
import type { Identifier } from "@/lib/auth-utils";

type AuthContextValue = {
  user: api.SessionUser | null;
  ready: boolean;
  check: (id: Identifier) => Promise<{ exists: boolean }>;
  login: (id: Identifier, password: string) => Promise<api.Result>;
  signup: (id: Identifier, name: string, password: string) => Promise<api.Result>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.me().then((u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  const value: AuthContextValue = {
    user,
    ready,
    check: api.checkAccount,
    login: async (id, password) => {
      const r = await api.login(id, password);
      if (r.ok) setUser(r.user);
      return r;
    },
    signup: async (id, name, password) => {
      const r = await api.signup(id, name, password);
      if (r.ok) setUser(r.user);
      return r;
    },
    logout: async () => {
      await api.logout();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
