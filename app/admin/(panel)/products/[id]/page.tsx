import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { getTypeOptions } from "@/lib/admin-data";
import { db } from "@/lib/db";
import { parseList } from "@/lib/json-list";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!product) notFound();

  const types = await getTypeOptions();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">ویرایش: {product.title}</h1>
      <ProductForm
        types={types}
        product={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          typeId: product.typeId,
          description: product.description,
          features: parseList(product.features),
          image: product.image,
          images: parseList(product.images),
          active: product.active,
        }}
      />
    </>
  );
}