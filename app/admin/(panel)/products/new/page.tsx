import ProductForm from "@/components/admin/ProductForm";
import { getTypeOptions } from "@/lib/admin-data";

export const instant = false;

export default async function NewProductPage() {
  const types = await getTypeOptions();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">افزودن محصول</h1>
      <ProductForm product={null} types={types} />
    </>
  );
}