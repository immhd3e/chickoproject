import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const base = light ? "text-stone-300" : "text-stone-500";
  const hover = light ? "hover:text-white" : "hover:text-amber-700";
  const current = light ? "text-white" : "text-stone-900";

  return (
    <nav aria-label="مسیر صفحه" className={`flex flex-wrap items-center gap-1.5 text-xs sm:text-sm ${base}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className={`transition ${hover}`}>
              {item.label}
            </Link>
          ) : (
            <span className={`font-medium ${current}`}>{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronLeft size={14} />}
        </span>
      ))}
    </nav>
  );
}