
"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useState } from "react";

const suggestions = [
  {
    title: "کمد دیواری",
    href: "/products?category=wardrobes",
  },
  {
    title: "سرویس خواب",
    href: "/products?category=bedroom",
  },
  {
    title: "اتاق کودک",
    href: "/products?category=kids-room",
  },
  {
    title: "میز تحریر",
    href: "/products?category=tables-bookcases",
  },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = suggestions.filter((item) =>
    item.title.includes(query.trim())
  );

  const showSuggestions = isFocused && query.trim().length > 0;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={19}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
        />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="جستجو در محصولات..."
          className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-12 pl-10 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="پاک کردن جستجو"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <>
          {/* Background Click Area */}
          <button
            type="button"
            aria-label="بستن پیشنهادهای جستجو"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsFocused(false)}
          />

          {/* Suggestions Box */}
          <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <div className="border-b border-stone-100 px-4 py-3">
              <p className="text-xs font-semibold text-stone-400">
                نتایج پیشنهادی
              </p>
            </div>

            {filteredSuggestions.length > 0 ? (
              <div className="p-2">
                {filteredSuggestions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setIsFocused(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-stone-700 transition hover:bg-stone-50 hover:text-amber-700"
                  >
                    <span>{item.title}</span>

                    <Search
                      size={16}
                      className="text-stone-400"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-stone-500">
                  نتیجه‌ای پیدا نشد.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

