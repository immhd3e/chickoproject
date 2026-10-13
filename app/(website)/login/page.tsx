import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "ورود / ثبت‌نام" };

type Props = { searchParams: Promise<{ next?: string; tab?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next, tab } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <section className="mx-auto my-12 grid max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm lg:grid-cols-2">
      <div className="flex items-center px-6 py-12 sm:px-12">
        <LoginForm next={safeNext} initialTab={tab === "signup" ? "signup" : "login"} />
      </div>

      <div className="hidden flex-col justify-between bg-stone-950 p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-stone-950">M</div>
          <div className="text-xl font-bold">MDF<span className="text-amber-500">Factory</span></div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest text-amber-500">WOOD &amp; INTERIOR</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.6]">حساب شما، همراه هر سفارش</h2>
          <ul className="mt-6 space-y-3 text-sm text-stone-300">
            <li>پیگیری سفارش‌ها و وضعیت ساخت</li>
            <li>ذخیرهٔ آدرس و اطلاعات برای خرید بعدی</li>
            <li>سبد خرید همیشه همراه شماست</li>
          </ul>
        </div>
        <p className="text-xs text-stone-500">ورود به معنای پذیرش قوانین و حریم خصوصی است.</p>
      </div>
    </section>
  );
}
