import SliderForm from "@/components/admin/SliderForm";

export const instant = false;

export default function NewSliderPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">
        افزودن اسلایدر جدید
      </h1>

      <SliderForm slider={null} />
    </div>
  );
}