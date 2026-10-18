"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin-auth";
import { markConsultationContacted } from "@/lib/store";

export async function markContacted(formData: FormData) {
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await markConsultationContacted(id);
  revalidatePath("/admin/consultations");
  revalidatePath("/admin");
}