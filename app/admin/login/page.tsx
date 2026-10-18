import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { checkAdminPassword, createAdminSession, isAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";

export const instant = false;
export const metadata: Metadata = { title: "ورود مدیر" };

async function login(formData: FormData) {
  "use server";

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (!rateLimit(`admin:${ip}`, 8, 600_000)) redirect("/admin/login?error=limit");

  if (!checkAdminPassword(String(formData.get("password") ?? ""))) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await isAdmin()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-6">
      <form action={login} className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-950 text-xl font-bold text-white">
          M
        </div>
        <h1 className="mt-5 text-2xl font-bold text-stone-900">ورود مدیر</h1>
        <p className="mt-1 text-sm text-stone-500">رمز عبور پنل مدیریت را وارد کنید.</p>

        <label htmlFor="password" className="mb-2 mt-6 block text-sm font-medium text-stone-700">
          رمز عبور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          dir="ltr"
          autoFocus
          autoComplete="current-password"
          className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-left outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />

        <p role="alert" className="mt-2 min-h-6 text-sm text-red-600">
          {error === "limit"
            ? "تلاش‌های ناموفق زیاد بود. چند دقیقه بعد دوباره امتحان کنید."
            : error
              ? "رمز عبور درست نیست."
              : ""}
        </p>

        <button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500"
        >
          ورود
        </button>
      </form>
    </div>
  );
}