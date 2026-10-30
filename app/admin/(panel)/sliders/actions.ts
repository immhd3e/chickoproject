
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export type FormState = {
  error: string;
};

const validPath = (value: string) =>
  value.startsWith("/") && !value.startsWith("//");

export async function saveSlider(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "دسترسی ندارید." };
  }

  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);
  const active = formData.get("active") === "on";

  if (title.length < 2) {
    return { error: "عنوان اسلایدر باید حداقل ۲ حرف باشد." };
  }

  if (!validPath(image)) {
    return { error: "لطفاً تصویر اسلایدر را انتخاب کنید." };
  }

  if (!Number.isInteger(sort) || sort < 0) {
    return { error: "ترتیب اسلایدر باید یک عدد صحیح مثبت باشد." };
  }

  const data = { title, label, image, sort, active };

  if (id > 0) {
    const existing = await db.slider.findUnique({
      where: { id },
    });

    if (!existing) {
      return { error: "اسلایدر موردنظر پیدا نشد." };
    }

    await db.slider.update({
      where: { id },
      data,
    });
  } else {
    await db.slider.create({ data });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/sliders");

  redirect("/admin/sliders");
}

export async function deleteSlider(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) return;

  await db.slider.delete({
    where: { id },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/sliders");
}

export async function toggleSlider(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) return;

  const slider = await db.slider.findUnique({
    where: { id },
  });

  if (!slider) return;

  await db.slider.update({
    where: { id },
    data: {
      active: !slider.active,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/sliders");
}

export async function moveSlider(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("دسترسی ندارید.");
  }

  const id = Number(formData.get("id"));
  const direction = String(formData.get("direction") ?? "");

  if (!Number.isInteger(id) || id <= 0) return;
  if (direction !== "up" && direction !== "down") return;

  const sliders = await db.slider.findMany({
    orderBy: [
      { sort: "asc" },
      { id: "asc" },
    ],
  });

  const currentIndex = sliders.findIndex((item) => item.id === id);

  if (currentIndex === -1) return;

  const targetIndex =
    direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= sliders.length) return;

  const current = sliders[currentIndex];
  const target = sliders[targetIndex];

  await db.$transaction([
    db.slider.update({
      where: { id: current.id },
      data: { sort: target.sort },
    }),
    db.slider.update({
      where: { id: target.id },
      data: { sort: current.sort },
    }),
  ]);

  revalidatePath("/", "layout");
  revalidatePath("/admin/sliders");
}
