import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import FavoriteButton from "@/components/favorites/FavoriteButton";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/shop/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getCategories, getProductBySlug, getProducts } from "@/lib/catalog";
import { formatPrice, toFa } from "@/lib/format";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.title ?? "محصول", description: product?.shortDescription ?? product?.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [all, categories] = await Promise.all([getProducts(), getCategories()]);
  const category = categories.find((c) => c.slug === product.category);
  const type = category?.items.find((i) => i.slug === product.type);
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  const specs = [
    { label: "دسته‌بندی", value: category?.title },
    { label: "مدل", value: type?.title },
    { label: "کد محصول", value: product.code },
    ...(product.specs ?? [
      { label: "جنس بدنه", value: "MDF" },
      { label: "ابعاد و رنگ", value: "سفارشی، مطابق فضای شما" },
    ]),
  ].filter((s) => s.value);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: category?.title ?? "محصولات", href: category ? `/products?category=${category.slug}` : "/products" },
          { label: product.title },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images ?? [product.image]} title={product.title} />

        <div>
          <h1 className="text-3xl font-bold leading-[1.5] text-stone-950">{product.title}</h1>
          {product.code && <p className="mt-1 text-sm text-stone-500">کد محصول: <span dir="ltr">{product.code}</span></p>}

          <div className="mt-3">
            <FavoriteButton productId={product.id} title={product.title} variant="inline" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold text-amber-700">{formatPrice(product.price)}</p>
            {discount > 0 && product.oldPrice && (
              <>
                <p className="text-base text-stone-400 line-through">{formatPrice(product.oldPrice)}</p>
                <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">{toFa(discount)}٪ تخفیف</span>
              </>
            )}
          </div>

          {product.shortDescription && <p className="mt-4 font-medium leading-8 text-stone-700">{product.shortDescription}</p>}
          <p className="mt-4 leading-8 text-stone-600">{product.description}</p>

          {product.colors && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-stone-700">رنگ‌های موجود</p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <span key={c.name} className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1.5 pl-3 pr-1.5 text-xs text-stone-700">
                    <span className="h-5 w-5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.features.length > 0 && (
            <ul className="mt-6 space-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-stone-700">
                  <CheckCircle2 size={18} className="shrink-0 text-amber-600" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <AddToCartPanel
              item={{ id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.image }}
            />
          </div>

          <p className="mt-4 text-xs leading-6 text-stone-500">هزینهٔ ارسال و نصب بعد از تأیید سفارش اعلام می‌شود.</p>

          <Link
            href="/contact?subject=custom"
            className="mt-6 inline-flex items-center rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-amber-600 hover:text-amber-700"
          >
            ابعاد یا طرح دیگری می‌خواهید؟ درخواست مشاوره
          </Link>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold text-stone-950">مشخصات</h2>
        <dl className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {specs.map((s, i) => (
            <div key={s.label} className={`flex gap-4 px-5 py-4 text-sm ${i > 0 ? "border-t border-stone-100" : ""}`}>
              <dt className="w-32 shrink-0 text-stone-500">{s.label}</dt>
              <dd className="font-medium text-stone-900">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-stone-950">محصولات مشابه</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}