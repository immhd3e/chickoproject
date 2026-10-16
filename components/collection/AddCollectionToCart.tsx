"use client";

import { ShoppingBag } from "lucide-react";

import { useCart, type CartItem } from "@/components/cart/CartProvider";

export default function AddCollectionToCart({ items }: { items: Omit<CartItem, "qty">[] }) {
  const { add, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        items.forEach((item) => add(item));
        openCart();
      }}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500"
    >
      <ShoppingBag size={18} />
      افزودن کل مجموعه به سبد
    </button>
  );
}