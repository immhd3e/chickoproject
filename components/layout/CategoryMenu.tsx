"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { categories } from "@/data/categories";

const navLinks = [
  { label: "نمونه‌کارها", href: "/portfolio" },
  { label: "خدمات", href: "/services" },
  { label: "مجله", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export default function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);

  // بستن با کلیک بیرون از منو و کلید Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative hidden border-b border-stone-200 bg-white lg:block"
    >
      {/* Navigation */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-6">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-full items-center gap-2 border-b-2 px-5 text-sm font-semibold transition ${
            isOpen
              ? "border-amber-700 text-amber-700"
              : "border-transparent text-stone-800 hover:text-amber-700"
          }`}
        >
          دسته‌بندی محصولات
          <ChevronDown
            size={17}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <nav className="flex h-full items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="flex h-full items-center px-5 text-sm text-stone-600 transition hover:text-amber-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mega Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-stone-200 bg-white shadow-2xl">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Categories */}
              <div className="col-span-9 grid grid-cols-2 gap-x-10 gap-y-8">
                {categories.map((category) => (
                  <div key={category.slug} className="group flex gap-4">
                    <Link
                      href={`/products?category=${category.slug}`}
                      onClick={close}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100"
                    >
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        sizes="96px"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    </Link>

                    <div>
                      <Link
                        href={`/products?category=${category.slug}`}
                        onClick={close}
                        className="font-bold text-stone-900 transition hover:text-amber-700"
                      >
                        {category.title}
                      </Link>

                      <p className="mt-1 text-xs leading-6 text-stone-500">
                        {category.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {category.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/products?category=${category.slug}&type=${item.slug}`}
                            onClick={close}
                            className="text-xs text-stone-500 transition hover:text-amber-700"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured */}
              <div className="col-span-3 border-r border-stone-200 pr-8">
                <div className="relative overflow-hidden rounded-2xl bg-stone-950 p-6 text-white">
                  <p className="text-xs font-medium tracking-widest text-amber-500">
                    چیکو
                  </p>

                  <h3 className="mt-3 text-xl font-bold leading-8">
                    طراحی اختصاصی
                    <br />
                    برای فضای شما
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-stone-300">
                    اگر محصول موردنظر خود را پیدا نکردید، می‌توانیم آن را مطابق
                    فضای شما طراحی و تولید کنیم.
                  </p>

                  <Link
                    href="/contact"
                    onClick={close}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-stone-900 transition hover:bg-amber-600 hover:text-white"
                  >
                    درخواست مشاوره
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-5">
              <p className="text-sm text-stone-500">
                بیش از چندین مدل محصول برای انتخاب و سفارش
              </p>

              <Link
                href="/products"
                onClick={close}
                className="flex items-center gap-2 text-sm font-semibold text-stone-900 transition hover:text-amber-700"
              >
                مشاهده همه محصولات
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}