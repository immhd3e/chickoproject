import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getIp, rateLimit } from "@/lib/rate-limit";
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

  try {
    // همین شماره در ۱۰ دقیقهٔ اخیر درخواست داده؟ دوباره ثبت نمی‌کنیم
    const recent = await db.consultation.findFirst({
      where: { phone: data.phone, createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) } },
    });
    if (!recent) await db.consultation.create({ data });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[consultation]", e);
    return NextResponse.json({ error: "ثبت درخواست انجام نشد. دوباره تلاش کنید." }, { status: 500 });
  }
}