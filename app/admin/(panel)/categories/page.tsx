import Link from "next/link";

import DeleteButton from "@/components/admin/DeleteButton";
import { db } from "@/lib/db";
import { toFa } from "@/lib/format";
import { deleteCategory } from "./actions";

export const instant = false;

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const cats = await db.category.findMany({
    orderBy: [{ sort: "asc" }, { id: "asc" }],
    include: { types: true, _count: { select: { products: true, collections: true } } },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">دسته‌بندی‌ها</h1>
          <p className="mt-1 text-sm text-stone-500">{toFa(cats.length)} دسته</p>
        </div>
        <Link href="/admin/categories/new" className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500">
          افزودن دسته
        </Link>
      </div>

      {error === "used" && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          این دسته محصول یا مجموعه دارد و حذف نمی‌شود. اول آن‌ها را به دستهٔ دیگری ببرید یا حذف کنید.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">عکس</th>
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">مدل‌ها</th>
              <th className="px-4 py-3 font-medium">محصول</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t border-stone-100">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="h-12 w-16 rounded-lg border border-stone-200 object-cover" />
                </td>
                <td className="px-4 py-3 font-medium text-stone-900">{c.title}</td>
                <td className="max-w-xs px-4 py-3 text-stone-600">{c.types.map((t) => t.title).join("، ") || "—"}</td>
                <td className="px-4 py-3">{toFa(c._count.products)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/categories/${c.id}`} className="rounded-full px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50">
                      ویرایش
                    </Link>
                    <DeleteButton action={deleteCategory} id={c.id} label={c.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}