"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/shop/ProductCard";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import { toFa } from "@/lib/format";

export default function CategoryBrowser({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const type = useSearchParams().get("type");
  const activeType = category.items.find((i) => i.slug === type) ?? null;

  const list = activeType ? products.filter((p) => p.type === activeType.slug) : products;
  const base = `/category/${category.slug}`;

  const tiles = [
    { slug: "", title: "همهٔ مدل‌ها", image: category.image, count: products.length },
    ...category.items.map((i) => ({
      slug: i.slug,
      title: i.title,
      image: products.find((p) => p.type === i.slug)?.image ?? category.image,
      count: products.filter((p) => p.type === i.slug).length,
    })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="text-2xl font-bold text-stone-950">مدل‌ها</h2>
      <p className="mt-2 text-sm text-stone-500">یک مدل را انتخاب کنید تا محصولات آن نشان داده شود.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => {
          const active = (activeType?.slug ?? "") === t.slug;
          return (
            <Link
              key={t.slug || "all"}
              href={t.slug ? `${base}?type=${t.slug}` : base}
              scroll={false}
              replace
              aria-current={active ? "true" : undefined}
              className={`group overflow-hidden rounded-2xl border bg-white transition ${
                active ? "border-amber-600 ring-2 ring-amber-200" : "border-stone-200 hover:border-amber-500"
              }`}
            >
              <div className="relative aspect-[4/3] bg-stone-100">
                <Image
                  src={t.image}
                  alt={t.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 text-center">
                <p className={`text-sm font-bold ${active ? "text-amber-700" : "text-stone-900"}`}>{t.title}</p>
                <p className="mt-0.5 text-xs text-stone-500">{toFa(t.count)} محصول</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-14 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-stone-950">
          {activeType ? activeType.title : "همهٔ محصولات"}
          <span className="mr-2 text-base font-normal text-stone-500">({toFa(list.length)})</span>
        </h2>
      </div>

      {list.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-stone-500">هنوز محصولی در این مدل ثبت نشده است.</p>
      )}
    </div>
  );
}