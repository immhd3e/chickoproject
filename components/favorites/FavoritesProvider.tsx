"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type FavoritesContextValue = {
  ids: number[];
  count: number;
  ready: boolean;
  has: (id: number) => boolean;
  toggle: (id: number) => void;
};

const KEY = "mdf_favorites";

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites باید داخل FavoritesProvider استفاده شود");
  return ctx;
}

function readStorage(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(readStorage());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, ready]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      count: ids.length,
      ready,
      has: (id) => ids.includes(id),
      toggle: (id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    }),
    [ids, ready]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}