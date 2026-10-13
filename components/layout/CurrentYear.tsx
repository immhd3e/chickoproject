"use client";

import { useEffect, useState } from "react";

// سال جاری را بعد از بارگذاری در مرورگر حساب می‌کند
export default function CurrentYear() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}