import type { ConsultationInput } from "./validators";

const KEY = "mdf_consultations";

export async function submitConsultation(
  data: ConsultationInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  await new Promise((r) => setTimeout(r, 700));
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    list.push({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    return { ok: false, error: "ذخیرهٔ درخواست انجام نشد. دوباره تلاش کنید." };
  }
  return { ok: true };
}
