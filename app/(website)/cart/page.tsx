import type { Metadata } from "next";

import CartView from "@/components/cart/CartView";

export const metadata: Metadata = { title: "سبد خرید" };

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-stone-900">سبد خرید</h1>
      <CartView />
    </section>
  );
}
