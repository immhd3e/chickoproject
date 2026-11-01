"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { label: "خانه", href: "/" },
  { label: "محصولات", href: "/products" },
  { label: "نمونه‌کارها", href: "/portfolio" },
  { label: "خدمات", href: "/services" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 lg:hidden" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="منو" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-20 items-center justify-between border-b border-stone-200 px-5">
          <div className="text-xl font-bold text-stone-900">MDF<span className="text-amber-700">Factory</span></div>
          <button type="button" onClick={onClose} aria-label="بستن منو" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100">
            <X size={21} />
          </button>
        </div>

        <nav className="p-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="block border-b border-stone-100 px-2 py-4 text-sm font-medium text-stone-700 transition hover:text-amber-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-5">
          {user ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="block w-full rounded-xl border border-stone-300 py-3 text-center text-sm font-medium text-red-600"
            >
              خروج ({user.name})
            </button>
          ) : (
            <Link href="/login" onClick={onClose} className="block rounded-xl bg-stone-950 py-3 text-center text-sm font-medium text-white">
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}