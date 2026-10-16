import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { toFa } from "@/lib/format";

export const metadata: Metadata = { title: "محصولات" };

type Props = {
  searchParams: Promise<{ category?: string; type?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, type, q } = await searchParams;

  const currentCat = categories.find((c) => c.slug === category);
  const types = currentCat?.items ?? [];
  const activeType = types.find((t) => t.slug === type);

  const list = collections.filter((col) => {
    if (category && col.category !== category) return false;

    const items = products.filter((p) => col.itemIds.includes(p.id));
    if (activeType && !items.some((p) => p.type === activeType.slug)) return false;
    if (q && !(col.title.includes(q) || items.some((p) => p.title.includes(q)))) return false;

    return true;
  });

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition ${
      active
        ? "border-stone-950 bg-stone-950 text-white"
        : "border-stone-300 bg-white text-stone-700 hover:border-amber-600 hover:text-amber-700"
    }`;

  const typeChip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs transition ${
      active
        ? "border-amber-600 bg-amber-600 text-white"
        : "border-stone-300 bg-white text-stone-600 hover:border-amber-600 hover:text-amber-700"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">{currentCat ? currentCat.title : "همهٔ محصولات"}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">
        {currentCat ? currentCat.description : "مجموعه‌های آماده‌ی MDF Factory را ببینید و هر کدام را مفصل بررسی کنید."}
      </p>

      {/* دسته‌ها */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/products" className={chip(!category)} aria-current={!category ? "true" : undefined}>
          همه
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={chip(category === c.slug)}
            aria-current={category === c.slug ? "true" : undefined}
          >
            {c.title}
          </Link>
        ))}
      </div>

      {/* مدل‌های دستهٔ انتخاب‌شده */}
      {currentCat && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/products?category=${currentCat.slug}`}
            className={typeChip(!activeType)}
            aria-current={!activeType ? "true" : undefined}
          >
            همهٔ مدل‌ها
          </Link>
          {types.map((t) => (
            <Link
              key={t.slug}
              href={`/products?category=${currentCat.slug}&type=${t.slug}`}
              className={typeChip(activeType?.slug === t.slug)}
              aria-current={activeType?.slug === t.slug ? "true" : undefined}
            >
              {t.title}
            </Link>
          ))}
        </div>
      )}

      {/* مجموعه‌ها (بدون قیمت) */}
      {list.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((col) => (
            <Link
              key={col.slug}
              href={`/category/${col.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <h2 className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">{col.title}</h2>
              </div>

              <div className="p-5">
                <p className="line-clamp-2 text-sm leading-6 text-stone-500">{col.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4 text-sm font-semibold text-stone-800">
                  <span>{toFa(col.itemIds.length)} محصول در این مجموعه</span>
                  <ArrowLeft size={17} className="transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-stone-500">هنوز مجموعه‌ای برای این انتخاب ثبت نشده است.</p>
      )}
    </section>
  );
}