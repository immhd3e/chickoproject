import { SUBJECTS } from "@/data/consultation";

export type ConsultationInput = { name: string; phone: string; subject: string; message: string };
export type ConsultationErrors = Partial<Record<keyof ConsultationInput, string>>;

export function validateConsultation(v: ConsultationInput): ConsultationErrors {
  const e: ConsultationErrors = {};
  if (v.name.trim().length < 3) e.name = "نام خود را وارد کنید.";
  if (!/^09\d{9}$/.test(v.phone)) e.phone = "شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
  if (!SUBJECTS.some((s) => s.value === v.subject)) e.subject = "نوع کار را انتخاب کنید.";
  if (v.message.length > 1000) e.message = "توضیح حداکثر ۱۰۰۰ کاراکتر باشد.";
  return e;
}
