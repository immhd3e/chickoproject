import { db } from "./db";

// دسته‌ها همراه با مدل‌هایشان، برای انتخاب در فرم محصول
export async function getCategoryOptions() {
  const cats = await db.category.findMany({
    orderBy: [{ sort: "asc" }, { id: "asc" }],
    include: { types: { orderBy: { id: "asc" } } },
  });

  return cats.map((c) => ({
    id: c.id,
    title: c.title,
    types: c.types.map((t) => ({ id: t.id, title: t.title })),
  }));
}