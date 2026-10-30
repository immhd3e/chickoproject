
import Link from "next/link";
import { db } from "@/lib/db";
import { deleteSlider, toggleSlider, moveSlider } from "./actions";

export default async function SlidersPage() {
  const sliders = await db.slider.findMany({
    orderBy: [
      { sort: "asc" },
      { id: "asc" },
    ],
  });

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            مدیریت اسلایدرها
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            تصاویر و محتوای اسلایدر صفحه اصلی را مدیریت کنید.
          </p>
        </div>

        <Link
          href="/admin/sliders/new"
          className="rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-800"
        >
          + افزودن اسلایدر جدید
        </Link>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-sm text-stone-600">
          تعداد کل اسلایدرها:
          <strong className="mr-2 text-stone-900">
            {sliders.length}
          </strong>
        </p>
      </div>

      {sliders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <h2 className="font-bold text-stone-800">
            هنوز اسلایدری ثبت نشده است.
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            برای شروع، اولین اسلایدر صفحه اصلی را اضافه کنید.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sliders.map((slider, index) => (
            <div
              key={slider.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] bg-stone-100">
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <p className="text-xs text-amber-700">
                    {slider.label || "بدون برچسب"}
                  </p>

                  <h2 className="mt-2 font-bold text-stone-900">
                    {slider.title}
                  </h2>

                  <p className="mt-2 text-xs text-stone-500">
                    ترتیب نمایش: {slider.sort}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      slider.active
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {slider.active ? "فعال" : "غیرفعال"}
                  </span>

                  <form action={toggleSlider}>
                    <input
                      type="hidden"
                      name="id"
                      value={slider.id}
                    />
                    <button
                      type="submit"
                      className="text-sm font-medium text-amber-700 hover:text-amber-900"
                    >
                      {slider.active ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                  </form>
                </div>

                <div className="flex gap-2 border-t border-stone-100 pt-4">
                  <form action={moveSlider}>
                    <input type="hidden" name="id" value={slider.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      title="انتقال به بالا"
                      className="rounded-lg bg-stone-100 px-4 py-2 text-lg font-bold text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↑
                    </button>
                  </form>

                  <form action={moveSlider}>
                    <input type="hidden" name="id" value={slider.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === sliders.length - 1}
                      title="انتقال به پایین"
                      className="rounded-lg bg-stone-100 px-4 py-2 text-lg font-bold text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </form>

                  <Link
                    href={`/admin/sliders/${slider.id}/edit`}
                    className="flex-1 rounded-lg bg-stone-100 py-2 text-center text-sm font-bold text-stone-700 hover:bg-stone-200"
                  >
                    ویرایش
                  </Link>

                  <form action={deleteSlider} className="flex-1">
                    <input
                      type="hidden"
                      name="id"
                      value={slider.id}
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-red-50 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                    >
                      حذف
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
