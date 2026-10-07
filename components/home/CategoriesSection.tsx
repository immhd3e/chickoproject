import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { categories } from "@/data/categories";

export default function CategoriesSection() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-amber-700">
              CATEGORIES
            </p>

            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
              دسته‌بندی محصولات
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              مجموعه‌ای از محصولات MDF برای بخش‌های مختلف خانه،
              اتاق کودک و فضای کاری با امکان طراحی و اجرای سفارشی.
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

        {/* Categories Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-lg font-bold text-white">
                    {category.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-sm leading-6 text-stone-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-sm font-semibold text-stone-800">
                  <span>مشاهده محصولات</span>

                  <ArrowLeft
                    size={17}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}