import { SUBJECTS } from "@/data/consultation";
import { toFa } from "@/lib/format";
import { listConsultations } from "@/lib/store";
import { markContacted } from "./actions";

export const instant = false;

const fmt = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" });

export default async function ConsultationsPage() {
  const list = await listConsultations();
  const newCount = list.filter((c) => c.status === "new").length;

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-900">درخواست‌های مشاوره</h1>
      <p className="mt-1 text-sm text-stone-500">
        {toFa(newCount)} درخواست جدید از {toFa(list.length)} درخواست
      </p>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">هنوز درخواستی ثبت نشده است.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">تاریخ</th>
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="px-4 py-3 font-medium">موبایل</th>
                <th className="px-4 py-3 font-medium">نوع کار</th>
                <th className="px-4 py-3 font-medium">توضیحات</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-stone-100 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-stone-500">{fmt.format(new Date(c.createdAt))}</td>
                  <td className="px-4 py-3 font-medium text-stone-900">{c.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${c.phone}`} dir="ltr" className="text-amber-700 hover:underline">{c.phone}</a>
                  </td>
                  <td className="px-4 py-3">{SUBJECTS.find((s) => s.value === c.subject)?.label ?? c.subject}</td>
                  <td className="max-w-xs px-4 py-3 leading-6 text-stone-600">{c.message || "—"}</td>
                  <td className="px-4 py-3">
                    {c.status === "new" ? (
                      <form action={markContacted}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500">
                          تماس گرفته شد
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs font-medium text-green-700">تماس گرفته شد</span>
                    )}
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