"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "داشبورد", exact: true },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/consultations", label: "درخواست‌های مشاوره" },
  { href: "/admin/products", label: "محصولات", soon: true },
  { href: "/admin/collections", label: "مجموعه‌ها", soon: true },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((it) => {
        if (it.soon) {
          return (
            <span key={it.href} className="flex items-center justify-between whitespace-nowrap rounded-xl px-4 py-2.5 text-sm text-stone-500">
              {it.label}
              <span className="mr-2 rounded-full bg-stone-800 px-2 py-0.5 text-[10px]">به‌زودی</span>
            </span>
          );
        }

        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active ? "bg-amber-600 text-white" : "text-stone-300 hover:bg-stone-800 hover:text-white"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}