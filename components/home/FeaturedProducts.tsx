import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProductCard from "@/components/shop/ProductCard";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-amber-700">FEATURED PRODUCTS</p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">محصولات پیشنهادی</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              تعدادی از محصولات منتخب MDF چیکو با طراحی مدرن، کیفیت ساخت بالا و امکان شخصی‌سازی.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-stone-800 transition hover:text-amber-700"
          >
            مشاهده همه محصولات
            <ArrowLeft size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}