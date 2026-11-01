"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export type FormState = { error: string };

const validPath = (s: string) => s.startsWith("/") && !s.startsWith("//");
const tmp = () => `tmp-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { error: "دسترسی ندارید." };

  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim().slice(0, 300);
  const image = String(formData.get("image") ?? "").trim();
  const sortRaw = String(formData.get("sort") ?? "").trim();

  const ids = formData.getAll("types_id").map(String);
  const rows = formData
    .getAll("types_title")
    .map((t, i) => ({ id: Number(ids[i]) || 0, title: String(t).trim() }))
    .filter((r) => r.title);

  if (title.length < 2) return { error: "نام دسته را وارد کنید." };
  if (!validPath(image)) return { error: "عکس دسته را انتخاب کنید." };
  if (new Set(rows.map((r) => r.title)).size !== rows.length) return { error: "نام مدل‌ها نباید تکراری باشد." };

  const lastSort = (await db.category.aggregate({ _max: { sort: true } }))._max.sort ?? 0;
  const sort = sortRaw !== "" && Number.isFinite(Number(sortRaw)) ? Math.round(Number(sortRaw)) : id ? undefined : lastSort + 1;

  if (id) {
    const existing = await db.productType.findMany({
      where: { categoryId: id },
      include: { _count: { select: { products: true } } },
    });
    const keep = new Set(rows.filter((r) => r.id).map((r) => r.id));
    const removed = existing.filter((t) => !keep.has(t.id));
    const blocked = removed.find((t) => t._count.products > 0);

    if (blocked) {
      return { error: `مدل «${blocked.title}» محصول دارد و حذف نمی‌شود. اول محصولاتش را به مدل دیگری ببرید.` };
    }

    await db.$transaction(async (tx) => {
      await tx.category.update({ where: { id }, data: { title, description, image, ...(sort !== undefined ? { sort } : {}) } });
      await tx.productType.deleteMany({ where: { id: { in: removed.map((t) => t.id) } } });

      for (const r of rows) {
        if (r.id && existing.some((e) => e.id === r.id)) {
          await tx.productType.update({ where: { id: r.id }, data: { title: r.title } });
        } else {
          const t = await tx.productType.create({ data: { title: r.title, slug: tmp(), categoryId: id } });
          await tx.productType.update({ where: { id: t.id }, data: { slug: `t-${t.id}` } });
        }
      }
    });
  } else {
    await db.$transaction(async (tx) => {
      const c = await tx.category.create({ data: { title, description, image, slug: tmp(), sort: sort ?? 0 } });
      await tx.category.update({ where: { id: c.id }, data: { slug: `c-${c.id}` } });

      for (const r of rows) {
        const t = await tx.productType.create({ data: { title: r.title, slug: tmp(), categoryId: c.id } });
        await tx.productType.update({ where: { id: t.id }, data: { slug: `t-${t.id}` } });
      }
    });
  }

  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const [products, collections] = await Promise.all([
    db.product.count({ where: { categoryId: id } }),
    db.collection.count({ where: { categoryId: id } }),
  ]);
  if (products || collections) redirect("/admin/categories?error=used");

  await db.category.delete({ where: { id } }).catch(() => {});
  revalidatePath("/", "layout");
}