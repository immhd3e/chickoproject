import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import AddCollectionToCart from "@/components/collection/AddCollectionToCart";
import PartCard from "@/components/collection/PartCard";
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
    // اگر اسم یک دسته را مستقیم زدند (مثل /category/wardrobe)، به صفحهٔ محصولات همان دسته می‌رود
    if (categories.some((c) => c.slug === slug)) redirect(`/products?category=${slug}`);
    notFound();
  }

  const category = categories.find((c) => c.slug === col.category);
  const items = col.itemIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const total = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-10 sm:pt-14 lg:px-16">
      {/* ۱) عکس کامل و بزرگ (با فاصله از منو و گوشهٔ گرد) */}
      <section className="relative h-[260px] overflow-hidden rounded-3xl bg-stone-950 sm:h-[380px] lg:h-[500px]">
        <Image
          src={col.banner ?? col.image}
          alt={col.title}
          fill
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          <Breadcrumb
            light
            items={[
              { label: "خانه", href: "/" },
              { label: "محصولات", href: "/products" },
              ...(category ? [{ label: category.title, href: `/products?category=${category.slug}` }] : []),
              { label: col.title },
            ]}
          />
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-4xl lg:text-5xl">{col.title}</h1>
        </div>
      </section>

      {/* ۲) عکس کامل همراه با قیمت کل */}
      <section className="mt-20 grid items-center gap-10 sm:mt-24 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
          <Image
            src={col.image}
            alt={col.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-stone-900 backdrop-blur-sm">
            {formatPrice(total)}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-stone-950">کل مجموعه</h2>
          <p className="mt-4 leading-8 text-stone-600">{col.description}</p>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">قیمت کل مجموعه ({toFa(items.length)} محصول)</p>
            <p className="mt-1 text-3xl font-bold text-amber-700">{formatPrice(total)}</p>
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

          <p className="mt-4 text-xs leading-6 text-stone-500">
            هزینهٔ ارسال و نصب بعد از تأیید سفارش اعلام می‌شود.
          </p>

          <Link
            href="/contact?subject=custom"
            className="mt-5 inline-flex items-center rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-amber-600 hover:text-amber-700"
          >
            طرح یا ابعاد دیگری می‌خواهید؟ درخواست مشاوره
          </Link>
        </div>
      </section>

      {/* ۳) همان عکس، تکه‌تکه، هر جزء با قیمت خودش */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-stone-950">اجزای این مجموعه</h2>
        <p className="mt-2 text-sm text-stone-500">
          هر جزء را جداگانه ببینید؛ روی عکس یا نام آن بزنید تا توضیحات کامل باز شود، یا مستقیم به سبد اضافه‌اش کنید.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PartCard key={p.id} product={p} image={col.partImages?.[p.id] ?? p.image} wholeImage={col.image} focus={col.focus?.[p.id]} />
          ))}
        </div>
      </section>
    </div>
  );
}