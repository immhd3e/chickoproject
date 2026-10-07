"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedProducts() {
  const featuredProducts = products.filter(
    (product) => product.isFeatured
  );

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-amber-700">
              FEATURED PRODUCTS
            </p>

            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
              محصولات پیشنهادی
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              تعدادی از محصولات منتخب MDF Factory با طراحی مدرن،
              کیفیت ساخت بالا و امکان شخصی‌سازی.
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

        {/* ================= PRODUCTS SLIDER ================= */}

        <div className="relative mt-10">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            navigation={{
              nextEl: ".featured-next",
              prevEl: ".featured-prev",
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={featuredProducts.length > 3}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="featured-products-swiper pb-10"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ================= PREVIOUS ================= */}

          <button
            type="button"
            className="featured-prev absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-md transition hover:bg-amber-600 hover:text-white sm:right-3"
            aria-label="محصول قبلی"
          >
            <ArrowRight size={18} />
          </button>

          {/* ================= NEXT ================= */}

          <button
            type="button"
            className="featured-next absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-md transition hover:bg-amber-600 hover:text-white sm:left-3"
            aria-label="محصول بعدی"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>

      {/* ================= SWIPER STYLES ================= */}

      <style jsx global>{`
        .featured-products-swiper {
          width: 100%;
        }

        .featured-products-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .featured-products-swiper .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          margin: 0 3px !important;
          background: #78716c;
          opacity: 0.35;
          transition: all 0.3s ease;
        }

        .featured-products-swiper
          .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 999px;
          background: #d97706;
          opacity: 1;
        }

        @media (min-width: 1024px) {
          .featured-products-swiper .swiper-pagination {
            display: none;
          }

          .featured-prev,
          .featured-next {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .featured-products-swiper {
            padding-bottom: 35px;
          }
        }
      `}</style>
    </section>
  );
}