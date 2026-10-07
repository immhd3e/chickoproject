import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";

const productLinks = [
  {
    title: "کمد و کمد دیواری",
    href: "/products?category=wardrobes",
  },
  {
    title: "اتاق کودک",
    href: "/products?category=kids-room",
  },
  {
    title: "سرویس خواب",
    href: "/products?category=bedroom",
  },
  {
    title: "میز و کتابخانه",
    href: "/products?category=tables-bookcases",
  },
];

const quickLinks = [
  {
    title: "درباره ما",
    href: "/about",
  },
  {
    title: "نمونه‌کارها",
    href: "/portfolio",
  },
  {
    title: "خدمات",
    href: "/services",
  },
  {
    title: "مجله",
    href: "/blog",
  },
  {
    title: "تماس با ما",
    href: "/contact",
  },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-stone-950">
                M
              </div>

              <div>
                <div className="text-xl font-bold">
                  MDF
                  <span className="text-amber-500">
                    Factory
                  </span>
                </div>

                <p className="mt-0.5 text-[9px] tracking-[0.25em] text-stone-500">
                  WOOD & INTERIOR
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-stone-400">
              طراحی، تولید و اجرای محصولات MDF و
              دکوراسیون داخلی با تمرکز بر کیفیت،
              طراحی مدرن و اجرای دقیق.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold">
              محصولات
            </h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition hover:text-amber-500"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold">
              دسترسی سریع
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition hover:text-amber-500"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold">
              ارتباط با ما
            </h3>

            <div className="mt-5 space-y-4">

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

                <div>
                  <p className="text-xs text-stone-500">
                    تلفن
                  </p>

                  <a
                    href="tel:02112345678"
                    className="mt-1 block text-sm text-stone-300 transition hover:text-amber-500"
                  >
                    ۰۲۱-۱۲۳۴۵۶۷۸
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

                <div>
                  <p className="text-xs text-stone-500">
                    ایمیل
                  </p>

                  <a
                    href="mailto:info@mdffactory.ir"
                    className="mt-1 block text-sm text-stone-300 transition hover:text-amber-500"
                  >
                    info@mdffactory.ir
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-500"
                />

                <div>
                  <p className="text-xs text-stone-500">
                    آدرس
                  </p>

                  <p className="mt-1 text-sm leading-6 text-stone-300">
                    تهران، ایران
                  </p>
                </div>
              </div>

            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-500 transition hover:text-amber-400"
            >
              درخواست مشاوره

              <ArrowLeft size={16} />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} MDF Factory. تمامی حقوق محفوظ است.
          </p>

          <div className="flex gap-5">
            <Link
              href="/"
              className="transition hover:text-stone-300"
            >
              حریم خصوصی
            </Link>

            <Link
              href="/"
              className="transition hover:text-stone-300"
            >
              قوانین و مقررات
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}