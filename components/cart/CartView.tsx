"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "./CartProvider";
import { formatPrice, toFa } from "@/lib/format";

export default function CartView() {
  const { items, count, total, ready, setQty, remove, clear } = useCart();

  if (!ready) return <div className="min-h-[50vh]" />;

  if (!items.length) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="mt-6 text-xl font-bold text-stone-900">سبد خرید شما خالی است</h2>
        <p className="mt-2 text-sm text-stone-500">از بین محصولات، چیزی که می‌پسندید را به سبد اضافه کنید.</p>
        <Link href="/products" className="mt-6 rounded-full bg-stone-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-700">
          دیدن محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-stone-500">{toFa(count)} کالا در سبد</p>
          <button type="button" onClick={clear} className="text-sm text-stone-500 transition hover:text-red-600">خالی کردن سبد</button>
        </div>

        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:h-28 sm:w-28">
                <Image src={item.image} alt={item.title} fill sizes="112px" className="object-cover" />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-stone-900">{item.title}</h3>
                  <button type="button" onClick={() => remove(item.id)} aria-label={`حذف ${item.title}`} className="text-stone-400 transition hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="mt-1 text-sm text-stone-500">{formatPrice(item.price)}</p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-stone-300">
                    <button type="button" onClick={() => setQty(item.id, item.qty - 1)} aria-label="کم کردن" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-stone-100">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{toFa(item.qty)}</span>
                    <button type="button" onClick={() => setQty(item.id, item.qty + 1)} aria-label="زیاد کردن" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-stone-100">
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-stone-900">{formatPrice(item.price * item.qty)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 lg:sticky lg:top-44">
        <h2 className="text-lg font-bold text-stone-900">خلاصهٔ سفارش</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">مجموع کالاها ({toFa(count)})</dt>
            <dd className="font-medium text-stone-900">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">هزینهٔ ارسال و نصب</dt>
            <dd className="text-stone-500">بعد از تأیید سفارش</dd>
          </div>
        </dl>
        <div className="mt-5 flex justify-between border-t border-stone-200 pt-5 font-bold text-stone-900">
          <span>جمع کل</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" className="mt-6 block rounded-xl bg-amber-600 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-amber-500">
          ادامه و ثبت سفارش
        </Link>
      </aside>
    </div>
  );
}
