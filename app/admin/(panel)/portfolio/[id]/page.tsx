import { notFound } from "next/navigation";

import PortfolioForm from "@/components/admin/PortfolioForm";
import { db } from "@/lib/db";
import { parseList } from "@/lib/json-list";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function EditPortfolioPage({ params }: Props) {
  const { id } = await params;
  const p = await db.portfolio.findUnique({ where: { id: Number(id) || 0 } });
  if (!p) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">ویرایش: {p.title}</h1>
      <PortfolioForm
        item={{
          id: p.id,
          title: p.title,
          description: p.description,
          location: p.location,
          year: p.year,
          image: p.image,
          images: parseList(p.images),
          active: p.active,
          sort: p.sort,
        }}
      />
    </>
  );
}