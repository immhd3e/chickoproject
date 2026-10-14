import Image from "next/image";
import Link from "next/link";

import AddToCart from "./AddToCart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href} className="font-bold text-stone-950 transition hover:text-amber-700">
          {product.title}
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">{product.description}</p>

        <p className="mt-3 font-bold text-stone-950">{formatPrice(product.price)}</p>

        <div className="mt-auto pt-4">
          <AddToCart
            item={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>
    </article>
  );
}