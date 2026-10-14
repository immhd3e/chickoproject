export const toFa = (n: number) => n.toLocaleString("fa-IR");

export const formatPrice = (n?: number) =>
  typeof n === "number" ? `${toFa(n)} تومان` : "قیمت: تماس بگیرید";

export const normalizeDigits = (v: string) =>
  v
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632));