import Link from "next/link";
import type { Metadata } from "next";

import ProductCard from "@/components/shop/ProductCard";
import { getCategories, getProducts } from "@/lib/catalog";
import { toFa } from "@/lib/format";

export const instant = false;
export const metadata: Metadata = { title: "محصولات" };

type Props = {
  searchParams: Promise<{ category?: string; type?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, type, q } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const currentCat = categories.find((c) => c.slug === category);
  const activeType = currentCat?.items.find((t) => t.slug === type);

  const list = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (type && p.type !== type) return false;
    if (q && !p.title.includes(q)) return false;
    return true;
  });

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition ${
      active
        ? "border-stone-950 bg-stone-950 text-white"
        : "border-stone-300 bg-white text-stone-700 hover:border-amber-600 hover:text-amber-700"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">
        {activeType ? activeType.title : currentCat ? currentCat.title : "همهٔ محصولات"}
      </h1>
      {currentCat && !activeType && currentCat.description && (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">{currentCat.description}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/products" className={chip(!category)}>
          همه
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/products?category=${c.slug}`} className={chip(category === c.slug)}>
            {c.title}
          </Link>
        ))}
      </div>

      {currentCat && currentCat.items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/products?category=${currentCat.slug}`} className={chip(!type)}>
            همهٔ مدل‌ها
          </Link>
          {currentCat.items.map((t) => (
            <Link
              key={t.slug}
              href={`/products?category=${currentCat.slug}&type=${t.slug}`}
              className={chip(type === t.slug)}
            >
              {t.title}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-stone-500">{toFa(list.length)} محصول</p>

      {list.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-stone-500">محصولی برای این انتخاب ثبت نشده است.</p>
      )}
    </section>
  );
}