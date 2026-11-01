import Link from "next/link";
import type { Prisma } from "@prisma/client";

import DeleteButton from "@/components/admin/DeleteButton";
import { db } from "@/lib/db";
import { formatPrice, toFa } from "@/lib/format";
import { deleteProduct, duplicateProduct, toggleActive, toggleFeatured } from "./actions";

export const instant = false;

type Props = { searchParams: Promise<{ q?: string; cat?: string; status?: string }> };

const ctl =
  "h-10 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-amber-600";
const mini = "rounded-full px-3 py-1.5 text-xs font-medium transition";

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q = "", cat = "", status = "" } = await searchParams;

  const where: Prisma.ProductWhereInput = {
    ...(q ? { OR: [{ title: { contains: q } }, { code: { contains: q } }] } : {}),
    ...(Number(cat) ? { categoryId: Number(cat) } : {}),
    ...(status === "active" ? { active: true } : status === "hidden" ? { active: false } : status === "featured" ? { featured: true } : {}),
  };

  const [products, categories, total] = await Promise.all([
    db.product.findMany({ where, include: { category: true, type: true }, orderBy: { id: "desc" } }),
    db.category.findMany({ orderBy: [{ sort: "asc" }, { id: "asc" }] }),
    db.product.count(),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">محصولات</h1>
          <p className="mt-1 text-sm text-stone-500">
            {toFa(products.length)} محصول از {toFa(total)}
          </p>
        </div>
        <Link href="/admin/products/new" className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500">
          افزودن محصول
        </Link>
      </div>

      <form method="get" className="mt-6 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={q} placeholder="جستجوی نام یا کد..." className={`${ctl} w-56`} />
        <select name="cat" defaultValue={cat} className={ctl}>
          <option value="">همهٔ دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} className={ctl}>
          <option value="">همهٔ وضعیت‌ها</option>
          <option value="active">نمایش در سایت</option>
          <option value="hidden">مخفی</option>
          <option value="featured">پیشنهادی</option>
        </select>
        <button type="submit" className="h-10 rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-amber-700">
          اعمال
        </button>
        {(q || cat || status) && (
          <Link href="/admin/products" className="text-sm text-stone-500 transition hover:text-amber-700">پاک کردن فیلتر</Link>
        )}
      </form>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">محصولی پیدا نشد.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[820px] text-right text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">عکس</th>
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="px-4 py-3 font-medium">دسته / مدل</th>
                <th className="px-4 py-3 font-medium">قیمت</th>
                <th className="px-4 py-3 font-medium">نمایش</th>
                <th className="px-4 py-3 font-medium">پیشنهادی</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-stone-100">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="h-12 w-16 rounded-lg border border-stone-200 object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{p.title}</p>
                    {p.code && <p dir="ltr" className="text-right text-xs text-stone-500">{p.code}</p>}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {p.category.title}
                    {p.type ? ` / ${p.type.title}` : ""}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatPrice(p.price)}
                    {p.oldPrice && <p className="text-xs text-stone-400 line-through">{formatPrice(p.oldPrice)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className={`${mini} ${p.active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}>
                        {p.active ? "نمایش" : "مخفی"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" aria-label="پیشنهادی" className={`${mini} ${p.featured ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "text-stone-400 hover:bg-stone-100"}`}>
                        {p.featured ? "★ پیشنهادی" : "☆"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`} className={`${mini} text-amber-700 hover:bg-amber-50`}>ویرایش</Link>
                      <form action={duplicateProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className={`${mini} text-stone-600 hover:bg-stone-100`}>کپی</button>
                      </form>
                      <DeleteButton action={deleteProduct} id={p.id} label={p.title} />
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