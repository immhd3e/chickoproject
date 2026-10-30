"use client";

import Link from "next/link";
import { useActionState } from "react";

import ImageUploader from "./ImageUploader";
import { saveProduct, type FormState } from "@/app/admin/(panel)/products/actions";

export type TypeOption = { id: number; group: string; label: string };

export type ProductFormData = {
  id: number;
  title: string;
  slug: string;
  price: number;
  typeId: number | null;
  description: string;
  features: string[];
  image: string;
  images: string[];
  active: boolean;
};

const input =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";
const label = "mb-2 block text-sm font-medium text-stone-700";

export default function ProductForm({
  product,
  types,
}: {
  product: ProductFormData | null;
  types: TypeOption[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, { error: "" });

  const groups = new Map<string, TypeOption[]>();
  for (const t of types) groups.set(t.group, [...(groups.get(t.group) ?? []), t]);

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={label}>نام محصول</label>
          <input id="title" name="title" defaultValue={product?.title} className={input} />
        </div>

        <div>
          <label htmlFor="slug" className={label}>آدرس صفحه (انگلیسی)</label>
          <input
            id="slug"
            name="slug"
            dir="ltr"
            defaultValue={product?.slug}
            placeholder="kids-bed"
            className={`${input} text-left`}
          />
          <p className="mt-1 text-xs text-stone-500">فقط حروف انگلیسی کوچک، عدد و خط تیره. مثلاً: /products/kids-bed</p>
        </div>

        <div>
          <label htmlFor="price" className={label}>قیمت (تومان)</label>
          <input
            id="price"
            name="price"
            inputMode="numeric"
            dir="ltr"
            defaultValue={product?.price}
            placeholder="9800000"
            className={`${input} text-left`}
          />
        </div>

        <div>
          <label htmlFor="typeId" className={label}>دسته و مدل</label>
          <select id="typeId" name="typeId" defaultValue={product?.typeId ?? ""} className={input}>
            <option value="" disabled>انتخاب کنید...</option>
            {[...groups.entries()].map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>توضیحات</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div>
        <label htmlFor="features" className={label}>ویژگی‌ها (هر خط یک ویژگی)</label>
        <textarea
          id="features"
          name="features"
          rows={4}
          defaultValue={product?.features.join("\n")}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageUploader name="image" label="عکس اصلی" initial={product?.image ? [product.image] : []} />
        <ImageUploader name="images" label="عکس‌های بیشتر (گالری)" initial={product?.images ?? []} multiple />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-amber-600" />
        در سایت نمایش داده شود
      </label>

      <p role="alert" className="min-h-6 text-sm text-red-600">{state.error}</p>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-xl bg-amber-600 px-8 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
        >
          {pending ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <Link href="/admin/products" className="text-sm text-stone-600 transition hover:text-amber-700">
          انصراف
        </Link>
      </div>
    </form>
  );
}