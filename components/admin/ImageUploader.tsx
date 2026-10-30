"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";

export default function ImageUploader({
  name,
  label,
  initial,
  multiple = false,
  max = 10,
}: {
  name: string;
  label: string;
  initial: string[];
  multiple?: boolean;
  max?: number;
}) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;

    setError("");
    setBusy(true);
    const added: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error ?? "آپلود انجام نشد.");
          break;
        }
        added.push(json.url);
      } catch {
        setError("ارتباط با سرور برقرار نشد.");
        break;
      }
    }

    setBusy(false);
    if (added.length) {
      setUrls((prev) => (multiple ? [...prev, ...added].slice(0, max) : [added[added.length - 1]]));
    }
  }

  return (
    <div>
      <p className="mb-2 block text-sm font-medium text-stone-700">{label}</p>

      {urls.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((u) => (
            <div key={u} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
                aria-label="حذف عکس"
                className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow transition hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-2.5 text-sm text-stone-600 transition hover:border-amber-600 hover:text-amber-700">
        <Upload size={16} />
        {busy ? "در حال آپلود..." : multiple ? "افزودن عکس" : urls.length ? "تغییر عکس" : "انتخاب عکس"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          disabled={busy}
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <p role="alert" className="mt-1 min-h-5 text-xs text-red-600">{error}</p>

      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}
    </div>
  );
}