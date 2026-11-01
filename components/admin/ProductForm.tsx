"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import PhotoManager from "./PhotoManager";
import RowsEditor from "./RowsEditor";
import { saveProduct, type FormState } from "@/app/admin/(panel)/products/actions";
import { normalizeDigits, toFa } from "@/lib/format";

export type CategoryOption = { id: number; title: string; types: { id: number; title: string }[] };

export type ProductFormData = {
  id: number;
  title: string;
  code: string;
  price: number;
  oldPrice: number | null;
  categoryId: number;
  typeId: number | null;
  shortDescription: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  colors: { name: string; hex: string }[];
  photos: string[]; // عکس اول، عکس اصلی است
  active: boolean;
  featured: boolean;
};

const input =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";
const area =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";
const label = "mb-2 block text-sm font-medium text-stone-700";
const hint = "mt-1.5 text-xs leading-6 text-stone-500";

const defaultSpecs = [
  { label: "ابعاد", value: "" },
  { label: "گارانتی", value: "" },
  { label: "زمان ساخت", value: "" },
];

const money = (v: string) => {
  const n = Number(normalizeDigits(v).replace(/[,٬\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? `${toFa(n)} تومان` : "";
};

export default function ProductForm({
  product,
  categories,
}: {
  product: ProductFormData | null;
  categories: CategoryOption[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, { error: "" });
  const [categoryId, setCategoryId] = useState<number | "">(product?.categoryId ?? "");
  const [typeId, setTypeId] = useState<number | "">(product?.typeId ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ? String(product.oldPrice) : "");

  const types = categories.find((c) => c.id === categoryId)?.types ?? [];

  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* ───── ضروری ───── */}
      <section className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <div>
          <label htmlFor="title" className={label}>نام محصول</label>
          <input id="title" name="title" defaultValue={product?.title} placeholder="مثلاً تخت کودک" className={input} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className={label}>دسته</label>
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value ? Number(e.target.value) : "");
                setTypeId("");
              }}
              className={input}
            >
              <option value="" disabled>انتخاب کنید...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="typeId" className={label}>مدل <span className="text-stone-400">(اختیاری)</span></label>
            <select
              id="typeId"
              name="typeId"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : "")}
              disabled={!types.length}
              className={`${input} disabled:opacity-60`}
            >
              <option value="">{categoryId ? (types.length ? "بدون مدل مشخص" : "این دسته مدلی ندارد") : "اول دسته را انتخاب کنید"}</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        </div>
        <p className={hint}>دسته یا مدل جدید لازم داری؟ از منوی «دسته‌بندی‌ها» اضافه‌اش کن.</p>

        <div>
          <label htmlFor="price" className={label}>قیمت (تومان)</label>
          <input
            id="price"
            name="price"
            inputMode="numeric"
            dir="ltr"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="9800000"
            className={`${input} text-left`}
          />
          <p className="mt-1.5 min-h-5 text-sm font-medium text-amber-700">{money(price)}</p>
        </div>

        <PhotoManager initial={product?.photos ?? []} />

        <div>
          <label htmlFor="description" className={label}>توضیحات</label>
          <textarea id="description" name="description" rows={5} defaultValue={product?.description} className={area} />
        </div>
      </section>

      {/* ───── اختیاری (بسته) ───── */}
      <details className="group rounded-2xl border border-stone-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between p-6 sm:px-8">
          <span>
            <span className="block text-base font-bold text-stone-900">گزینه‌های بیشتر (اختیاری)</span>
            <span className="mt-1 block text-sm text-stone-500">تخفیف، ویژگی‌ها، مشخصات فنی، رنگ‌ها</span>
          </span>
          <span className="text-sm text-amber-700 group-open:hidden">باز کردن</span>
          <span className="hidden text-sm text-stone-500 group-open:inline">بستن</span>
        </summary>

        <div className="space-y-8 border-t border-stone-100 p-6 sm:p-8">
          <div>
            <p className="mb-3 font-bold text-stone-900">تخفیف</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="oldPrice" className={label}>قیمت قبل از تخفیف</label>
                <input
                  id="oldPrice"
                  name="oldPrice"
                  inputMode="numeric"
                  dir="ltr"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="12000000"
                  className={`${input} text-left`}
                />
                <p className="mt-1.5 min-h-5 text-sm text-stone-500">{money(oldPrice)}</p>
              </div>
            </div>
            <p className={hint}>اگر پر شود، در سایت قیمت قبلی خط می‌خورد و درصد تخفیف خودکار نشان داده می‌شود. باید بیشتر از قیمت فعلی باشد.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="code" className={label}>کد محصول</label>
              <input id="code" name="code" dir="ltr" defaultValue={product?.code} placeholder="MD-1024" className={`${input} text-left`} />
            </div>
            <div>
              <label htmlFor="shortDescription" className={label}>توضیح کوتاه برای کارت محصول</label>
              <input id="shortDescription" name="shortDescription" maxLength={160} defaultValue={product?.shortDescription} className={input} />
            </div>
          </div>

          <div>
            <label htmlFor="features" className={label}>ویژگی‌ها <span className="text-stone-400">(هر خط یک ویژگی)</span></label>
            <textarea id="features" name="features" rows={4} defaultValue={product?.features.join("\n")} className={area} />
          </div>

          <div>
            <p className="mb-1 font-bold text-stone-900">مشخصات فنی</p>
            <p className="mb-3 text-xs text-stone-500">مثل «ابعاد: ۲۰۰×۱۰۰ سانتی‌متر». ردیف‌های خالی ذخیره نمی‌شوند.</p>
            <RowsEditor
              name="specs"
              addLabel="افزودن مشخصه"
              emptyRow={{ label: "", value: "" }}
              initial={product && product.specs.length ? product.specs : defaultSpecs}
              fields={[
                { key: "label", placeholder: "عنوان", className: "w-36 sm:w-48" },
                { key: "value", placeholder: "مقدار", className: "flex-1" },
              ]}
            />
          </div>

          <div>
            <p className="mb-1 font-bold text-stone-900">رنگ‌های موجود</p>
            <p className="mb-3 text-xs text-stone-500">در صفحهٔ محصول به‌صورت دایره‌های رنگی نشان داده می‌شود.</p>
            <RowsEditor
              name="colors"
              addLabel="افزودن رنگ"
              emptyRow={{ name: "", hex: "#d9b382" }}
              initial={product?.colors ?? []}
              fields={[
                { key: "hex", type: "color" },
                { key: "name", placeholder: "نام رنگ (مثلاً گردویی)", className: "flex-1" },
              ]}
            />
          </div>
        </div>
      </details>

      {/* ───── نمایش ───── */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-2xl border border-stone-200 bg-white px-6 py-5">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-amber-600" />
          در سایت نمایش داده شود
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4 accent-amber-600" />
          محصول پیشنهادی (صفحهٔ اصلی)
        </label>
      </div>

      <p role="alert" className="min-h-6 text-sm text-red-600">{state.error}</p>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="h-12 rounded-xl bg-amber-600 px-8 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
          {pending ? "در حال ذخیره..." : "ذخیرهٔ محصول"}
        </button>
        <Link href="/admin/products" className="text-sm text-stone-600 transition hover:text-amber-700">انصراف</Link>
      </div>
    </form>
  );
}