"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { normalizeDigits } from "@/lib/format";

export type FormState = { error: string };

const validPath = (s: string) => s.startsWith("/") && !s.startsWith("//");
const refresh = () => revalidatePath("/", "layout");

export async function savePortfolio(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { error: "دسترسی ندارید." };

  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const location = String(formData.get("location") ?? "").trim().slice(0, 80);
  const year = normalizeDigits(String(formData.get("year") ?? "")).trim().slice(0, 10);
  const image = String(formData.get("image") ?? "").trim();
  const images = formData.getAll("images").map(String).filter(validPath).slice(0, 12);
  const active = formData.get("active") === "on";
  const sortRaw = normalizeDigits(String(formData.get("sort") ?? "")).trim();
  const sort = sortRaw !== "" && Number.isFinite(Number(sortRaw)) ? Math.round(Number(sortRaw)) : 0;

  if (title.length < 2) return { error: "عنوان نمونه‌کار را وارد کنید." };
  if (!validPath(image)) return { error: "عکس اصلی را انتخاب کنید." };

  const data = { title, description, location, year, image, images: JSON.stringify(images), active, sort };

  if (id) await db.portfolio.update({ where: { id }, data });
  else await db.portfolio.create({ data });

  refresh();
  redirect("/admin/portfolio");
}

export async function deletePortfolio(formData: FormData) {
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.portfolio.delete({ where: { id } }).catch(() => {});
  refresh();
}

export async function togglePortfolio(formData: FormData) {
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  const p = await db.portfolio.findUnique({ where: { id } });
  if (!p) return;

  await db.portfolio.update({ where: { id }, data: { active: !p.active } });
  refresh();
}