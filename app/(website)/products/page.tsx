import Link from "next/link";
import type { Metadata } from "next";

import ProductCard from "@/components/shop/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const metadata: Metadata = { title: "محصولات" };

type Props = { searchParams: Promise<{ category?: string; type?: string; q?: string }> };
export const instant = false;
export default async function ProductsPage({ searchParams }: Props) {
  const { category, type, q } = await searchParams;

  const list = products.filter(
    (p) => (!category || p.category === category) && (!type || p.type === type) && (!q || p.title.includes(q))
  );

  const current = categories.find((c) => c.slug === category);
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition ${
      active ? "border-stone-950 bg-stone-950 text-white" : "border-stone-300 bg-white text-stone-700 hover:border-amber-600 hover:text-amber-700"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">{current ? current.title : "همهٔ محصولات"}</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/products" className={chip(!category)}>همه</Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className={chip(category === c.slug)}>{c.title}</Link>
        ))}
      </div>

      {list.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-stone-500">محصولی با این فیلتر پیدا نشد.</p>
      )}
    </section>
  );
}
