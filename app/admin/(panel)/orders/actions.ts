"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin-auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import { setOrderStatus } from "@/lib/store";

export async function updateOrderStatus(formData: FormData) {
  // هر اکشن باید خودش دسترسی را چک کند
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !ORDER_STATUSES.includes(status as OrderStatus)) return;

  await setOrderStatus(id, status as OrderStatus);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}