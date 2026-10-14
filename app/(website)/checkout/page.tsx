import type { Metadata } from "next";

import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "ثبت سفارش" };

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-stone-900">ثبت سفارش</h1>
      <CheckoutForm />
    </section>
  );
}
