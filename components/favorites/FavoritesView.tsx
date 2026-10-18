"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useFavorites } from "./FavoritesProvider";
import ProductCard from "@/components/shop/ProductCard";
import { products } from "@/data/products";
import { toFa } from "@/lib/format";

export default function FavoritesView() {
  const { ids, ready } = useFavorites();

  if (!ready) return <div className="min-h-[50vh]" />;

  const list = products.filter((p) => ids.includes(p.id));

  if (!list.length) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <Heart size={36} />
        </div>
        <h2 className="mt-6 text-xl font-bold text-stone-900">هنوز چیزی در علاقه‌مندی‌ها نیست</h2>
        <p className="mt-2 text-sm text-stone-500">روی قلب هر محصول بزنید تا اینجا ذخیره شود.</p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-stone-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          دیدن محصولات
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-stone-500">{toFa(list.length)} محصول</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}