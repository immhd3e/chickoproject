import { Suspense } from "react";
import type { Metadata } from "next";

import FavoritesView from "@/components/favorites/FavoritesView";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

async function Content() {
  const products = await getProducts();
  return <FavoritesView products={products} />;
}

export default function FavoritesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-stone-900">علاقه‌مندی‌ها</h1>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Content />
      </Suspense>
    </section>
  );
}