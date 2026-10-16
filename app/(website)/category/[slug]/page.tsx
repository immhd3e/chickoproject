import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import AddCollectionToCart from "@/components/collection/AddCollectionToCart";
import ProductCard from "@/components/shop/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { products, type Product } from "@/data/products";
import { formatPrice, toFa } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = collections.find((c) => c.slug === slug);
  return { title: col?.title ?? "مجموعه", description: col?.description };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const col = collections.find((c) => c.slug === slug);

  if (!col) {
    // اگر اسم یک دسته را مستقیم زدند (مثل /category/wardrobe)، به صفحهٔ همهٔ محصولات همان دسته می‌رود
    if (categories.some((c) => c.slug === slug)) redirect(`/products?category=${slug}`);
    notFound();
  }

  const category = categories.find((c) => c.slug === col.category);
  const items = col.itemIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const total = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "محصولات", href: "/products" },
          ...(category ? [{ label: category.title, href: `/products?category=${category.slug}` }] : []),
          { label: col.title },
        ]}
      />

      {/* عکس کلی طرح + قیمت کل */}
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
          <Image
            src={col.image}
            alt={col.title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-[1.5] text-stone-950">{col.title}</h1>
          <p className="mt-4 leading-8 text-stone-600">{col.description}</p>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">قیمت کل مجموعه ({toFa(items.length)} محصول)</p>
            <p className="mt-1 text-2xl font-bold text-amber-700">{formatPrice(total)}</p>
          </div>

          <div className="mt-5">
            <AddCollectionToCart
              items={items.map((p) => ({
                id: p.id,
                slug: p.slug,
                title: p.title,
                price: p.price,
                image: p.image,
              }))}
            />
          </div>

          <p className="mt-4 text-xs leading-6 text-stone-500">هزینهٔ ارسال و نصب بعد از تأیید سفارش اعلام می‌شود.</p>

          <Link
            href="/contact?subject=custom"
            className="mt-5 inline-flex w-fit items-center rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-amber-600 hover:text-amber-700"
          >
            طرح یا ابعاد دیگری می‌خواهید؟ درخواست مشاوره
          </Link>
        </div>
      </div>

      {/* تک‌تک محصولات مجموعه */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-950">محصولات این مجموعه</h2>
        <p className="mt-2 text-sm text-stone-500">
          روی هر محصول بزنید تا توضیحات کامل آن را ببینید، یا مستقیم به سبد اضافه‌اش کنید.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}