import Link from "next/link";

import {
  ArrowLeft,
  Hammer,
  Ruler,
  Sofa,
  PencilRuler,
} from "lucide-react";

const services = [
  {
    title: "طراحی اختصاصی",
    description:
      "طراحی محصول متناسب با ابعاد، سلیقه و نیاز فضای شما.",
    icon: PencilRuler,
  },
  {
    title: "اندازه‌گیری و مشاوره",
    description:
      "بررسی فضای پروژه و ارائه راهکار مناسب برای استفاده بهتر از فضا.",
    icon: Ruler,
  },
  {
    title: "تولید سفارشی",
    description:
      "تولید انواع محصولات MDF با ابعاد، رنگ و جزئیات موردنظر شما.",
    icon: Hammer,
  },
  {
    title: "دکوراسیون داخلی",
    description:
      "طراحی و اجرای بخش‌های مختلف فضای داخلی با یک سبک هماهنگ.",
    icon: Sofa,
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-stone-950 py-14 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-amber-500 sm:text-sm">
            OUR SERVICES
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:mt-3 sm:text-4xl">
            از ایده تا اجرای نهایی
          </h2>

          <p className="mt-3 text-xs leading-6 text-stone-400 sm:mt-5 sm:text-base sm:leading-8">
            ما در تمام مراحل پروژه، از طراحی اولیه تا تولید و اجرای
            نهایی، در کنار شما هستیم.
          </p>
        </div>

        {/* Services */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-xl border border-white/10 bg-white/5 p-3 transition duration-300 hover:-translate-y-1 hover:bg-white/10 sm:rounded-2xl sm:p-6"
              >
                {/* Icon */}
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600/10 text-amber-500 transition group-hover:bg-amber-600 group-hover:text-white sm:h-12 sm:w-12 sm:rounded-xl">
                  <Icon size={18} className="sm:h-[23px] sm:w-[23px]" />
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-bold leading-6 sm:mt-6 sm:text-lg">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-[11px] leading-5 text-stone-400 sm:mt-3 sm:text-sm sm:leading-7">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-5 sm:rounded-2xl sm:p-6">
          <div>
            <h3 className="text-sm font-bold sm:text-base">
              برای پروژه خودتان مشاوره می‌خواهید؟
            </h3>

            <p className="mt-1 text-xs text-stone-400 sm:mt-2 sm:text-sm">
              جزئیات پروژه را با ما در میان بگذارید.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-semibold transition hover:bg-amber-500 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
          >
            درخواست مشاوره
            <ArrowLeft size={15} className="sm:h-[17px] sm:w-[17px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}