import Image from "next/image";
import Link from "next/link";

import AddToCart from "@/components/shop/AddToCart";
import type { Focus } from "@/data/collections";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

// یک جزء از مجموعه: عکس خودش (image)، یا اگر focus داده شده، برشی از عکس کلی
export default function PartCard({
  product,
  image,
  wholeImage,
  focus,
}: {
  product: Product;
  image: string;
  wholeImage: string;
  focus?: Focus;
}) {
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-stone-100" aria-label={product.title}>
        {focus ? (
          <div
            role="img"
            aria-label={product.title}
            className="absolute inset-0 transition duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${wholeImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${(focus.zoom ?? 2) * 100}%`,
              backgroundPosition: `${focus.x}% ${focus.y}%`,
            }}
          />
        ) : (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href} className="font-bold text-stone-950 transition hover:text-amber-700">
          {product.title}
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">{product.description}</p>

        <p className="mt-3 text-lg font-bold text-amber-700">{formatPrice(product.price)}</p>

        <div className="mt-auto space-y-3 pt-4">
          <AddToCart
            item={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              image: product.image,
            }}
          />
          <Link href={href} className="block text-center text-sm font-semibold text-stone-700 transition hover:text-amber-700">
            مشاهدهٔ توضیحات کامل
          </Link>
        </div>
      </div>
    </article>
  );
}