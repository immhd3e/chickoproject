"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, normalizeDigits, toFa } from "@/lib/format";
import { submitOrder, validateOrder, type OrderErrors } from "@/lib/order-api";

const field =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";

const digits = (v: string) => normalizeDigits(v).replace(/\D/g, "");

export default function CheckoutForm() {
  const { items, count, total, ready, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneCode, setDoneCode] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    const data = { name: name.trim(), phone, city: city.trim(), address: address.trim(), postalCode, note: note.trim() };
    const found = validateOrder(data);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    const r = await submitOrder(data, items, total);
    setLoading(false);

    if (!r.ok) return setServerError(r.error);
    clear();
    setDoneCode(r.code);
  };

  if (doneCode) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center text-center">
        <CheckCircle2 size={64} className="text-green-600" />
        <h2 className="mt-5 text-2xl font-bold text-stone-900">سفارش شما ثبت شد</h2>
        <p className="mt-3 text-sm leading-7 text-stone-500">
          کد پیگیری شما <span dir="ltr" className="font-bold text-stone-900">{doneCode}</span> است. همکاران ما برای هماهنگی ارسال و نصب با شما تماس می‌گیرند. هزینهٔ ارسال و نصب بعد از تأیید سفارش اعلام می‌شود.
        </p>
        <Link href="/products" className="mt-7 rounded-full bg-stone-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-700">
          ادامهٔ خرید
        </Link>
      </div>
    );
  }

  if (!ready) return <div className="min-h-[50vh]" />;

  if (!items.length) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="mt-6 text-xl font-bold text-stone-900">سبد خرید شما خالی است</h2>
        <Link href="/products" className="mt-6 rounded-full bg-stone-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-700">
          دیدن محصولات
        </Link>
      </div>
    );
  }

  const err = (m?: string) => <p role="alert" className="mt-1 min-h-5 text-xs text-red-600">{m}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-3">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-2">
        <h2 className="mb-6 text-lg font-bold text-stone-900">اطلاعات تحویل</h2>

        <div className="grid gap-x-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">نام و نام خانوادگی</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`${field} h-12`} />
            {err(errors.name)}
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-stone-700">شمارهٔ موبایل</label>
            <input id="phone" type="tel" inputMode="numeric" dir="ltr" maxLength={11} placeholder="09123456789" value={phone} onChange={(e) => setPhone(digits(e.target.value))} autoComplete="tel" className={`${field} h-12 text-left tracking-wider`} />
            {err(errors.phone)}
          </div>

          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium text-stone-700">شهر</label>
            <input id="city" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" className={`${field} h-12`} />
            {err(errors.city)}
          </div>

          <div>
            <label htmlFor="postal" className="mb-2 block text-sm font-medium text-stone-700">
              کد پستی <span className="text-stone-400">(اختیاری)</span>
            </label>
            <input id="postal" inputMode="numeric" dir="ltr" maxLength={10} value={postalCode} onChange={(e) => setPostalCode(digits(e.target.value))} autoComplete="postal-code" className={`${field} h-12 text-left tracking-wider`} />
            {err(errors.postalCode)}
          </div>
        </div>

        <label htmlFor="address" className="mb-2 block text-sm font-medium text-stone-700">آدرس کامل</label>
        <textarea id="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد" className={`${field} py-3 leading-7`} />
        {err(errors.address)}

        <label htmlFor="note" className="mb-2 mt-2 block text-sm font-medium text-stone-700">
          توضیحات <span className="text-stone-400">(اختیاری)</span>
        </label>
        <textarea id="note" rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً زمان مناسب برای تماس یا نکتهٔ نصب" className={`${field} py-3 leading-7`} />
      </div>

      <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6 lg:sticky lg:top-44">
        <h2 className="text-lg font-bold text-stone-900">خلاصهٔ سفارش</h2>

        <ul className="mt-5 space-y-4">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                <Image src={i.image} alt={i.title} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium leading-6 text-stone-900">{i.title}</p>
                <p className="text-stone-500">{toFa(i.qty)} × {formatPrice(i.price)}</p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-stone-200 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">مجموع کالاها ({toFa(count)})</dt>
            <dd className="font-medium text-stone-900">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">ارسال و نصب</dt>
            <dd className="text-stone-500">بعد از تأیید سفارش</dd>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-4 font-bold text-stone-900">
            <dt>جمع کل</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>

        {serverError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

        <button type="submit" disabled={loading} className="mt-5 h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
          {loading ? "در حال ثبت..." : "ثبت نهایی سفارش"}
        </button>

        <p className="mt-3 text-xs leading-6 text-stone-500">
          با ثبت سفارش، همکاران ما برای تأیید نهایی و هماهنگی با شما تماس می‌گیرند. پرداخت بعد از تأیید انجام می‌شود.
        </p>
      </aside>
    </form>
  );
}
