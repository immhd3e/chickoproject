import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";

import type { Category } from "@/data/categories";
import CurrentYear from "./CurrentYear";

const quickLinks = [
  { label: "محصولات", href: "/products" },
  { label: "نمونه‌کارها", href: "/portfolio" },
  { label: "خدمات", href: "/services" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export default function Footer({ categories }: { categories: Category[] }) {
  const link = "transition hover:text-amber-500";

  return (
    <footer className="mt-24 bg-stone-950 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-stone-950">M</div>
            <div className="text-xl font-bold text-white">MDF<span className="text-amber-500">Factory</span></div>
          </div>
          <p className="mt-4 text-sm leading-7 text-stone-400">طراحی، تولید و اجرای کمد، سرویس نوزاد و دکوراسیون داخلی با MDF، مستقیم از کارخانه.</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-white">محصولات</h3>
          <ul className="space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/products?category=${c.slug}`} className={link}>{c.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-white">دسترسی سریع</h3>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-white">تماس با ما</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-amber-500" /><span>آدرس کارخانه را اینجا بنویسید</span></li>
            <li className="flex items-center gap-3"><Phone size={18} className="shrink-0 text-amber-500" /><a href="tel:02112345678" className={link}>۰۲۱-۱۲۳۴۵۶۷۸</a></li>
            <li className="flex items-center gap-3"><Mail size={18} className="shrink-0 text-amber-500" /><a href="mailto:info@example.com" className={link}>info@example.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-stone-500">© <CurrentYear /> MDF Factory. تمامی حقوق محفوظ است.</div>
      </div>
    </footer>
  );
}