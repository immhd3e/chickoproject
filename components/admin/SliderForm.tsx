
"use client";

import Link from "next/link";
import { useActionState } from "react";

import ImageUploader from "./ImageUploader";
import { saveSlider, type FormState } from "@/app/admin/(panel)/sliders/actions";

export type SliderFormData = {
  id: number;
  image: string;
  label: string;
  title: string;
  sort: number;
  active: boolean;
};

const input =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";

const label = "mb-2 block text-sm font-medium text-stone-700";

export default function SliderForm({
  slider,
}: {
  slider: SliderFormData | null;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveSlider,
    { error: "" }
  );

  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
      dir="rtl"
    >
      {slider && (
        <input type="hidden" name="id" value={slider.id} />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={label}>
            عنوان اصلی اسلایدر
          </label>
          <input
            id="title"
            name="title"
            required
            minLength={2}
            defaultValue={slider?.title ?? ""}
            placeholder="مثلاً طراحی برای زندگی بهتر"
            className={input}
          />
        </div>

        <div>
          <label htmlFor="label" className={label}>
            برچسب اسلایدر
          </label>
          <input
            id="label"
            name="label"
            defaultValue={slider?.label ?? ""}
            placeholder="مثلاً MDF CHIKO"
            className={input}
          />
        </div>

        <div>
          <label htmlFor="sort" className={label}>
            ترتیب نمایش
          </label>
          <input
            id="sort"
            name="sort"
            type="number"
            min="0"
            step="1"
            defaultValue={slider?.sort ?? 0}
            className={input}
          />
        </div>
      </div>

      <div>
        <ImageUploader
          name="image"
          label="تصویر اسلایدر"
          initial={slider?.image ? [slider.image] : []}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={slider?.active ?? true}
          className="h-4 w-4 accent-amber-600"
        />
        نمایش اسلایدر در صفحه اصلی
      </label>

      <p role="alert" className="min-h-6 text-sm text-red-600">
        {state.error}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-xl bg-amber-600 px-8 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
        >
          {pending ? "در حال ذخیره..." : "ذخیره اسلایدر"}
        </button>

        <Link
          href="/admin/sliders"
          className="text-sm text-stone-600 transition hover:text-amber-700"
        >
          انصراف
        </Link>
      </div>
    </form>
  );
}
