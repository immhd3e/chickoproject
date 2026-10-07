"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { portfolioItems } from "@/data/portfolio";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PortfolioSection() {
  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-amber-700">
              OUR PROJECTS
            </p>

            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
              نمونه‌کارهای ما
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              بخشی از پروژه‌های طراحی و اجرای MDF Factory
              در فضاهای مسکونی و کاری.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-stone-800 transition hover:text-amber-700"
          >
            مشاهده همه نمونه‌کارها
            <ArrowLeft size={17} />
          </Link>
        </div>

        {/* ================= PORTFOLIO SLIDER ================= */}

        <div className="relative mt-10">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            navigation={{
              nextEl: ".portfolio-next",
              prevEl: ".portfolio-prev",
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={portfolioItems.length > 2}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            className="portfolio-swiper pb-10"
          >
            {portfolioItems.map((item) => (
              <SwiperSlide key={item.id}>
                <Link
                  href={`/portfolio/${item.id}`}
                  className="group relative block overflow-hidden rounded-2xl bg-stone-900"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <p className="text-xs font-medium text-amber-400">
                        {item.category}
                      </p>

                      <h3 className="mt-1.5 text-lg font-bold text-white sm:mt-2 sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 max-w-lg text-xs leading-5 text-stone-300 sm:mt-2 sm:text-sm sm:leading-6">
                        {item.description}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white sm:mt-4 sm:text-sm">
                        مشاهده پروژه

                        <ArrowLeft
                          size={15}
                          className="transition-transform group-hover:-translate-x-1 sm:h-4 sm:w-4"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ================= NAVIGATION ================= */}

          <button
            type="button"
            className="portfolio-prev absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-md transition hover:bg-amber-600 hover:text-white sm:right-3"
            aria-label="پروژه قبلی"
          >
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="portfolio-next absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-md transition hover:bg-amber-600 hover:text-white sm:left-3"
            aria-label="پروژه بعدی"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>

      {/* ================= SWIPER STYLES ================= */}

      <style jsx global>{`
        .portfolio-swiper {
          width: 100%;
        }

        .portfolio-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .portfolio-swiper .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          margin: 0 3px !important;
          background: #78716c;
          opacity: 0.35;
          transition: all 0.3s ease;
        }

        .portfolio-swiper .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 999px;
          background: #d97706;
          opacity: 1;
        }

        @media (min-width: 1024px) {
          .portfolio-swiper .swiper-pagination {
            display: none;
          }

          .portfolio-prev,
          .portfolio-next {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .portfolio-swiper {
            padding-bottom: 35px;
          }
        }
      `}</style>
    </section>
  );
}