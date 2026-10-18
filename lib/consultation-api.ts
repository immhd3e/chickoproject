import type { ConsultationInput } from "./validators";

export async function submitConsultation(
  data: ConsultationInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: json.error ?? "اطلاعات فرم را بررسی کنید." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "ارتباط با سرور برقرار نشد. اینترنت را بررسی کنید." };
  }
}