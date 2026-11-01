import Link from "next/link";

import DeleteButton from "@/components/admin/DeleteButton";
import { db } from "@/lib/db";
import { toFa } from "@/lib/format";
import { deletePortfolio, togglePortfolio } from "./actions";

export const instant = false;

const mini = "rounded-full px-3 py-1.5 text-xs font-medium transition";

export default async function AdminPortfolioPage() {
  const items = await db.portfolio.findMany({ orderBy: [{ sort: "asc" }, { id: "desc" }] });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">نمونه‌کارها</h1>
          <p className="mt-1 text-sm text-stone-500">{toFa(items.length)} نمونه‌کار</p>
        </div>
        <Link href="/admin/portfolio/new" className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500">
          افزودن نمونه‌کار
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">هنوز نمونه‌کاری ثبت نشده است.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">عکس</th>
                <th className="px-4 py-3 font-medium">عنوان</th>
                <th className="px-4 py-3 font-medium">محل / سال</th>
                <th className="px-4 py-3 font-medium">نمایش</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-stone-100">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-12 w-16 rounded-lg border border-stone-200 object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900">{p.title}</td>
                  <td className="px-4 py-3 text-stone-600">{[p.location, p.year].filter(Boolean).join(" / ") || "—"}</td>
                  <td className="px-4 py-3">
                    <form action={togglePortfolio}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className={`${mini} ${p.active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}>
                        {p.active ? "نمایش" : "مخفی"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/portfolio/${p.id}`} className={`${mini} text-amber-700 hover:bg-amber-50`}>ویرایش</Link>
                      <DeleteButton action={deletePortfolio} id={p.id} label={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}