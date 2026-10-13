"use client";

import { ShoppingBag } from "lucide-react";

import { useCart, type CartItem } from "@/components/cart/CartProvider";

export default function AddToCart({ item }: { item: Omit<CartItem, "qty"> }) {
  const { add, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        add(item);
        openCart();
      }}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-stone-950 text-sm font-semibold text-white transition hover:bg-amber-700"
    >
      <ShoppingBag size={18} />
      افزودن به سبد
    </button>
  );
}