"use client";

import Link from "next/link";
import { useActionState } from "react";

import ImageUploader from "./ImageUploader";
import RowsEditor from "./RowsEditor";
import { saveCategory, type FormState } from "@/app/admin/(panel)/categories/actions";

export type CategoryFormData = {
  id: number;
  title: string;
  description: string;
  image: string;
  sort: number;
  types: { id: number; title: string }[];
};

const input =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";
const label = "mb-2 block text-sm font-medium text-stone-700";

export default function CategoryForm({ category }: { category: CategoryFormData | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCategory, { error: "" });

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      {category && <input type="hidden" name="id" value={category.id} />}

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={label}>نام دسته</label>
          <input id="title" name="title" defaultValue={category?.title} placeholder="مثلاً دکوراسیون" className={input} />
        </div>
        <div>
          <label htmlFor="sort" className={label}>ترتیب نمایش</label>
          <input id="sort" name="sort" inputMode="numeric" dir="ltr" defaultValue={category?.sort} className={`${input} text-left`} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>توضیح کوتاه</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category?.description}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <ImageUploader name="image" label="عکس دسته" initial={category?.image ? [category.image] : []} />

      <div>
        <p className={label}>مدل‌های این دسته</p>
        <p className="mb-3 text-xs text-stone-500">مثلاً برای «دکوراسیون»: دیوارپوش، کتابخانه، میز تلویزیون. در منوی سایت زیر همین دسته نشان داده می‌شوند.</p>
        <RowsEditor
          name="types"
          addLabel="افزودن مدل"
          emptyRow={{ id: "", title: "" }}
          initial={(category?.types ?? []).map((t) => ({ id: String(t.id), title: t.title }))}
          fields={[
            { key: "id", type: "hidden" },
            { key: "title", placeholder: "نام مدل" },
          ]}
        />
      </div>

      <p role="alert" className="min-h-6 text-sm text-red-600">{state.error}</p>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-amber-600 px-8 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
          {pending ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <Link href="/admin/categories" className="text-sm text-stone-600 transition hover:text-amber-700">انصراف</Link>
      </div>
    </form>
  );
}