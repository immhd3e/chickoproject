"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "./CartProvider";
import { formatPrice, toFa } from "@/lib/format";

export default function MiniCart() {
  const { isOpen, closeCart, items, count, total, setQty, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110]" onClick={closeCart}>
      <div className="absolute inset-0 bg-black/40" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5">
          <h2 className="font-bold text-stone-900">
            سبد خرید{" "}
            <span className="text-sm font-normal text-stone-500">({toFa(count)} کالا)</span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
              <ShoppingBag size={30} />
            </div>
            <p className="mt-4 font-bold text-stone-900">سبد خرید شما خالی است</p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-5 rounded-full bg-stone-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              دیدن محصولات
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold leading-6 text-stone-900">{item.title}</p>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`حذف ${item.title}`}
                        className="text-stone-400 transition hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-stone-300">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label="کم کردن"
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{toFa(item.qty)}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label="زیاد کردن"
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-stone-900">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-stone-200 p-5">
              <div className="mb-4 flex justify-between font-bold text-stone-900">
                <span>جمع کل</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="rounded-xl border border-stone-300 py-3 text-center text-sm font-semibold text-stone-800 transition hover:border-amber-600 hover:text-amber-700"
                >
                  مشاهدهٔ سبد
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="rounded-xl bg-amber-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-500"
                >
                  ثبت سفارش
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}