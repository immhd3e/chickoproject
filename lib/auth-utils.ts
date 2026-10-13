import { normalizeDigits } from "./format";

export type Identifier = { type: "phone" | "email"; value: string };

export function parseIdentifier(raw: string): Identifier | null {
  let v = normalizeDigits(raw.trim()).replace(/\s/g, "");
  if (/^(\+98|0098|98)9\d{9}$/.test(v)) v = v.replace(/^(\+98|0098|98)/, "0");
  if (/^09\d{9}$/.test(v)) return { type: "phone", value: v };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return { type: "email", value: v.toLowerCase() };
  return null;
}

export function validateSignup(name: string, password: string): string | null {
  if (name.trim().length < 3) return "نام و نام خانوادگی را وارد کنید.";
  if (password.length < 8) return "رمز عبور حداقل ۸ کاراکتر باشد.";
  if (password.length > 100) return "رمز عبور بیش از حد طولانی است.";
  return null;
}
