import type { CartItem } from "@/components/cart/CartProvider";

export type OrderInput = { name: string; phone: string; city: string; address: string; postalCode: string; note: string };
export type OrderErrors = Partial<Record<keyof OrderInput, string>>;

const KEY = "mdf_orders";

export function validateOrder(v: OrderInput): OrderErrors {
  const e: OrderErrors = {};
  if (v.name.trim().length < 3) e.name = "نام و نام خانوادگی را وارد کنید.";
  if (!/^09\d{9}$/.test(v.phone)) e.phone = "شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
  if (v.city.trim().length < 2) e.city = "شهر را وارد کنید.";
  if (v.address.trim().length < 10) e.address = "آدرس کامل را بنویسید.";
  if (v.postalCode && !/^\d{10}$/.test(v.postalCode)) e.postalCode = "کد پستی باید ۱۰ رقم باشد.";
  return e;
}

export async function submitOrder(
  input: OrderInput,
  items: CartItem[],
  total: number
): Promise<{ ok: true; code: string } | { ok: false; error: string }> {
  await new Promise((r) => setTimeout(r, 800));
  const code = "MDF-" + Math.floor(10000 + Math.random() * 90000);
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    list.push({ ...input, code, items, total, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    return { ok: false, error: "ثبت سفارش انجام نشد. دوباره تلاش کنید." };
  }
  return { ok: true, code };
}
