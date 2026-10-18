import Link from "next/link";

import { formatPrice, toFa } from "@/lib/format";
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { listConsultations, listOrders } from "@/lib/store";

export const instant = false;

const fmt = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage() {
  const [orders, consultations] = await Promise.all([listOrders(), listConsultations()]);

  const newOrders = orders.filter((o) => o.status === "new").length;
  const newConsults = consultations.filter((c) => c.status === "new").length;
  const revenue = orders.filter((o) => o.status !== "canceled").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "سفارش جدید", value: toFa(newOrders), href: "/admin/orders", accent: newOrders > 0 },
    { label: "مشاورهٔ جدید", value: toFa(newConsults), href: "/admin/consultations", accent: newConsults > 0 },
    { label: "کل سفارش‌ها", value: toFa(orders.length), href: "/admin/orders", accent: false },
    { label: "جمع سفارش‌ها (بدون لغوشده)", value: formatPrice(revenue), href: "/admin/orders", accent: false },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-900">داشبورد</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-2xl border bg-white p-5 transition hover:shadow-md ${
              s.accent ? "border-amber-400" : "border-stone-200"
            }`}
          >
            <p className="text-sm text-stone-500">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.accent ? "text-amber-700" : "text-stone-900"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-stone-900">آخرین سفارش‌ها</h2>
            <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline">همه</Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-500">هنوز سفارشی ثبت نشده است.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-stone-900">{o.name}</p>
                    <p className="text-xs text-stone-500">{o.code} | {fmt.format(new Date(o.createdAt))}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLOR[o.status]}`}>
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-stone-900">آخرین درخواست‌های مشاوره</h2>
            <Link href="/admin/consultations" className="text-sm text-amber-700 hover:underline">همه</Link>
          </div>
          {consultations.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-500">هنوز درخواستی ثبت نشده است.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {consultations.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-stone-900">{c.name}</p>
                    <p dir="ltr" className="text-right text-xs text-stone-500">{c.phone}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${c.status === "new" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                    {c.status === "new" ? "جدید" : "تماس گرفته شد"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}