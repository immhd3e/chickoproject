"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "./FavoritesProvider";

export default function FavoriteButton({
  productId,
  title,
  variant = "overlay",
}: {
  productId: number;
  title: string;
  variant?: "overlay" | "inline";
}) {
  const { has, toggle, ready } = useFavorites();
  const active = ready && has(productId);

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        aria-pressed={active}
        className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-red-400 hover:text-red-600"
      >
        <Heart size={18} className={active ? "fill-red-500 text-red-500" : ""} />
        {active ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={active ? `حذف ${title} از علاقه‌مندی‌ها` : `افزودن ${title} به علاقه‌مندی‌ها`}
      className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition hover:scale-110"
    >
      <Heart size={18} className={active ? "fill-red-500 text-red-500" : "text-stone-700"} />
    </button>
  );
}