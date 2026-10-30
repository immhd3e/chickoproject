"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function markContacted(formData: FormData) {
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.consultation.update({ where: { id }, data: { status: "contacted" } });
  revalidatePath("/admin/consultations");
  revalidatePath("/admin");
}