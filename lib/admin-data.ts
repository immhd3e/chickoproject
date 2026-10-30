import { db } from "./db";

export async function getTypeOptions() {
  const types = await db.productType.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { id: "asc" }],
  });

  return types.map((t) => ({ id: t.id, group: t.category.title, label: t.title }));
}