"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { useAuth } from "./AuthProvider";
import { parseIdentifier, validateSignup, type Identifier } from "@/lib/auth-utils";

type Tab = "login" | "signup";
type Step = "identify" | "password";

const inputClass =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";

export default function LoginForm({ next = "/", initialTab = "login" }: { next?: string; initialTab?: Tab }) {
  const router = useRouter();
  const { user, ready, check, login, signup } = useAuth();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [step, setStep] = useState<Step>("identify");
  const [raw, setRaw] = useState("");
  const [id, setId] = useState<Identifier | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showLoginHint, setShowLoginHint] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const clearMessages = () => {
    setError("");
    setNotice("");
    setShowLoginHint(false);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setStep("identify");
    setPassword("");
    clearMessages();
  };

  const onLoginIdentify = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseIdentifier(raw);
    if (!parsed) return setError("ایمیل یا شمارهٔ موبایل معتبر وارد کنید. مثلاً 09123456789");

    clearMessages();
    setLoading(true);
    const { exists } = await check(parsed);
    setLoading(false);

    if (exists) {
      setId(parsed);
      setStep("password");
      return;
    }
    setTab("signup");
    setNotice(`حسابی با ${parsed.value} پیدا نشد. برای ساخت حساب، اطلاعات زیر را کامل کنید.`);
  };

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !password) return setError("رمز عبور را وارد کنید.");

    clearMessages();
    setLoading(true);
    const r = await login(id, password);
    setLoading(false);

    if (!r.ok) return setError(r.error);
    router.push(next);
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseIdentifier(raw);
    if (!parsed) return setError("ایمیل یا شمارهٔ موبایل معتبر وارد کنید. مثلاً 09123456789");

    const invalid = validateSignup(name, password);
    if (invalid) return setError(invalid);

    clearMessages();
    setLoading(true);

    const { exists } = await check(parsed);
    if (exists) {
      setLoading(false);
      setError("برای این مشخصات قبلاً حساب ساخته شده است.");
      setShowLoginHint(true);
      return;
    }

    const r = await signup(parsed, name, password);
    setLoading(false);

    if (!r.ok) return setError(r.error);
    router.push(next);
  };

  const passwordField = (autoComplete: string, placeholder: string, autoFocus = false) => (
    <div className="relative">
      <input
        id="password"
        type={show ? "text" : "password"}
        dir="ltr"
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`${inputClass} pl-12 text-left`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-stone-800"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );

  const errorBlock = (
    <p role="alert" className="mt-2 min-h-6 text-sm text-red-600">
      {error}
      {showLoginHint && (
        <button type="button" onClick={() => switchTab("login")} className="mr-2 font-medium text-amber-700 underline">
          ورود به حساب
        </button>
      )}
    </p>
  );

  const labelClass = "mb-2 block text-sm font-medium text-stone-700";
  const isPasswordStep = tab === "login" && step === "password";
  const title = isPasswordStep ? "رمز عبور را وارد کنید" : tab === "login" ? "ورود به حساب" : "ساخت حساب جدید";

  return (
    <div className="w-full">
      {!isPasswordStep && (
        <div role="tablist" className="mb-8 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-semibold">
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => switchTab(t)}
              className={`rounded-lg py-2.5 transition ${tab === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}
            >
              {t === "login" ? "ورود" : "ثبت‌نام"}
            </button>
          ))}
        </div>
      )}

      <h1 className="text-2xl font-bold text-stone-900">{title}</h1>

      <p className="mt-2 text-sm leading-7 text-stone-500">
        {isPasswordStep && id ? (
          <>حساب <span dir="ltr" className="font-medium text-stone-800">{id.value}</span> پیدا شد. رمز عبور را بنویسید.</>
        ) : tab === "login" ? (
          "ایمیل یا شمارهٔ موبایلی که با آن عضو شده‌اید را وارد کنید."
        ) : (
          "نام، ایمیل یا شمارهٔ موبایل و رمز عبور را وارد کنید."
        )}
      </p>

      {notice && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">{notice}</p>}

      {tab === "login" && step === "identify" && (
        <form onSubmit={onLoginIdentify} noValidate className="mt-8">
          <label htmlFor="identifier" className={labelClass}>ایمیل یا شمارهٔ موبایل</label>
          <input
            id="identifier"
            dir="ltr"
            autoFocus
            autoComplete="username"
            placeholder="09123456789  یا  name@example.com"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className={`${inputClass} text-left`}
          />
          {errorBlock}
          <button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-xl bg-stone-950 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60">
            {loading ? "در حال بررسی..." : "ادامه"}
          </button>
          <p className="mt-6 text-center text-sm text-stone-500">
            حساب ندارید؟{" "}
            <button type="button" onClick={() => switchTab("signup")} className="font-semibold text-amber-700 hover:underline">ثبت‌نام</button>
          </p>
        </form>
      )}

      {isPasswordStep && (
        <form onSubmit={onLogin} noValidate className="mt-8">
          <label htmlFor="password" className={labelClass}>رمز عبور</label>
          {passwordField("current-password", "رمز عبور", true)}
          {errorBlock}
          <button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
            {loading ? "در حال ورود..." : "ورود"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("identify");
              setPassword("");
              clearMessages();
            }}
            className="mt-5 flex items-center gap-1 text-sm text-stone-600 transition hover:text-amber-700"
          >
            <ArrowRight size={16} />
            تغییر ایمیل یا شماره
          </button>
        </form>
      )}

      {tab === "signup" && (
        <form onSubmit={onSignup} noValidate className="mt-8">
          <label htmlFor="name" className={labelClass}>نام و نام خانوادگی</label>
          <input id="name" autoFocus autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />

          <label htmlFor="identifier" className={`${labelClass} mt-5`}>ایمیل یا شمارهٔ موبایل</label>
          <input
            id="identifier"
            dir="ltr"
            autoComplete="username"
            placeholder="09123456789  یا  name@example.com"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className={`${inputClass} text-left`}
          />

          <label htmlFor="password" className={`${labelClass} mt-5`}>رمز عبور</label>
          {passwordField("new-password", "حداقل ۸ کاراکتر")}

          {errorBlock}
          <button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60">
            {loading ? "در حال ساخت حساب..." : "ساخت حساب و ورود"}
          </button>
          <p className="mt-6 text-center text-sm text-stone-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <button type="button" onClick={() => switchTab("login")} className="font-semibold text-amber-700 hover:underline">ورود</button>
          </p>
        </form>
      )}
    </div>
  );
}
