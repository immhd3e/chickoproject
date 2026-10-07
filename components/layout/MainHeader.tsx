"use client";

import Link from "next/link";

import {
  Heart,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import SearchBar from "./SearchBar";

interface MainHeaderProps {
  onMenuClick: () => void;
}

export default function MainHeader({
  onMenuClick,
}: MainHeaderProps) {
  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-950 text-lg font-bold text-white">
            M
          </div>

          <div className="hidden sm:block">
            <div className="text-xl font-bold tracking-tight text-stone-950">
              MDF
              <span className="text-amber-700">
                چیکو
              </span>
            </div>

            <p className="text-[10px] tracking-widest text-stone-500">
              چیکو
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="mx-10 hidden max-w-xl flex-1 lg:block">
          <SearchBar />
        </div>

        {/* Contact */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="text-right">
            <p className="text-xs text-stone-500">
              تماس با ما
            </p>

            <a
              href="tel:09123456789"
              className="text-sm font-semibold text-stone-900 transition hover:text-amber-700"
            >
              0912 345 6789
            </a>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-amber-700">
            <Phone size={19} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 lg:hidden"
            aria-label="باز کردن منو"
          >
            <span className="text-xl">
              ☰
            </span>
          </button>

          {/* Mobile Search */}
          <div className="lg:hidden">
            <SearchBar />
          </div>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 hover:text-amber-700 sm:flex"
            aria-label="علاقه‌مندی‌ها"
          >
            <Heart size={20} />
          </Link>

          {/* Account */}
          <Link
            href="/login"
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 hover:text-amber-700"
            aria-label="حساب کاربری"
          >
            <UserRound size={20} />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 hover:text-amber-700"
            aria-label="سبد خرید"
          >
            <ShoppingBag size={20} />

            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-700 px-1 text-[9px] font-bold text-white">
              0
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}