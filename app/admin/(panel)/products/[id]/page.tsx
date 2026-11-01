import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { getCategoryOptions } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { parseColors, parseList, parseSpecs } from "@/lib/json-list";
import { duplicateProduct } from "../actions";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const p = await db.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!p) notFound();

  const categories = await getCategoryOptions();

  // عکس اصلی همیشه اول است و عکس‌های گالری بعد از آن می‌آیند
  const photos = [p.image, ...parseList(p.images).filter((x) => x !== p.image)];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">ویرایش: {p.title}</h1>
        <form action={duplicateProduct}>
          <input type="hidden" name="id" value={p.id} />
          <button type="submit" className="text-sm text-stone-600 transition hover:text-amber-700">
            ساخت یک کپی از این محصول
          </button>
        </form>
      </div>

      <ProductForm
        categories={categories}
        product={{
          id: p.id,
          title: p.title,
          code: p.code ?? "",
          price: p.price,
          oldPrice: p.oldPrice,
          categoryId: p.categoryId,
          typeId: p.typeId,
          shortDescription: p.shortDescription,
          description: p.description,
          features: parseList(p.features),
          specs: parseSpecs(p.specs),
          colors: parseColors(p.colors),
          photos,
          active: p.active,
          featured: p.featured,
        }}
      />
    </>
  );
}