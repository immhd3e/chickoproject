
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { normalizeDigits } from "@/lib/format";

export type FormState = { error: string };

const validPath = (s: string) => s.startsWith("/") && !s.startsWith("//");

const tmp = () =>
  `tmp-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

const toNumber = (v: FormDataEntryValue | null) => {
  const s = normalizeDigits(String(v ?? "")).replace(/[,٬\s]/g, "");
  return s === "" ? null : Math.round(Number(s));
};

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveProduct(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "دسترسی ندارید." };
  }

  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().slice(0, 30);
  const price = toNumber(formData.get("price"));
  const oldPrice = toNumber(formData.get("oldPrice"));

  const shortDescription = String(formData.get("shortDescription") ?? "")
    .trim()
    .slice(0, 160);

  const description = String(formData.get("description") ?? "")
    .trim()
    .slice(0, 3000);

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);

  // دریافت عکس‌ها
  const photos = formData
    .getAll("photos")
    .map(String)
    .filter(validPath)
    .slice(0, 12);

  const image = photos[0] ?? "";
  const images = photos;

  const active = formData.get("active") === "on";
  const featured = formData.get("featured") === "on";

  // دریافت دسته‌بندی و مدل از فرم
  const categoryId = Number(formData.get("categoryId"));

  const rawTypeId = String(formData.get("typeId") ?? "");
  const typeId: number | null = rawTypeId ? Number(rawTypeId) : null;

  // دریافت مشخصات فنی
  const labels = formData
    .getAll("specs_label")
    .map((s) => String(s).trim());

  const values = formData
    .getAll("specs_value")
    .map((s) => String(s).trim());

  const specs = labels
    .map((label, i) => ({
      label: label.slice(0, 40),
      value: (values[i] ?? "").slice(0, 120),
    }))
    .filter((s) => s.label && s.value)
    .slice(0, 20);

  // دریافت رنگ‌ها
  const names = formData
    .getAll("colors_name")
    .map((s) => String(s).trim());

  const hexes = formData.getAll("colors_hex").map(String);

  const colors = names
    .map((name, i) => ({
      name: name.slice(0, 30),
      hex: hexes[i] ?? "",
    }))
    .filter((c) => c.name && /^#[0-9a-fA-F]{6}$/.test(c.hex))
    .slice(0, 12);

  // اعتبارسنجی اطلاعات محصول
  if (title.length < 2) {
    return { error: "نام محصول را وارد کنید." };
  }

  if (price === null || !Number.isInteger(price) || price <= 0) {
    return { error: "قیمت را به‌صورت عدد (تومان) وارد کنید." };
  }

  if (
    oldPrice !== null &&
    (!Number.isInteger(oldPrice) || oldPrice <= price)
  ) {
    return {
      error:
        "قیمت قبل از تخفیف باید بیشتر از قیمت فعلی باشد (یا خالی بماند).",
    };
  }

  if (!validPath(image)) {
    return { error: "حداقل یک عکس برای محصول بگذارید." };
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return { error: "لطفاً دسته‌بندی محصول را انتخاب کنید." };
  }

  // بررسی وجود دسته‌بندی
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { error: "دسته‌بندی انتخاب‌شده معتبر نیست." };
  }

  // بررسی مدل انتخاب‌شده (اختیاری)
  if (typeId !== null) {
    if (!Number.isInteger(typeId) || typeId <= 0) {
      return { error: "مدل انتخاب‌شده معتبر نیست." };
    }

    const type = await db.productType.findFirst({
      where: {
        id: typeId,
        categoryId,
      },
    });

    if (!type) {
      return { error: "مدل انتخاب‌شده معتبر نیست." };
    }
  }

  // اطلاعات نهایی محصول
  const data = {
    title,
    code: code || null,
    price,
    oldPrice,
    image,
    images: JSON.stringify(images),
    shortDescription,
    description,
    features: JSON.stringify(features),
    specs: JSON.stringify(specs),
    colors: JSON.stringify(colors),
    active,
    featured,
    categoryId,
    typeId,
  };

  // ثبت یا ویرایش محصول
  if (id) {
    await db.product.update({
      where: { id },
      data,
    });
  } else {
    const p = await db.product.create({
      data: {
        ...data,
        slug: tmp(),
      },
    });

    await db.product.update({
      where: { id: p.id },
      data: { slug: `p-${p.id}` },
    });
  }

  refresh();
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) return;

  await db.product.delete({ where: { id } }).catch(() => {});
  refresh();
}

export async function toggleActive(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const p = await db.product.findUnique({ where: { id } });
  if (!p) return;

  await db.product.update({
    where: { id },
    data: { active: !p.active },
  });

  refresh();
}

export async function toggleFeatured(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const p = await db.product.findUnique({ where: { id } });
  if (!p) return;

  await db.product.update({
    where: { id },
    data: { featured: !p.featured },
  });

  refresh();
}

export async function duplicateProduct(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const src = await db.product.findUnique({
    where: { id: Number(formData.get("id")) },
  });

  if (!src) return;

  const {
    id: _id,
    createdAt: _c,
    updatedAt: _u,
    slug: _s,
    ...rest
  } = src;

  const copy = await db.product.create({
    data: {
      ...rest,
      title: `${src.title} (کپی)`,
      active: false,
      featured: false,
      code: null,
      slug: tmp(),
    },
  });

  await db.product.update({
    where: { id: copy.id },
    data: { slug: `p-${copy.id}` },
  });

  refresh();
  redirect(`/admin/products/${copy.id}`);
}
