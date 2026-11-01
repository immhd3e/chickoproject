"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Trash2, Upload } from "lucide-react";

const MAX = 12;

// همهٔ عکس‌های یک محصول در یک جا: عکس اول، عکس اصلی است
export default function PhotoManager({
  name = "photos",
  label = "عکس‌های محصول",
  initial,
}: {
  name?: string;
  label?: string;
  initial: string[];
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
    if (added.length) setUrls((prev) => [...prev, ...added].slice(0, MAX));
  }

  const move = (i: number, dir: -1 | 1) =>
    setUrls((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const makeMain = (i: number) =>
    setUrls((prev) => [prev[i], ...prev.filter((_, k) => k !== i)]);

  const btn =
    "flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow transition hover:bg-stone-100 disabled:opacity-40";

  return (
    <div>
      <p className="mb-1 block text-sm font-medium text-stone-700">{label}</p>
      <p className="mb-3 text-xs leading-6 text-stone-500">
        چند عکس را یک‌جا انتخاب کن. عکس اول، عکس اصلی محصول است؛ با ستاره می‌توانی هر عکس را اصلی کنی.
      </p>

      {urls.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {urls.map((u, i) => (
            <div
              key={u}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-stone-100 ${i === 0 ? "border-amber-500" : "border-stone-200"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />

              {i === 0 && (
                <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  اصلی
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-2">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="جلوتر" className={btn}>
                    <ChevronRight size={15} />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === urls.length - 1} aria-label="عقب‌تر" className={btn}>
                    <ChevronLeft size={15} />
                  </button>
                </div>

                <div className="flex gap-1">
                  {i !== 0 && (
                    <button type="button" onClick={() => makeMain(i)} aria-label="اصلی کن" title="اصلی کن" className={`${btn} text-amber-600`}>
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setUrls((prev) => prev.filter((_, k) => k !== i))}
                    aria-label="حذف عکس"
                    className={`${btn} text-red-600`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <label
        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-5 py-3 text-sm text-stone-600 transition hover:border-amber-600 hover:text-amber-700 ${urls.length >= MAX ? "pointer-events-none opacity-50" : ""}`}
      >
        <Upload size={16} />
        {busy ? "در حال آپلود..." : urls.length ? "افزودن عکس" : "انتخاب عکس‌ها"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={busy || urls.length >= MAX}
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <span className="mr-3 text-xs text-stone-500">حداکثر {MAX} عکس، هرکدام تا ۵ مگابایت</span>

      <p role="alert" className="mt-1 min-h-5 text-xs text-red-600">{error}</p>

      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}
    </div>
  );
}