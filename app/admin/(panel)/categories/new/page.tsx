import CategoryForm from "@/components/admin/CategoryForm";

export const instant = false;

export default function NewCategoryPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">افزودن دسته</h1>
      <CategoryForm category={null} />
    </>
  );
}