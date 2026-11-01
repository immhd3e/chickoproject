import { notFound } from "next/navigation";

import CategoryForm from "@/components/admin/CategoryForm";
import { db } from "@/lib/db";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const c = await db.category.findUnique({
    where: { id: Number(id) || 0 },
    include: { types: { orderBy: { id: "asc" } } },
  });
  if (!c) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">ویرایش: {c.title}</h1>
      <CategoryForm
        category={{
          id: c.id,
          title: c.title,
          description: c.description,
          image: c.image,
          sort: c.sort,
          types: c.types.map((t) => ({ id: t.id, title: t.title })),
        }}
      />
    </>
  );
}