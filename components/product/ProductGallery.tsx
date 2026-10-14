"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
        <Image src={images[i]} alt={title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, k) => (
            <button
              key={`${src}-${k}`}
              type="button"
              onClick={() => setI(k)}
              aria-label={`تصویر ${k + 1}`}
              aria-current={k === i}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-stone-100 transition ${
                k === i ? "border-amber-600" : "border-transparent hover:border-stone-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}