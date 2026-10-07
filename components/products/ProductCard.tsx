
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        {product.isFeatured && (
          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm">
            پیشنهادی
          </span>
        )}

        <button
          type="button"
          aria-label="افزودن به علاقه‌مندی‌ها"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow-sm transition hover:bg-stone-950 hover:text-white"
        >
          <Heart size={17} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-medium text-amber-700">
          {product.material}
        </p>

        <h2 className="mt-2 text-lg font-bold text-stone-900">
          {product.name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
          {product.description}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-sm font-semibold text-stone-800 transition hover:text-amber-700"
        >
          مشاهده محصول

          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

