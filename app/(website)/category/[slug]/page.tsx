import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryBrowser from "@/components/category/CategoryBrowser";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { toFa } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  return { title: category?.title ?? "دسته‌بندی", description: category?.description };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const list = products.filter((p) => p.category === category.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <Image src={category.image} alt={category.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-stone-950 via-stone-950/80 to-stone-950/30" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:py-24">
          <Breadcrumb
            light
            items={[
              { label: "خانه", href: "/" },
              { label: "محصولات", href: "/products" },
              { label: category.title },
            ]}
          />

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">{category.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-8 text-stone-200 sm:text-base">{category.description}</p>
          <p className="mt-5 text-sm text-amber-400">{toFa(list.length)} محصول</p>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <CategoryBrowser category={category} products={list} />
      </Suspense>
    </>
  );
}