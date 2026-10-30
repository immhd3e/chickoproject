// لیست‌ها (عکس‌ها و ویژگی‌ها) در دیتابیس به‌صورت JSON ذخیره می‌شوند
export function parseList(value: string): string[] {
  try {
    const data = JSON.parse(value);
    return Array.isArray(data) ? data.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}