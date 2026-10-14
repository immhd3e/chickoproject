"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import { useCart, type CartItem } from "@/components/cart/CartProvider";
import { toFa } from "@/lib/format";

export default function AddToCartPanel({ item }: { item: Omit<CartItem, "qty"> }) {
  const { add, openCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex h-12 items-center justify-between rounded-xl border border-stone-300 sm:w-36">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="کم کردن"
          className="flex h-12 w-12 items-center justify-center rounded-xl transition hover:bg-stone-100"
        >
          <Minus size={16} />
        </button>
        <span className="font-bold">{toFa(qty)}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(20, q + 1))}
          aria-label="زیاد کردن"
          className="flex h-12 w-12 items-center justify-center rounded-xl transition hover:bg-stone-100"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          add(item, qty);
          openCart();
        }}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500"
      >
        <ShoppingBag size={18} />
        افزودن به سبد خرید
      </button>
    </div>
  );
}