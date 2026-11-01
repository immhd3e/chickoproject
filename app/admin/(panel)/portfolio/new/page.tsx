import PortfolioForm from "@/components/admin/PortfolioForm";

export const instant = false;

export default function NewPortfolioPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">افزودن نمونه‌کار</h1>
      <PortfolioForm item={null} />
    </>
  );
}