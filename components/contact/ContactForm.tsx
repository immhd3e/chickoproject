"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { SUBJECTS } from "@/data/consultation";
import { submitConsultation } from "@/lib/consultation-api";
import { normalizeDigits } from "@/lib/format";
import { validateConsultation, type ConsultationErrors } from "@/lib/validators";

const field =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";

const onlyDigits = (v: string) => normalizeDigits(v).replace(/\D/g, "");

export default function ContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(SUBJECTS.some((s) => s.value === initialSubject) ? initialSubject : "");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ConsultationErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentPhone, setSentPhone] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    const data = { name: name.trim(), phone: onlyDigits(phone), subject, message: message.trim() };
    const found = validateConsultation(data);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    const r = await submitConsultation(data);
    setLoading(false);

    if (!r.ok) return setServerError(r.error);
    setSentPhone(data.phone);
  };

  const reset = () => {
    setName("");
    setPhone("");
    setMessage("");
    setErrors({});
    setSentPhone("");
  };

  if (sentPhone) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <CheckCircle2 size={56} className="text-green-600" />
        <h2 className="mt-5 text-xl font-bold text-stone-900">درخواست شما ثبت شد</h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-stone-500">
          همکاران ما در اولین فرصت با شمارهٔ <span dir="ltr" className="font-medium text-stone-800">{sentPhone}</span> تماس می‌گیرند.
        </p>
        <button type="button" onClick={reset} className="mt-6 rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium transition hover:border-amber-600 hover:text-amber-700">
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  const err = (m?: string) => <p role="alert" className="mt-1 min-h-5 text-xs text-red-600">{m}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">نام و نام خانوادگی</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className={`${field} h-12`} />
        {err(errors.name)}
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-stone-700">شمارهٔ موبایل</label>
        <input id="phone" type="tel" inputMode="numeric" dir="ltr" maxLength={11} placeholder="09123456789" value={phone} onChange={(e) => setPhone(onlyDigits(e.target.value))} autoComplete="tel" aria-invalid={!!errors.phone} className={`${field} h-12 text-left tracking-wider`} />
        {err(errors.phone)}
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium text-stone-700">نوع کار</label>
        <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} aria-invalid={!!errors.subject} className={`${field} h-12`}>
          <option value="" disabled>انتخاب کنید...</option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {err(errors.subject)}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-stone-700">
          توضیحات <span className="text-stone-400">(اختیاری)</span>
        </label>
        <textarea id="message" rows={4} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="ابعاد فضا، رنگ مدنظر یا هر نکته‌ای که فکر می‌کنید مهم است" className={`${field} py-3 leading-7`} />
        {err(errors.message)}
      </div>

      {serverError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

      <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
        {loading ? "در حال ارسال..." : "ارسال درخواست مشاوره"}
      </button>
    </form>
  );
}
