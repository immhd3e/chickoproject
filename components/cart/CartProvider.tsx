"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  slug: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const KEY = "mdf_cart";
const MAX_QTY = 20;

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود");
  return ctx;
}

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    return data.filter(
      (i) =>
        i &&
        typeof i.id === "number" &&
        typeof i.price === "number" &&
        typeof i.qty === "number" &&
        i.qty > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const clamp = (q: number) => Math.min(MAX_QTY, Math.max(1, q));

    return {
      items,
      ready,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),

      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.id === item.id);
          if (found) {
            return prev.map((i) =>
              i.id === item.id ? { ...i, qty: clamp(i.qty + qty) } : i
            );
          }
          return [...prev, { ...item, qty: clamp(qty) }];
        }),

      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty: clamp(qty) } : i))
        ),

      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),

      clear: () => setItems([]),
    };
  }, [items, ready, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}