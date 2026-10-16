import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "تماس با ما" };

type Props = { searchParams: Promise<{ subject?: string }> };

const info = [
  { icon: Phone, label: "تلفن", value: "09126518450", href: "tel:09126518450" },
  { icon: MessageCircle, label: "واتساپ", value: "پیام در واتساپ", href: "https://wa.me/9891265118450" },
  { icon: MapPin, label: "آدرس کارخانه", value: "قم ابتدای اتوبان گرمسار شهرک صنعتی  ثامن الاِمه بلوار امام رضا کوچه 28 سمت راست کارخانه ششم" },
  { icon: Clock, label: "ساعت کاری", value: "8:00am - 00:00pm" },
];
export const instant = false;
export default async function ContactPage({ searchParams }: Props) {
  const { subject } = await searchParams;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">تماس با ما</h1>
      <p className="mt-2 max-w-xl text-stone-500">
        فرم را پر کنید تا همکاران ما با شما تماس بگیرند. اگر عجله دارید، مستقیم تماس بگیرید یا در واتساپ پیام بدهید.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-3">
          <ContactForm initialSubject={subject} />
        </div>

        <aside className="space-y-4 lg:col-span-2">
          {info.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs text-stone-500">{label}</p>
                {href ? (
                  <a href={href} className="mt-0.5 block font-medium text-stone-900 transition hover:text-amber-700">{value}</a>
                ) : (
                  <p className="mt-0.5 font-medium text-stone-900">{value}</p>
                )}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
