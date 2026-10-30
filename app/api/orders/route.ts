import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { validateOrder } from "@/lib/order-api";
import { getIp, rateLimit } from "@/lib/rate-limit";

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

  const rawItems: { id?: unknown; qty?: unknown }[] = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
  const ids = rawItems.map((i) => Number(i.id)).filter((n) => Number.isInteger(n));

  try {
    // نام و قیمت از دیتابیس می‌آید، نه از مرورگر
    const rows = await db.product.findMany({ where: { id: { in: ids }, active: true } });
    const byId = new Map(rows.map((p) => [p.id, p]));

    const items = rawItems.flatMap((it) => {
      const p = byId.get(Number(it.id));
      const qty = Math.min(20, Math.max(1, Math.floor(Number(it.qty) || 0)));
      return p ? [{ productId: p.id, title: p.title, price: p.price, qty }] : [];
    });

    if (!items.length) return NextResponse.json({ error: "سبد خرید خالی است." }, { status: 400 });

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await db.order.create({
      data: {
        code: `TMP-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
        ...input,
        total,
        items: { create: items },
      },
    });

    const code = `MDF-${10000 + order.id}`;
    await db.order.update({ where: { id: order.id }, data: { code } });

    return NextResponse.json({ ok: true, code });
  } catch (e) {
    console.error("[order]", e);
    return NextResponse.json({ error: "ثبت سفارش انجام نشد. دوباره تلاش کنید." }, { status: 500 });
  }
}