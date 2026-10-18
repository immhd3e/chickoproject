"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { toFa } from "@/lib/format";

interface MainHeaderProps {
  onMenuClick: () => void;
}

const iconBtn =
  "relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 hover:text-amber-700";

const badge =
  "absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white";

export default function MainHeader({ onMenuClick }: MainHeaderProps) {
  const { count, ready, openCart } = useCart();
  const fav = useFavorites();

  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-950 text-lg font-bold text-white">
            M
          </div>

          <div className="hidden sm:block">
            <div className="text-xl font-bold tracking-tight text-stone-950">
              MDF<span className="text-amber-700">چیکو</span>
            </div>
            <p className="text-[10px] tracking-widest text-stone-500">WOOD & INTERIOR</p>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="mx-10 hidden max-w-xl flex-1 lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی محصول، دسته‌بندی یا نمونه‌کار..."
              className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 px-5 pr-12 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
            <Search size={19} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 lg:hidden"
            aria-label="منو"
          >
            <span className="text-xl">☰</span>
          </button>

          <button type="button" className={`${iconBtn} lg:hidden`} aria-label="جستجو">
            <Search size={20} />
          </button>

          <Link href="/favorites" className={iconBtn} aria-label="علاقه‌مندی‌ها">
            <Heart size={20} />
            {fav.ready && fav.count > 0 && (
              <span className={`${badge} bg-red-500`}>{toFa(fav.count)}</span>
            )}
          </Link>

          <Link href="/login" className={iconBtn} aria-label="حساب کاربری">
            <UserRound size={20} />
          </Link>

          <button type="button" onClick={openCart} className={iconBtn} aria-label="سبد خرید">
            <ShoppingBag size={20} />
            {ready && count > 0 && <span className={`${badge} bg-amber-700`}>{toFa(count)}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}