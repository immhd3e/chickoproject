import { NextResponse } from "next/server";

import { getIp, rateLimit } from "@/lib/rate-limit";
import { addConsultation } from "@/lib/store";
import { validateConsultation } from "@/lib/validators";

export async function POST(req: Request) {
  if (!rateLimit(`consult:${getIp(req)}`, 10, 3_600_000)) {
    return NextResponse.json({ error: "تعداد درخواست‌ها زیاد است. بعداً تلاش کنید." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });

  const data = {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    subject: String(body.subject ?? ""),
    message: String(body.message ?? "").trim(),
  };

  if (Object.keys(validateConsultation(data)).length) {
    return NextResponse.json({ error: "اطلاعات فرم را بررسی کنید." }, { status: 400 });
  }

  await addConsultation(data);
  return NextResponse.json({ ok: true });
}