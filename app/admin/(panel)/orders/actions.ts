"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

export async function updateOrderStatus(formData: FormData) {
  // هر اکشن باید خودش دسترسی را چک کند
  if (!(await isAdmin())) throw new Error("دسترسی ندارید.");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !ORDER_STATUSES.includes(status as OrderStatus)) return;

  await db.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}