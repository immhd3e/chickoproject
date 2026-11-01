"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type RowField = {
  key: string;
  placeholder?: string;
  type?: "text" | "color" | "hidden";
  className?: string;
};

type Row = Record<string, string>;

// ردیف‌های قابل‌افزودن و حذف. هر ستون با اسم `${name}_${key}` به سرور می‌رود.
export default function RowsEditor({
  name,
  fields,
  initial,
  addLabel,
  emptyRow,
}: {
  name: string;
  fields: RowField[];
  initial: Row[];
  addLabel: string;
  emptyRow: Row;
}) {
  const [rows, setRows] = useState(() => initial.map((v, k) => ({ k, v })));
  const [next, setNext] = useState(initial.length);

  return (
    <div className="space-y-2">
      {rows.map(({ k, v }) => (
        <div key={k} className="flex items-center gap-2">
          {fields.map((f) =>
            f.type === "hidden" ? (
              <input key={f.key} type="hidden" name={`${name}_${f.key}`} value={v[f.key] ?? ""} readOnly />
            ) : f.type === "color" ? (
              <input
                key={f.key}
                type="color"
                name={`${name}_${f.key}`}
                defaultValue={v[f.key] || "#d9b382"}
                className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
              />
            ) : (
              <input
                key={f.key}
                type="text"
                name={`${name}_${f.key}`}
                defaultValue={v[f.key]}
                placeholder={f.placeholder}
                className={`h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100 ${f.className ?? "flex-1"}`}
              />
            )
          )}
          <button
            type="button"
            onClick={() => setRows((r) => r.filter((x) => x.k !== k))}
            aria-label="حذف ردیف"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-stone-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          setRows((r) => [...r, { k: next, v: { ...emptyRow } }]);
          setNext(next + 1);
        }}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-stone-300 px-4 py-2 text-sm text-stone-600 transition hover:border-amber-600 hover:text-amber-700"
      >
        <Plus size={15} />
        {addLabel}
      </button>
    </div>
  );
}