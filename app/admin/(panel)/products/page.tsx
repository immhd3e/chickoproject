import Link from "next/link";

import DeleteButton from "@/components/admin/DeleteButton";
import { db } from "@/lib/db";
import { formatPrice, toFa } from "@/lib/format";
import { deleteProduct } from "./actions";

export const instant = false;

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true, type: true },
    orderBy: { id: "desc" },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">محصولات</h1>
          <p className="mt-1 text-sm text-stone-500">{toFa(products.length)} محصول</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500"
        >
          افزودن محصول
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">هنوز محصولی ثبت نشده است.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">عکس</th>
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="px-4 py-3 font-medium">دسته / مدل</th>
                <th className="px-4 py-3 font-medium">قیمت</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
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
                  <td className="px-4 py-3 font-medium text-stone-900">{p.title}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {p.category.title}
                    {p.type ? ` / ${p.type.title}` : ""}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-600"}`}>
                      {p.active ? "نمایش در سایت" : "مخفی"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`} className="rounded-full px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50">
                        ویرایش
                      </Link>
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