"use client";

import Link from "next/link";
import { useActionState } from "react";

import ImageUploader from "./ImageUploader";
import { savePortfolio, type FormState } from "@/app/admin/(panel)/portfolio/actions";

export type PortfolioFormData = {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  image: string;
  images: string[];
  active: boolean;
  sort: number;
};

const input =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";
const label = "mb-2 block text-sm font-medium text-stone-700";

export default function PortfolioForm({ item }: { item: PortfolioFormData | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePortfolio, { error: "" });

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={label}>عنوان پروژه</label>
          <input id="title" name="title" defaultValue={item?.title} placeholder="مثلاً دکوراسیون آپارتمان سعادت‌آباد" className={input} />
        </div>

        <div>
          <label htmlFor="location" className={label}>محل پروژه <span className="text-stone-400">(اختیاری)</span></label>
          <input id="location" name="location" defaultValue={item?.location} placeholder="تهران" className={input} />
        </div>

        <div>
          <label htmlFor="year" className={label}>سال اجرا <span className="text-stone-400">(اختیاری)</span></label>
          <input id="year" name="year" inputMode="numeric" dir="ltr" defaultValue={item?.year} placeholder="1405" className={`${input} text-left`} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>توضیحات</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={item?.description}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageUploader name="image" label="عکس اصلی" initial={item?.image ? [item.image] : []} />
        <ImageUploader name="images" label="عکس‌های بیشتر (گالری)" initial={item?.images ?? []} multiple max={12} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sort" className={label}>ترتیب نمایش <span className="text-stone-400">(عدد کمتر، بالاتر)</span></label>
          <input id="sort" name="sort" inputMode="numeric" dir="ltr" defaultValue={item?.sort ?? 0} className={`${input} text-left`} />
        </div>
        <label className="flex items-end gap-2 pb-3 text-sm text-stone-700">
          <input type="checkbox" name="active" defaultChecked={item?.active ?? true} className="h-4 w-4 accent-amber-600" />
          در سایت نمایش داده شود
        </label>
      </div>

      <p role="alert" className="min-h-6 text-sm text-red-600">{state.error}</p>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-amber-600 px-8 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
          {pending ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <Link href="/admin/portfolio" className="text-sm text-stone-600 transition hover:text-amber-700">انصراف</Link>
      </div>
    </form>
  );
}