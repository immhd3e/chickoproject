"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { normalizeDigits } from "@/lib/format";

export type FormState = { error: string };

const validPath = (s: string) => s.startsWith("/") && !s.startsWith("//");

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { error: "دسترسی ندارید." };

  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const price = Math.round(Number(normalizeDigits(String(formData.get("price") ?? "")).replace(/[,٬\s]/g, "")));
  const typeId = Number(formData.get("typeId"));
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
  const active = formData.get("active") === "on";
  const image = String(formData.get("image") ?? "").trim();
  const images = formData.getAll("images").map(String).filter(validPath).slice(0, 10);

  if (title.length < 2) return { error: "نام محصول را وارد کنید." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { error: "آدرس صفحه فقط حروف انگلیسی کوچک، عدد و خط تیره باشد (مثلاً kids-bed)." };
  }
  if (!Number.isInteger(price) || price <= 0) return { error: "قیمت را به‌صورت عدد (تومان) وارد کنید." };
  if (!validPath(image)) return { error: "عکس اصلی را انتخاب کنید." };

  const type = await db.productType.findUnique({ where: { id: typeId } });
  if (!type) return { error: "دسته و مدل را انتخاب کنید." };

  const clash = await db.product.findFirst({ where: { slug, NOT: { id } } });
  if (clash) return { error: "این آدرس صفحه قبلاً برای محصول دیگری استفاده شده است." };

  const data = {
    title,
    slug,
    price,
    image,
    images: JSON.stringify(images),
    description,
    features: JSON.stringify(features),
    active,
    categoryId: type.categoryId,
    typeId: type.id,
  };

  if (id) await db.product.update({ where: { id }, data });
  else await db.product.create({ data });

  // سایت فوراً از داده‌های جدید بخواند
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.product.delete({ where: { id } }).catch(() => {});
  revalidatePath("/", "layout");
}