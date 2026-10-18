import type { CartItem } from "@/components/cart/CartProvider";

export type OrderInput = {
  name: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  note: string;
};

export type OrderErrors = Partial<Record<keyof OrderInput, string>>;

export function validateOrder(v: OrderInput): OrderErrors {
  const e: OrderErrors = {};

  if (v.name.trim().length < 3) e.name = "نام و نام خانوادگی را وارد کنید.";
  if (!/^09\d{9}$/.test(v.phone)) e.phone = "شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
  if (v.city.trim().length < 2) e.city = "شهر را وارد کنید.";
  if (v.address.trim().length < 10) e.address = "آدرس کامل را بنویسید.";
  if (v.postalCode && !/^\d{10}$/.test(v.postalCode)) e.postalCode = "کد پستی باید ۱۰ رقم باشد.";

  return e;
}

// قیمت‌ها را سرور خودش از لیست محصولات حساب می‌کند؛ فقط شناسه و تعداد فرستاده می‌شود
export async function submitOrder(
  input: OrderInput,
  items: CartItem[],
  _total?: number
): Promise<{ ok: true; code: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, items: items.map((i) => ({ id: i.id, qty: i.qty })) }),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) return { ok: false, error: json.error ?? "اطلاعات فرم را بررسی کنید." };
    return { ok: true, code: json.code };
  } catch {
    return { ok: false, error: "ارتباط با سرور برقرار نشد. اینترنت را بررسی کنید." };
  }
}