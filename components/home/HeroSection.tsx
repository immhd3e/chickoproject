"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    image: "/images/home/hero-detail.jpg",
    label: "MDF FACTORY",
    title: "طراحی برای زندگی بهتر",
  },
  {
    image: "/images/categories/wardrobe.jpg",
    label: "WARDROBE DESIGN",
    title: "کمدهای مدرن و سفارشی",
  },
  {
    image: "/images/categories/kids-room.jpg",
    label: "KIDS ROOM",
    title: "طراحی اتاق کودک",
  },
  {
    image: "/images/categories/bedroom.jpg",
    label: "BEDROOM DESIGN",
    title: "سرویس خواب مدرن",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <Image
          src="/images/home/hero.jpg"
          alt="طراحی و اجرای محصولات MDF"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-stone-950/75" />

        <div className="absolute inset-0 bg-gradient-to-l from-stone-950 via-stone-950/85 to-stone-950/40" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            flex
            flex-col
            gap-8
            py-8
            sm:gap-10
            sm:py-14
            lg:grid
            lg:grid-cols-2
            lg:items-center
            lg:gap-12
            lg:py-20
          "
        >
          {/* ================= SLIDER ================= */}
          {/* در موبایل اول نمایش داده می‌شود */}
          {/* در دسکتاپ سمت دوم قرار می‌گیرد */}
          <div className="order-1 w-full min-w-0 lg:order-2">
            <div className="relative w-full">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: ".hero-next",
                  prevEl: ".hero-prev",
                }}
                pagination={{
                  clickable: true,
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop
                className="hero-swiper w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-sm sm:rounded-[2rem] sm:p-3">
                      <div
                        className="
                          relative
                          h-[260px]
                          w-full
                          overflow-hidden
                          rounded-[1.2rem]
                          sm:h-[360px]
                          sm:rounded-[1.5rem]
                          md:h-[420px]
                          lg:h-[540px]
                        "
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          sizes="(max-width: 1023px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />

                        {/* Image Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent" />

                        {/* Slide Info */}
                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
                          <div className="rounded-xl border border-white/10 bg-black/35 p-3 backdrop-blur-md sm:rounded-2xl sm:p-5">
                            <p className="text-[9px] text-stone-300 sm:text-xs">
                              {slide.label}
                            </p>

                            <p className="mt-1 text-sm font-bold sm:text-lg md:text-xl">
                              {slide.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Previous */}
              <button
                type="button"
                className="hero-prev absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-amber-600 sm:right-5 sm:h-11 sm:w-11"
                aria-label="تصویر قبلی"
              >
                <ArrowRight size={17} />
              </button>

              {/* Next */}
              <button
                type="button"
                className="hero-next absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-amber-600 sm:left-5 sm:h-11 sm:w-11"
                aria-label="تصویر بعدی"
              >
                <ArrowLeft size={17} />
              </button>
            </div>
          </div>

          {/* ================= TEXT ================= */}
          {/* در موبایل بعد از اسلایدر نمایش داده می‌شود */}
          {/* در دسکتاپ سمت اول قرار می‌گیرد */}
          <div className="order-2 w-full max-w-2xl lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] text-stone-200 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs">
              <Sparkles size={14} className="text-amber-400" />
              طراحی و تولید تخصصی MDF
            </div>

            {/* Title */}
            <h1 className="mt-5 text-3xl font-bold leading-[1.4] sm:mt-6 sm:text-4xl md:text-5xl lg:mt-7 lg:text-6xl">
              فضای شما،
              <br />
              <span className="text-amber-400">با طراحی شما</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-200 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
              طراحی، تولید و اجرای محصولات MDF و دکوراسیون داخلی با تمرکز بر
              کیفیت، طراحی مدرن و اجرای دقیق.
            </p>

            {/* Features */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-200 sm:text-sm">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-amber-400"
                />
                طراحی اختصاصی
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-200 sm:text-sm">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-amber-400"
                />
                تولید سفارشی
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-200 sm:text-sm">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-amber-400"
                />
                اجرای حرفه‌ای
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500"
              >
                مشاهده محصولات
                <ArrowLeft size={17} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                درخواست مشاوره
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SWIPER STYLES ================= */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 12px !important;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          margin: 0 3px !important;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 999px;
          background: #f59e0b;
          opacity: 1;
        }

        @media (min-width: 640px) {
          .hero-swiper .swiper-pagination {
            bottom: 18px !important;
          }

          .hero-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }

          .hero-swiper .swiper-pagination-bullet-active {
            width: 24px;
          }
        }
      `}</style>
    </section>
  );
}
