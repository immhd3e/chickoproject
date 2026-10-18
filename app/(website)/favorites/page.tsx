import type { Metadata } from "next";

import FavoritesView from "@/components/favorites/FavoritesView";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

export default function FavoritesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-stone-900">علاقه‌مندی‌ها</h1>
      <FavoritesView />
    </section>
  );
}