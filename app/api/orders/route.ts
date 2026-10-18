import { NextResponse } from "next/server";

import { validateOrder } from "@/lib/order-api";
import { getIp, rateLimit } from "@/lib/rate-limit";
import { addOrder, getProducts, type OrderItem } from "@/lib/store";

export async function POST(req: Request) {
  if (!rateLimit(`order:${getIp(req)}`, 10, 3_600_000)) {
    return NextResponse.json({ error: "تعداد درخواست‌ها زیاد است. بعداً تلاش کنید." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });

  const input = {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    city: String(body.city ?? "").trim(),
    address: String(body.address ?? "").trim(),
    postalCode: String(body.postalCode ?? "").trim(),
    note: String(body.note ?? "").trim().slice(0, 500),
  };

  if (Object.keys(validateOrder(input)).length) {
    return NextResponse.json({ error: "اطلاعات تحویل را بررسی کنید." }, { status: 400 });
  }

  // نام و قیمت از لیست محصولات سرور می‌آید، نه از مرورگر
  const products = await getProducts();
  const rawItems: { id?: unknown; qty?: unknown }[] = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
  const items: OrderItem[] = [];

  for (const it of rawItems) {
    const p = products.find((x) => x.id === Number(it.id));
    const qty = Math.min(20, Math.max(1, Math.floor(Number(it.qty) || 0)));
    if (p && qty) items.push({ id: p.id, title: p.title, price: p.price, qty });
  }

  if (!items.length) return NextResponse.json({ error: "سبد خرید خالی است." }, { status: 400 });

  const order = await addOrder({ ...input, items });
  return NextResponse.json({ ok: true, code: order.code });
}