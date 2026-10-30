import { notFound } from "next/navigation";

import SliderForm from "@/components/admin/SliderForm";
import { db } from "@/lib/db";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSliderPage({ params }: Props) {
  const { id } = await params;

  const slider = await db.slider.findUnique({
    where: { id: Number(id) || 0 },
  });

  if (!slider) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">
        ویرایش اسلایدر: {slider.title}
      </h1>

      <SliderForm
        slider={{
          id: slider.id,
          image: slider.image,
          label: slider.label,
          title: slider.title,
          sort: slider.sort,
          active: slider.active,
        }}
      />
    </div>
  );
}