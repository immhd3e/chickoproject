import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { saveImage } from "@/lib/uploads";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "دسترسی ندارید." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "فایلی ارسال نشد." }, { status: 400 });

  try {
    return NextResponse.json({ url: await saveImage(file) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "آپلود انجام نشد." }, { status: 400 });
  }
}